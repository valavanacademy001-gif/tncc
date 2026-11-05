-- ============================================================
-- TNCC Database Migration 003 — Admin Dashboard & Community RLS
-- Version: 003
-- Dependencies: 001_initial_schema.sql, 002_community_platform.sql
-- Resolves: ISSUE-02, ISSUE-04, ISSUE-10
-- ============================================================

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. BASE TABLES VERIFICATION & PROVISIONING
-- ============================================================

-- Community Members
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT 'Chennai, Tamil Nadu',
  skills TEXT[] DEFAULT '{}',
  instagram_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  behance_url TEXT DEFAULT '',
  youtube_url TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  total_xp INTEGER DEFAULT 50,
  wins_count INTEGER DEFAULT 0,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Challenges
CREATE TABLE IF NOT EXISTS community_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  rules TEXT[] DEFAULT '{}',
  prizes JSONB NOT NULL DEFAULT '{"first": "₹15,000 Cash + 200 XP", "second": "₹7,500 Cash + 100 XP", "third": "₹3,000 Cash + 50 XP"}',
  xp_reward INTEGER DEFAULT 15,
  bonus_xp_first INTEGER DEFAULT 200,
  bonus_xp_second INTEGER DEFAULT 100,
  bonus_xp_third INTEGER DEFAULT 50,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  submission_deadline TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Upcoming', 'Active', 'Submission Closed', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Resources
CREATE TABLE IF NOT EXISTS community_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Downloads', 'Useful Websites', 'Feeds / Videos', 'Blog Posts')),
  resource_type TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  external_url TEXT NOT NULL,
  is_google_drive BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Challenge Submissions (with review status & feedback)
CREATE TABLE IF NOT EXISTS community_challenge_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES community_challenges(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('image', 'video', 'pdf', 'gdrive', 'portfolio')),
  submission_url TEXT NOT NULL,
  preview_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_feedback TEXT DEFAULT '',
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_member_challenge_submission UNIQUE (challenge_id, member_id)
);

-- Add review columns if table already existed without them
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_challenge_submissions' AND column_name = 'status'
  ) THEN
    ALTER TABLE community_challenge_submissions 
      ADD COLUMN status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_challenge_submissions' AND column_name = 'admin_feedback'
  ) THEN
    ALTER TABLE community_challenge_submissions 
      ADD COLUMN admin_feedback TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_challenge_submissions' AND column_name = 'reviewed_at'
  ) THEN
    ALTER TABLE community_challenge_submissions 
      ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_members' AND column_name = 'wins_count'
  ) THEN
    ALTER TABLE community_members 
      ADD COLUMN wins_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Community Challenge Winners
CREATE TABLE IF NOT EXISTS community_challenge_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES community_challenges(id) ON DELETE CASCADE,
  first_place_member_id UUID REFERENCES community_members(id),
  first_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  first_place_xp_awarded INTEGER DEFAULT 0,
  second_place_member_id UUID REFERENCES community_members(id),
  second_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  second_place_xp_awarded INTEGER DEFAULT 0,
  third_place_member_id UUID REFERENCES community_members(id),
  third_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  third_place_xp_awarded INTEGER DEFAULT 0,
  announced_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_challenge_winners UNIQUE (challenge_id)
);

-- Community XP Transactions (Ledger & Anti-Farming)
CREATE TABLE IF NOT EXISTS community_xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_xp_action UNIQUE (member_id, reason, reference_id)
);

-- Community Job Offers
CREATE TABLE IF NOT EXISTS community_job_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  company_logo_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  work_mode TEXT NOT NULL CHECK (work_mode IN ('Remote', 'On-site', 'Hybrid')),
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Freelance', 'Contract')),
  salary_range TEXT,
  description TEXT NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  experience_level TEXT DEFAULT '1-3 years',
  responsibilities TEXT[] DEFAULT '{}',
  application_url TEXT NOT NULL,
  posted_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Events
CREATE TABLE IF NOT EXISTS community_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TEXT NOT NULL,
  location TEXT NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  registration_url TEXT NOT NULL,
  status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Ongoing', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. HELPER FUNCTIONS
-- ============================================================

