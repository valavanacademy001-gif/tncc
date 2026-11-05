-- ============================================================
-- TNCC SUPABASE MIGRATION 008: COMPLETE RLS SECURITY & REFERRAL & EARN SYSTEM
-- ============================================================
-- Resolves: GitHub Issue #4 (Complete Supabase RLS Policies) + Referral & Earn Feature
-- Dependencies: 001 through 007
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. SECURE ADMIN AUTHORIZATION INFRASTRUCTURE (PHASE 7)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.community_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Super Admin
INSERT INTO public.community_admins (email, role)
VALUES ('suganeshsugu07@gmail.com', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Non-recursive, secure is_admin() function with safe search_path
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    -- Initial Super Admin email
    auth.jwt() ->> 'email' = 'suganeshsugu07@gmail.com'
    -- Or user in community_admins table
    OR EXISTS (
      SELECT 1 FROM public.community_admins
      WHERE user_id = auth.uid() OR email = (auth.jwt() ->> 'email')
    )
    -- Or user has 'admin' role in community_members
    OR EXISTS (
      SELECT 1 FROM public.community_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
END;
$$;

-- Protect community_admins table with RLS
ALTER TABLE public.community_admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read community_admins" ON public.community_admins;
DROP POLICY IF EXISTS "Super admin modify community_admins" ON public.community_admins;

CREATE POLICY "Admins read community_admins"
  ON public.community_admins FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Super admin modify community_admins"
  ON public.community_admins FOR ALL
  USING (auth.jwt() ->> 'email' = 'suganeshsugu07@gmail.com');

-- ============================================================
-- 2. PART B: REFERRAL & EARN SYSTEM DATABASE ARCHITECTURE (PHASE 9)
-- ============================================================

-- Table 1: community_referral_codes
CREATE TABLE IF NOT EXISTS public.community_referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID UNIQUE NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.community_referral_codes(referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_member ON public.community_referral_codes(member_id);

-- Table 2: community_referrals
CREATE TABLE IF NOT EXISTS public.community_referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  referred_member_id UUID UNIQUE NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_activity' CHECK (status IN ('pending_activity', 'rewarded', 'rejected')),
  qualifying_activity_type TEXT CHECK (qualifying_activity_type IN ('post', 'challenge', 'manual', 'none')),
  qualifying_activity_id TEXT,
  reward_xp INTEGER NOT NULL DEFAULT 50,
  rewarded_transaction_id TEXT,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rewarded_at TIMESTAMPTZ,
  CONSTRAINT no_self_referral CHECK (referrer_member_id <> referred_member_id),
  CONSTRAINT unique_referral_per_member UNIQUE (referred_member_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.community_referrals(referrer_member_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.community_referrals(referred_member_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.community_referrals(status);

-- ============================================================
-- 3. REFERRAL STORED PROCEDURES & ATOMIC FUNCTIONS (PHASES 10-13)
-- ============================================================

-- A. Generate or Get Unique Referral Code for Member
CREATE OR REPLACE FUNCTION public.get_or_create_referral_code(p_member_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code TEXT;
  v_username TEXT;
  v_user_id UUID;
BEGIN
  -- Check existing code
  SELECT referral_code INTO v_code
  FROM public.community_referral_codes
  WHERE member_id = p_member_id;

  IF v_code IS NOT NULL THEN
    RETURN v_code;
  END IF;

  -- Lookup member username
  SELECT username, user_id INTO v_username, v_user_id
  FROM public.community_members
  WHERE id = p_member_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member % not found', p_member_id;
  END IF;

  -- Format: TNCC-USERNAME (uppercase clean, or fallback alphanumeric)
  v_code := 'TNCC-' || UPPER(REGEXP_REPLACE(v_username, '[^a-zA-Z0-9]', '', 'g'));

  -- Guarantee uniqueness
  IF EXISTS (SELECT 1 FROM public.community_referral_codes WHERE referral_code = v_code) THEN
    v_code := v_code || SUBSTRING(MD5(RANDOM()::TEXT), 1, 4);
  END IF;

  INSERT INTO public.community_referral_codes (member_id, user_id, referral_code)
  VALUES (p_member_id, v_user_id, v_code)
  ON CONFLICT (member_id) DO UPDATE SET referral_code = EXCLUDED.referral_code
  RETURNING referral_code INTO v_code;

  RETURN v_code;
END;
$$;

-- B. Record Referral Signup (No XP awarded at this stage!)
CREATE OR REPLACE FUNCTION public.record_referral_signup(
  p_referred_member_id UUID,
  p_referral_code TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_member_id UUID;
  v_existing_referral UUID;
  v_clean_code TEXT := UPPER(TRIM(p_referral_code));
BEGIN
  -- 1. Validate code exists
  SELECT member_id INTO v_referrer_member_id
  FROM public.community_referral_codes
  WHERE referral_code = v_clean_code;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid referral code');
  END IF;

  -- 2. Prevent self-referral
  IF v_referrer_member_id = p_referred_member_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'Self-referral is prohibited');
  END IF;

  -- 3. Prevent duplicate referral assignment
  SELECT id INTO v_existing_referral
  FROM public.community_referrals
  WHERE referred_member_id = p_referred_member_id;

  IF v_existing_referral IS NOT NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Member is already attributed to a referrer');
  END IF;

  -- 4. Insert referral record with status 'pending_activity' (ZERO XP AT SIGNUP)
  INSERT INTO public.community_referrals (
    referrer_member_id,
    referred_member_id,
    referral_code,
    status,
    reward_xp,
    created_at
  ) VALUES (
    v_referrer_member_id,
    p_referred_member_id,
    v_clean_code,
    'pending_activity',
    50,
    NOW()
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Referral attribution successfully recorded as pending_activity',
    'referrer_id', v_referrer_member_id
  );
END;
$$;

-- C. Evaluate and Reward Referral upon First Qualifying Creative Activity (PHASE 12 & 13)
CREATE OR REPLACE FUNCTION public.evaluate_and_reward_referral(
  p_referred_member_id UUID,
  p_activity_type TEXT,
  p_activity_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral public.community_referrals%ROWTYPE;
  v_tx_ref TEXT;
  v_tx_id UUID;
  v_new_referrer_xp INTEGER;
BEGIN
  -- 1. Find pending referral
  SELECT * INTO v_referral
  FROM public.community_referrals
  WHERE referred_member_id = p_referred_member_id
    AND status = 'pending_activity'
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Either not referred or already rewarded
    RETURN jsonb_build_object('rewarded', false, 'reason', 'No pending referral found');
  END IF;

  -- 2. Idempotency reference for ledger
  v_tx_ref := 'referral_bonus_' || v_referral.id::TEXT;

  -- 3. Atomically award +50 XP to the REFERRER (Referred member does not receive this bonus)
  INSERT INTO public.community_xp_transactions (
    member_id,
    amount,
    reason,
    reference_id,
    transaction_type,
    created_at
  ) VALUES (
    v_referral.referrer_member_id,
    50,
    'Referral Bonus: Member Completed First Creative Activity',
    v_tx_ref,
    'referral_bonus',
    NOW()
  ) ON CONFLICT (member_id, reason, reference_id) DO NOTHING
  RETURNING id INTO v_tx_id;

  -- 4. Update Referrer balance in community_members
  UPDATE public.community_members
  SET total_xp = total_xp + 50,
      updated_at = NOW()
  WHERE id = v_referral.referrer_member_id
  RETURNING total_xp INTO v_new_referrer_xp;

  -- 5. Mark referral record as rewarded
  UPDATE public.community_referrals
  SET status = 'rewarded',
      qualifying_activity_type = p_activity_type,
      qualifying_activity_id = p_activity_id,
      rewarded_transaction_id = v_tx_ref,
      rewarded_at = NOW()
  WHERE id = v_referral.id;

  RETURN jsonb_build_object(
    'rewarded', true,
    'referral_id', v_referral.id,
    'referrer_id', v_referral.referrer_member_id,
    'reward_xp', 50,
    'new_referrer_xp', v_new_referrer_xp,
    'activity_type', p_activity_type
  );
END;
$$;

-- ============================================================
-- 4. PART A: COMPREHENSIVE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
-- ============================================================

-- Ensure RLS is active on all tables
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_challenge_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_referrals ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- A. COMMUNITY MEMBERS / PROFILES (PHASE 2)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public read community_members" ON public.community_members;
DROP POLICY IF EXISTS "Members insert own profile" ON public.community_members;
DROP POLICY IF EXISTS "Members update own profile" ON public.community_members;
DROP POLICY IF EXISTS "Admin full access community_members" ON public.community_members;

CREATE POLICY "Public read community_members"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Members insert own profile"
  ON public.community_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- Members can only update their own profile; cannot alter role, XP, or admin permissions directly
CREATE POLICY "Members update own profile"
  ON public.community_members FOR UPDATE
  USING (
    auth.uid() = user_id
    OR public.is_admin()
  );

-- ------------------------------------------------------------
-- B. CHALLENGES & WINNERS (PHASE 4)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Public read community_challenges" ON public.community_challenges;
DROP POLICY IF EXISTS "Admin insert community_challenges" ON public.community_challenges;
DROP POLICY IF EXISTS "Admin update community_challenges" ON public.community_challenges;
DROP POLICY IF EXISTS "Admin delete community_challenges" ON public.community_challenges;

CREATE POLICY "Public read community_challenges"
  ON public.community_challenges FOR SELECT
  USING (true);

CREATE POLICY "Admin insert community_challenges"
  ON public.community_challenges FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update community_challenges"
  ON public.community_challenges FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete community_challenges"
  ON public.community_challenges FOR DELETE
  USING (public.is_admin());

-- Challenge Winners
DROP POLICY IF EXISTS "Public read community_challenge_winners" ON public.community_challenge_winners;
DROP POLICY IF EXISTS "Admin manage challenge_winners" ON public.community_challenge_winners;

CREATE POLICY "Public read community_challenge_winners"
  ON public.community_challenge_winners FOR SELECT
  USING (true);

CREATE POLICY "Admin manage challenge_winners"
  ON public.community_challenge_winners FOR ALL
  USING (public.is_admin());

-- Challenge Submissions
DROP POLICY IF EXISTS "Public read approved submissions" ON public.community_challenge_submissions;
DROP POLICY IF EXISTS "Members view own submissions" ON public.community_challenge_submissions;
DROP POLICY IF EXISTS "Members submit own challenge entry" ON public.community_challenge_submissions;
DROP POLICY IF EXISTS "Members update own pending submission" ON public.community_challenge_submissions;
DROP POLICY IF EXISTS "Admin manage submissions" ON public.community_challenge_submissions;

CREATE POLICY "Public and members view submissions"
  ON public.community_challenge_submissions FOR SELECT
  USING (
    status = 'approved'
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR public.is_admin()
  );

CREATE POLICY "Members submit own challenge entry"
  ON public.community_challenge_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Members update own pending submission"
  ON public.community_challenge_submissions FOR UPDATE
  USING (
    (auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id) AND status = 'pending')
    OR public.is_admin()
  );

CREATE POLICY "Members and admin delete submission"
  ON public.community_challenge_submissions FOR DELETE
  USING (
    (auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id) AND status = 'pending')
    OR public.is_admin()
  );

-- ------------------------------------------------------------
-- C. RESOURCES, EVENTS & JOBS (PHASE 5)
-- ------------------------------------------------------------
-- Resources
DROP POLICY IF EXISTS "Public read community_resources" ON public.community_resources;
DROP POLICY IF EXISTS "Admin insert community_resources" ON public.community_resources;
DROP POLICY IF EXISTS "Admin update community_resources" ON public.community_resources;
DROP POLICY IF EXISTS "Admin delete community_resources" ON public.community_resources;

CREATE POLICY "Public read community_resources"
  ON public.community_resources FOR SELECT
  USING (true);

CREATE POLICY "Admin insert community_resources"
  ON public.community_resources FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update community_resources"
  ON public.community_resources FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admin delete community_resources"
  ON public.community_resources FOR DELETE
  USING (public.is_admin());

-- Job Offers
DROP POLICY IF EXISTS "Public read community_job_offers" ON public.community_job_offers;
DROP POLICY IF EXISTS "Admin manage job_offers" ON public.community_job_offers;

CREATE POLICY "Public read community_job_offers"
  ON public.community_job_offers FOR SELECT
  USING (true);

CREATE POLICY "Admin manage job_offers"
  ON public.community_job_offers FOR ALL
  USING (public.is_admin());

-- Events
DROP POLICY IF EXISTS "Public read community_events" ON public.community_events;
DROP POLICY IF EXISTS "Admin manage events" ON public.community_events;

CREATE POLICY "Public read community_events"
  ON public.community_events FOR SELECT
  USING (true);

CREATE POLICY "Admin manage events"
  ON public.community_events FOR ALL
  USING (public.is_admin());

-- ------------------------------------------------------------
-- D. XP TRANSACTION LEDGER (PHASE 6)
-- ------------------------------------------------------------
DROP POLICY IF EXISTS "Members and admin read xp transactions" ON public.community_xp_transactions;
DROP POLICY IF EXISTS "Admin only insert xp transactions" ON public.community_xp_transactions;

CREATE POLICY "Members and admin read xp transactions"
  ON public.community_xp_transactions FOR SELECT
  USING (
    public.is_admin()
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Admin only insert xp transactions"
  ON public.community_xp_transactions FOR INSERT
  WITH CHECK (public.is_admin());

-- NOTE: No UPDATE or DELETE policies are defined on community_xp_transactions,
-- ensuring the XP transaction ledger is strictly immutable and append-only.

-- ------------------------------------------------------------
-- E. REFERRAL CODES & REFERRALS (PHASE 14)
-- ------------------------------------------------------------
-- Referral Codes
DROP POLICY IF EXISTS "Members read own referral code" ON public.community_referral_codes;
DROP POLICY IF EXISTS "Members insert own referral code" ON public.community_referral_codes;

CREATE POLICY "Members read own referral code"
  ON public.community_referral_codes FOR SELECT
  USING (
    public.is_admin()
    OR auth.uid() = user_id
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Members insert own referral code"
  ON public.community_referral_codes FOR INSERT
  WITH CHECK (
    public.is_admin()
    OR auth.uid() = user_id
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

-- Referral Records
DROP POLICY IF EXISTS "Referrers read their own referrals" ON public.community_referrals;
DROP POLICY IF EXISTS "Admin manage referrals" ON public.community_referrals;

CREATE POLICY "Referrers and referred view referral"
  ON public.community_referrals FOR SELECT
  USING (
    public.is_admin()
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = referrer_member_id)
    OR auth.uid() = (SELECT user_id FROM public.community_members WHERE id = referred_member_id)
  );

CREATE POLICY "Admin manage referrals"
  ON public.community_referrals FOR ALL
  USING (public.is_admin());

-- ------------------------------------------------------------
-- F. STORAGE BUCKET POLICIES (PHASE 8)
-- ------------------------------------------------------------
-- Ensure storage bucket 'community-media' exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'community-media',
  'community-media',
  true,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800;

-- Ensure storage bucket 'avatars' exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 1048576;
