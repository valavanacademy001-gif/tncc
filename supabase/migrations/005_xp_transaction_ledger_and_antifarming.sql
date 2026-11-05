-- ============================================================
-- TNCC Database Migration 005 — Server-Side XP Ledger & Anti-Farming
-- Version: 005
-- Dependencies: 001_initial_schema.sql, 002_community_platform.sql, 003_community_admin_and_rls.sql, 004_challenge_submissions_and_deadlines.sql
-- Resolves: ISSUE-08 (Implement Server-Side XP Transaction Ledger and Anti-Farming Verification)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. XP TRANSACTIONS TABLE & AUDIT CONSTRAINTS
-- ============================================================

CREATE TABLE IF NOT EXISTS public.community_xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL CHECK (amount > 0 AND amount <= 1000),
  reason TEXT NOT NULL,
  reference_id TEXT,
  transaction_type TEXT DEFAULT 'xp_reward' CHECK (
    transaction_type IN ('post_creation', 'like_received', 'challenge_participation', 'winner_bonus', 'admin_merit', 'xp_reward', 'system')
  ),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_xp_action UNIQUE (member_id, reason, reference_id)
);

-- Ensure transaction_type column exists if table was previously created
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'community_xp_transactions' AND column_name = 'transaction_type'
  ) THEN
    ALTER TABLE public.community_xp_transactions 
      ADD COLUMN transaction_type TEXT DEFAULT 'xp_reward';
  END IF;
END $$;

-- Ensure total_xp column has non-negative check constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_member_total_xp_positive'
  ) THEN
    ALTER TABLE public.community_members 
      ADD CONSTRAINT check_member_total_xp_positive CHECK (total_xp >= 0);
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Indexes for performance & quick ledger retrieval
CREATE INDEX IF NOT EXISTS idx_xp_tx_member_id ON public.community_xp_transactions(member_id);
CREATE INDEX IF NOT EXISTS idx_xp_tx_created_at ON public.community_xp_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_xp_tx_reference ON public.community_xp_transactions(reference_id);

-- ============================================================
-- 2. ATOMIC XP TRANSACTION RPC (SERVER-ONLY / SECURITY DEFINER)
-- ============================================================

CREATE OR REPLACE FUNCTION record_xp_reward(
  p_member_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reference_id TEXT,
  p_transaction_type TEXT DEFAULT 'xp_reward'
)
RETURNS JSONB AS $$
DECLARE
  v_member public.community_members%ROWTYPE;
  v_inserted_id UUID;
  v_new_total INTEGER;