-- Function to check if current authenticated user is an authorized admin
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    -- Authorized super admin email designated in specs
    auth.jwt() ->> 'email' = 'suganeshsugu07@gmail.com'
    -- Or user has 'admin' role in community_members
    OR EXISTS (
      SELECT 1 FROM community_members
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. ATOMIC WINNER ANNOUNCEMENT RPC FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION announce_challenge_winner(
  p_challenge_id UUID,
  p_position TEXT,
  p_submission_id UUID,
  p_member_id UUID,
  p_bonus_xp INTEGER
)
RETURNS JSONB AS $$
DECLARE
  v_challenge community_challenges%ROWTYPE;
  v_submission community_challenge_submissions%ROWTYPE;
  v_member community_members%ROWTYPE;
  v_existing_winner community_challenge_winners%ROWTYPE;
  v_reason TEXT;
  v_ref_id TEXT;
  v_xp_inserted BOOLEAN := FALSE;
BEGIN
  -- 1. Security Check: Only admin can execute
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Forbidden: Only administrators can declare challenge winners'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Validate position
  IF p_position NOT IN ('first', 'second', 'third') THEN
    RAISE EXCEPTION 'Invalid winner position: %, must be first, second, or third', p_position;
  END IF;

  -- 3. Verify Challenge exists
  SELECT * INTO v_challenge FROM community_challenges WHERE id = p_challenge_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Challenge with ID % not found', p_challenge_id;
  END IF;

  -- 4. Verify Submission exists and matches challenge
  SELECT * INTO v_submission FROM community_challenge_submissions 
  WHERE id = p_submission_id AND challenge_id = p_challenge_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Submission % does not belong to challenge %', p_submission_id, p_challenge_id;
  END IF;

  -- 5. Verify Member exists
  SELECT * INTO v_member FROM community_members WHERE id = p_member_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member with ID % not found', p_member_id;
  END IF;

  -- Verify submission author matches member
  IF v_submission.member_id <> p_member_id THEN
    RAISE EXCEPTION 'Submission author (%) does not match specified member (%)', v_submission.member_id, p_member_id;
  END IF;

  -- 6. Check existing winner record
  SELECT * INTO v_existing_winner FROM community_challenge_winners WHERE challenge_id = p_challenge_id;

  -- Prevent duplicate award to same member in multiple positions
  IF FOUND THEN
    IF (p_position <> 'first' AND v_existing_winner.first_place_member_id = p_member_id) OR
       (p_position <> 'second' AND v_existing_winner.second_place_member_id = p_member_id) OR
       (p_position <> 'third' AND v_existing_winner.third_place_member_id = p_member_id) THEN
      RAISE EXCEPTION 'Member % is already a winner in another position for this challenge', p_member_id;
    END IF;
  END IF;

  -- 7. Upsert Winner Record into community_challenge_winners
  IF NOT FOUND THEN
    IF p_position = 'first' THEN
      INSERT INTO community_challenge_winners (
        challenge_id, first_place_member_id, first_place_submission_id, first_place_xp_awarded
      ) VALUES (p_challenge_id, p_member_id, p_submission_id, p_bonus_xp);
    ELSIF p_position = 'second' THEN
      INSERT INTO community_challenge_winners (
        challenge_id, second_place_member_id, second_place_submission_id, second_place_xp_awarded
      ) VALUES (p_challenge_id, p_member_id, p_submission_id, p_bonus_xp);
    ELSIF p_position = 'third' THEN
      INSERT INTO community_challenge_winners (
        challenge_id, third_place_member_id, third_place_submission_id, third_place_xp_awarded
      ) VALUES (p_challenge_id, p_member_id, p_submission_id, p_bonus_xp);
    END IF;
  ELSE
    IF p_position = 'first' THEN
      UPDATE community_challenge_winners
      SET first_place_member_id = p_member_id,
          first_place_submission_id = p_submission_id,
          first_place_xp_awarded = p_bonus_xp,
          announced_at = NOW()
      WHERE challenge_id = p_challenge_id;
    ELSIF p_position = 'second' THEN
      UPDATE community_challenge_winners
      SET second_place_member_id = p_member_id,
          second_place_submission_id = p_submission_id,
          second_place_xp_awarded = p_bonus_xp,
          announced_at = NOW()
      WHERE challenge_id = p_challenge_id;
    ELSIF p_position = 'third' THEN
      UPDATE community_challenge_winners
      SET third_place_member_id = p_member_id,
          third_place_submission_id = p_submission_id,
          third_place_xp_awarded = p_bonus_xp,
          announced_at = NOW()
      WHERE challenge_id = p_challenge_id;
    END IF;
  END IF;

  -- 8. Award Bonus XP via transaction ledger (Prevent duplicate award)
  v_reason := CASE 
    WHEN p_position = 'first' THEN 'First Place Challenge Winner'
    WHEN p_position = 'second' THEN 'Second Place Challenge Winner'
    ELSE 'Third Place Challenge Winner'
  END;
  v_ref_id := p_challenge_id::TEXT || '_' || p_position;

  -- Try inserting transaction (idempotent via unique constraint)
  INSERT INTO community_xp_transactions (member_id, amount, reason, reference_id)
  VALUES (p_member_id, p_bonus_xp, v_reason, v_ref_id)
  ON CONFLICT (member_id, reason, reference_id) DO NOTHING;

  GET DIAGNOSTICS v_xp_inserted = ROW_COUNT;

  -- If newly inserted, update member total_xp and wins_count
  IF v_xp_inserted THEN
    UPDATE community_members
    SET total_xp = total_xp + p_bonus_xp,
        wins_count = wins_count + 1,
        updated_at = NOW()
    WHERE id = p_member_id;
  END IF;

  -- 9. If first place, mark challenge as Completed
  IF p_position = 'first' THEN
    UPDATE community_challenges
    SET status = 'Completed',
        updated_at = NOW()
    WHERE id = p_challenge_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'challenge_id', p_challenge_id,
    'position', p_position,
    'member_id', p_member_id,
    'bonus_xp_awarded', p_bonus_xp,
    'xp_ledger_committed', v_xp_inserted
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. ATOMIC ADMIN BONUS XP RPC FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION award_admin_bonus_xp(
  p_member_id UUID,
  p_amount INTEGER,
  p_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_member community_members%ROWTYPE;
  v_ref_id TEXT;
  v_xp_inserted BOOLEAN := FALSE;
BEGIN
  -- Security check
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Forbidden: Only administrators can award merit bonus XP'
      USING ERRCODE = '42501';
  END IF;

  IF p_amount <= 0 OR p_amount > 1000 THEN
    RAISE EXCEPTION 'XP amount must be between 1 and 1000';
  END IF;

  SELECT * INTO v_member FROM community_members WHERE id = p_member_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member with ID % not found', p_member_id;
  END IF;

  v_ref_id := 'admin_merit_' || EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT;

  INSERT INTO community_xp_transactions (member_id, amount, reason, reference_id)
  VALUES (p_member_id, p_amount, p_reason, v_ref_id);

  UPDATE community_members
  SET total_xp = total_xp + p_amount,
      updated_at = NOW()
  WHERE id = p_member_id;

  RETURN jsonb_build_object(
    'success', true,
    'member_id', p_member_id,
    'amount', p_amount,
    'new_total_xp', v_member.total_xp + p_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES FOR ADMIN & COMMUNITY
-- ============================================================

ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenge_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;

-- Drop obsolete or permissive mutation policies if they exist
DROP POLICY IF EXISTS "Admin insert community_challenges" ON community_challenges;
DROP POLICY IF EXISTS "Admin update community_challenges" ON community_challenges;
DROP POLICY IF EXISTS "Admin delete community_challenges" ON community_challenges;
DROP POLICY IF EXISTS "Admin insert community_resources" ON community_resources;
DROP POLICY IF EXISTS "Admin update community_resources" ON community_resources;
DROP POLICY IF EXISTS "Admin delete community_resources" ON community_resources;
DROP POLICY IF EXISTS "Admin manage winners" ON community_challenge_winners;
DROP POLICY IF EXISTS "Admin update submissions" ON community_challenge_submissions;

-- 5A. Challenges RLS Policies
CREATE POLICY "Public read community_challenges"
  ON community_challenges FOR SELECT
  USING (true);

CREATE POLICY "Admin insert community_challenges"
  ON community_challenges FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update community_challenges"
  ON community_challenges FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete community_challenges"
  ON community_challenges FOR DELETE
  USING (is_admin());

-- 5B. Resources RLS Policies
CREATE POLICY "Public read community_resources"
  ON community_resources FOR SELECT
  USING (true);

CREATE POLICY "Admin insert community_resources"
  ON community_resources FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update community_resources"
  ON community_resources FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete community_resources"
  ON community_resources FOR DELETE
  USING (is_admin());

-- 5C. Challenge Submissions RLS Policies
CREATE POLICY "Public read community_challenge_submissions"
  ON community_challenge_submissions FOR SELECT
  USING (true);

CREATE POLICY "Members insert own submission"
  ON community_challenge_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id)
  );

CREATE POLICY "Admin review submissions"
  ON community_challenge_submissions FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- 5D. Challenge Winners RLS Policies
CREATE POLICY "Public read community_challenge_winners"
  ON community_challenge_winners FOR SELECT
  USING (true);

CREATE POLICY "Admin insert challenge_winners"
  ON community_challenge_winners FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admin update challenge_winners"
  ON community_challenge_winners FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admin delete challenge_winners"
  ON community_challenge_winners FOR DELETE
  USING (is_admin());

-- 5E. Jobs & Events RLS Policies
CREATE POLICY "Public read community_job_offers"
  ON community_job_offers FOR SELECT
  USING (true);

CREATE POLICY "Admin manage job offers"
  ON community_job_offers FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Public read community_events"
  ON community_events FOR SELECT
  USING (true);

CREATE POLICY "Admin manage events"
  ON community_events FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- 5F. XP Transactions RLS Policies
CREATE POLICY "Members and admin read xp transactions"
  ON community_xp_transactions FOR SELECT
  USING (
    is_admin() OR
    auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id)
  );