BEGIN
  -- 1. Validate XP amount
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount > 1000 THEN
    RAISE EXCEPTION 'Invalid XP amount: Must be a positive integer between 1 and 1000'
      USING ERRCODE = '22003';
  END IF;

  -- 2. Verify Member Exists
  SELECT * INTO v_member FROM public.community_members WHERE id = p_member_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member with ID % does not exist', p_member_id
      USING ERRCODE = '28000';
  END IF;

  -- 3. Attempt Idempotent Insert into XP Ledger
  INSERT INTO public.community_xp_transactions (
    member_id,
    amount,
    reason,
    reference_id,
    transaction_type,
    created_at
  ) VALUES (
    p_member_id,
    p_amount,
    trim(p_reason),
    trim(p_reference_id),
    p_transaction_type,
    NOW()
  )
  ON CONFLICT (member_id, reason, reference_id) DO NOTHING
  RETURNING id INTO v_inserted_id;

  -- 4. Check If Duplicate Prevented
  IF v_inserted_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'duplicate', true,
      'message', 'Duplicate XP transaction prevented by idempotency constraint',
      'member_id', p_member_id,
      'current_total_xp', v_member.total_xp
    );
  END IF;

  -- 5. Atomically increment member balance
  UPDATE public.community_members
  SET total_xp = total_xp + p_amount,
      updated_at = NOW()
  WHERE id = p_member_id
  RETURNING total_xp INTO v_new_total;

  RETURN jsonb_build_object(
    'success', true,
    'duplicate', false,
    'transaction_id', v_inserted_id,
    'member_id', p_member_id,
    'amount', p_amount,
    'new_total_xp', v_new_total
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. ATOMIC LIKE TOGGLE & ANTI-FARMING XP RPC
-- ============================================================

CREATE OR REPLACE FUNCTION toggle_post_like_and_award_xp(
  p_post_id UUID,
  p_liker_member_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_post public.community_posts%ROWTYPE;
  v_liker public.community_members%ROWTYPE;
  v_is_liked BOOLEAN;
  v_xp_earned BOOLEAN := FALSE;
  v_action_ref TEXT;
  v_new_likes_count INTEGER;
  v_author_new_xp INTEGER;
BEGIN
  -- 1. Verify Post Exists
  SELECT * INTO v_post FROM public.community_posts WHERE id = p_post_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Post with ID % does not exist', p_post_id
      USING ERRCODE = 'P0002';
  END IF;

  -- 2. Verify Liking Member Exists
  SELECT * INTO v_liker FROM public.community_members WHERE id = p_liker_member_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member with ID % does not exist', p_liker_member_id
      USING ERRCODE = '28000';
  END IF;

  -- 3. Check If Already Liked
  SELECT EXISTS (
    SELECT 1 FROM public.community_post_likes
    WHERE post_id = p_post_id AND member_id = p_liker_member_id
  ) INTO v_is_liked;

  IF v_is_liked THEN
    -- UNLIKE: Remove like record and decrement counter
    DELETE FROM public.community_post_likes
    WHERE post_id = p_post_id AND member_id = p_liker_member_id;

    UPDATE public.community_posts
    SET likes_count = GREATEST(0, likes_count - 1),
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING likes_count INTO v_new_likes_count;

    -- Note: Unliking does not deduct historical XP, but re-liking will NOT award XP again
    RETURN jsonb_build_object(
      'liked', false,
      'likes_count', v_new_likes_count,
      'xp_earned', false,
      'message', 'Post unliked'
    );
  ELSE
    -- LIKE: Insert like record and increment counter
    INSERT INTO public.community_post_likes (post_id, member_id, created_at)
    VALUES (p_post_id, p_liker_member_id, NOW())
    ON CONFLICT (post_id, member_id) DO NOTHING;

    UPDATE public.community_posts
    SET likes_count = likes_count + 1,
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING likes_count INTO v_new_likes_count;

    -- ANTI-FARMING RULE 1: Self-likes DO NOT award XP
    IF v_post.member_id = p_liker_member_id THEN
      RETURN jsonb_build_object(
        'liked', true,
        'likes_count', v_new_likes_count,
        'xp_earned', false,
        'message', 'Self-like appreciated but does not award XP (anti-farming protection)'
      );
    END IF;

    -- ANTI-FARMING RULE 2: Liking and unliking does not repeatedly award XP
    v_action_ref := 'like_' || p_post_id::TEXT || '_' || p_liker_member_id::TEXT;

    -- Attempt to award +2 XP to the author of the post
    PERFORM 1 FROM public.community_xp_transactions
    WHERE member_id = v_post.member_id 
      AND reason = 'Received Like on Post' 
      AND reference_id = v_action_ref;

    IF NOT FOUND THEN
      -- Award +2 XP to post author
      INSERT INTO public.community_xp_transactions (
        member_id,
        amount,
        reason,
        reference_id,
        transaction_type,
        created_at
      ) VALUES (
        v_post.member_id,
        2,
        'Received Like on Post',
        v_action_ref,
        'like_received',
        NOW()
      ) ON CONFLICT (member_id, reason, reference_id) DO NOTHING;

      IF FOUND THEN
        UPDATE public.community_members
        SET total_xp = total_xp + 2,
            updated_at = NOW()
        WHERE id = v_post.member_id
        RETURNING total_xp INTO v_author_new_xp;
        v_xp_earned := TRUE;
      END IF;
    END IF;

    RETURN jsonb_build_object(
      'liked', true,
      'likes_count', v_new_likes_count,
      'xp_earned', v_xp_earned,
      'xp_awarded', CASE WHEN v_xp_earned THEN 2 ELSE 0 END,
      'author_id', v_post.member_id
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 4. ATOMIC POST PUBLISHING WITH VERIFIED XP RPC
-- ============================================================

CREATE OR REPLACE FUNCTION publish_post_with_verified_xp(
  p_member_id UUID,
  p_caption TEXT,
  p_media_url TEXT DEFAULT '',
  p_media_type TEXT DEFAULT 'none',
  p_aspect_ratio TEXT DEFAULT 'square',
  p_category TEXT DEFAULT 'Creative Showcase',
  p_hashtags TEXT[] DEFAULT '{}',
  p_is_showcase BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_post_id UUID;
  v_action_ref TEXT;
  v_new_xp INTEGER;
BEGIN
  -- 1. Validate Input
  IF p_caption IS NULL OR length(trim(p_caption)) < 2 THEN
    RAISE EXCEPTION 'Post caption is required (minimum 2 characters)';
  END IF;

  -- 2. Insert Post
  INSERT INTO public.community_posts (
    member_id,
    caption,
    media_url,
    media_type,
    aspect_ratio,
    category,
    hashtags,
    is_showcase,
    created_at
  ) VALUES (
    p_member_id,
    trim(p_caption),
    trim(p_media_url),
    p_media_type,
    p_aspect_ratio,
    p_category,
    p_hashtags,
    p_is_showcase,
    NOW()
  ) RETURNING id INTO v_post_id;

  -- 3. Idempotently award +10 XP
  v_action_ref := 'post_' || v_post_id::TEXT;
  INSERT INTO public.community_xp_transactions (
    member_id,
    amount,
    reason,
    reference_id,
    transaction_type,
    created_at
  ) VALUES (
    p_member_id,
    10,
    'Published Community Post',
    v_action_ref,
    'post_creation',
    NOW()
  ) ON CONFLICT (member_id, reason, reference_id) DO NOTHING;

  IF FOUND THEN
    UPDATE public.community_members
    SET total_xp = total_xp + 10,
        posts_count = posts_count + 1,
        updated_at = NOW()
    WHERE id = p_member_id
    RETURNING total_xp INTO v_new_xp;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'post_id', v_post_id,
    'xp_awarded', 10,
    'new_total_xp', v_new_xp
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 5. LEADERBOARD & RECONCILIATION RPC
-- ============================================================

CREATE OR REPLACE FUNCTION get_verified_community_leaderboard(p_limit INTEGER DEFAULT 50)
RETURNS TABLE (
  id UUID,
  member_id TEXT,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  location TEXT,
  skills TEXT[],
  total_xp INTEGER,
  wins_count INTEGER,
  challenges_count INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.member_id,
    m.username,
    m.full_name,
    m.avatar_url,
    m.location,
    m.skills,
    m.total_xp,
    m.wins_count,
    COALESCE((
      SELECT count(*)::INTEGER 
      FROM public.community_challenge_submissions s 
      WHERE s.member_id = m.id
    ), 0) AS challenges_count,
    ROW_NUMBER() OVER (ORDER BY m.total_xp DESC, m.wins_count DESC, m.created_at ASC) AS rank
  FROM public.community_members m
  ORDER BY m.total_xp DESC, m.wins_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 6. STRICT ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.community_xp_transactions ENABLE ROW LEVEL SECURITY;

-- Drop any previous permissive policies
DROP POLICY IF EXISTS "Members and admin read xp transactions" ON public.community_xp_transactions;
DROP POLICY IF EXISTS "Public read xp transactions" ON public.community_xp_transactions;
DROP POLICY IF EXISTS "Users can insert xp transactions" ON public.community_xp_transactions;
DROP POLICY IF EXISTS "Users can update xp transactions" ON public.community_xp_transactions;
DROP POLICY IF EXISTS "Users can delete xp transactions" ON public.community_xp_transactions;

-- SELECT Policy: Members can only read their own XP transactions; Admins can read all
CREATE POLICY "Members and admin read xp transactions"
  ON public.community_xp_transactions FOR SELECT
  USING (
    is_admin() OR
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

-- INSERT Policy: Prohibit direct client INSERT.
-- XP transactions MUST be created by backend RPCs running as SECURITY DEFINER or by admin service role.
CREATE POLICY "Admin only insert xp transactions"
  ON public.community_xp_transactions FOR INSERT
  WITH CHECK (is_admin());

-- UPDATE Policy: FORBIDDEN. Ledger is append-only and strictly immutable.
-- No UPDATE policy defined = all UPDATEs are rejected.

-- DELETE Policy: FORBIDDEN. Ledger entries cannot be deleted.
-- No DELETE policy defined = all DELETEs are rejected.
