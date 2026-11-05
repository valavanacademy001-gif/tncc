-- ============================================================
-- TNCC Database Migration 004 — Challenge Submissions & Deadlines
-- Version: 004
-- Dependencies: 001_initial_schema.sql, 002_community_platform.sql, 003_community_admin_and_rls.sql
-- Resolves: ISSUE-09 (Enforce Challenge Submission Rules: Duplicate Submissions & Deadline Expiry)
-- ============================================================

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. VERIFY SUBMISSIONS TABLE & UNIQUE CONSTRAINT
-- ============================================================

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

-- Ensure unique constraint exists if table already existed without it
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'unique_member_challenge_submission'
  ) THEN
    ALTER TABLE community_challenge_submissions 
      ADD CONSTRAINT unique_member_challenge_submission UNIQUE (challenge_id, member_id);
  END IF;
END $$;

-- ============================================================
-- 2. ATOMIC SUBMISSION RPC FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION submit_challenge_entry(
  p_challenge_id UUID,
  p_title TEXT,
  p_submission_type TEXT,
  p_submission_url TEXT,
  p_description TEXT DEFAULT NULL,
  p_is_update BOOLEAN DEFAULT FALSE
)
RETURNS JSONB AS $$
DECLARE
  v_user_id UUID;
  v_member_id UUID;
  v_challenge community_challenges%ROWTYPE;
  v_existing community_challenge_submissions%ROWTYPE;
  v_sub_id UUID;
  v_xp_awarded INTEGER := 0;
  v_action_ref TEXT;
BEGIN
  -- 1. Verify User Authentication
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to submit challenge entries'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Resolve Member ID from auth.users ID
  SELECT id INTO v_member_id 
  FROM community_members 
  WHERE user_id = v_user_id;

  IF v_member_id IS NULL THEN
    RAISE EXCEPTION 'Member profile not found for authenticated user'
      USING ERRCODE = '28000';
  END IF;

  -- 3. Input Validation
  IF p_title IS NULL OR length(trim(p_title)) < 2 THEN
    RAISE EXCEPTION 'Project title is required (minimum 2 characters)';
  END IF;

  IF p_submission_url IS NULL OR NOT (p_submission_url LIKE 'http://%' OR p_submission_url LIKE 'https://%') THEN
    RAISE EXCEPTION 'A valid submission URL starting with http:// or https:// is required';
  END IF;

  IF p_submission_type NOT IN ('image', 'video', 'pdf', 'gdrive', 'portfolio') THEN
    RAISE EXCEPTION 'Invalid submission format: %', p_submission_type;
  END IF;

  -- 4. Check Challenge Exists
  SELECT * INTO v_challenge 
  FROM community_challenges 
  WHERE id = p_challenge_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Challenge % not found', p_challenge_id;
  END IF;

  -- 5. Enforce Challenge Status
  IF v_challenge.status <> 'Active' THEN
    RAISE EXCEPTION 'Challenge is not active for submissions (current status: %)', v_challenge.status;
  END IF;

  -- 6. Enforce Challenge Deadline (Server/DB Time Comparison in UTC)
  IF NOW() > v_challenge.submission_deadline THEN
    RAISE EXCEPTION 'Submission deadline expired at %', v_challenge.submission_deadline;
  END IF;

  -- 7. Check for Existing Submission by this Member for this Challenge
  SELECT * INTO v_existing 
  FROM community_challenge_submissions 
  WHERE challenge_id = p_challenge_id AND member_id = v_member_id;

  -- 8. Duplicate Submission Prevention
  IF FOUND AND NOT p_is_update THEN
    RAISE EXCEPTION 'Duplicate submission rejected: You have already submitted an entry for this challenge'
      USING ERRCODE = '23505';
  END IF;

  -- 9. Handle Update or Insert
  IF FOUND AND p_is_update THEN
    -- Update existing submission
    UPDATE community_challenge_submissions
    SET title = trim(p_title),
        description = p_description,
        submission_type = p_submission_type,
        submission_url = trim(p_submission_url),
        preview_url = CASE WHEN p_submission_type = 'image' THEN trim(p_submission_url) ELSE preview_url END,
        submitted_at = NOW()
    WHERE id = v_existing.id;

    v_sub_id := v_existing.id;
  ELSE
    -- Insert new submission
    INSERT INTO community_challenge_submissions (
      challenge_id,
      member_id,
      title,
      description,
      submission_type,
      submission_url,
      preview_url,
      status,
      submitted_at
    ) VALUES (
      p_challenge_id,
      v_member_id,
      trim(p_title),
      p_description,
      p_submission_type,
      trim(p_submission_url),
      CASE WHEN p_submission_type = 'image' THEN trim(p_submission_url) ELSE NULL END,
      'pending',
      NOW()
    ) RETURNING id INTO v_sub_id;

    -- Award participation XP (+15 XP) with idempotent ledger insertion
    v_action_ref := 'challenge_part_' || p_challenge_id::TEXT;
    INSERT INTO community_xp_transactions (member_id, amount, reason, reference_id)
    VALUES (v_member_id, v_challenge.xp_reward, 'Challenge Participation', v_action_ref)
    ON CONFLICT (member_id, reason, reference_id) DO NOTHING;

    IF FOUND THEN
      v_xp_awarded := v_challenge.xp_reward;
      UPDATE community_members
      SET total_xp = total_xp + v_challenge.xp_reward,
          updated_at = NOW()
      WHERE id = v_member_id;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'submission_id', v_sub_id,
    'challenge_id', p_challenge_id,
    'member_id', v_member_id,
    'is_update', p_is_update,
    'xp_awarded', v_xp_awarded,
    'message', CASE WHEN p_is_update THEN 'Challenge entry updated successfully.' ELSE 'Challenge entry submitted successfully.' END
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 3. DEADLINE & PARTICIPATION RLS POLICIES
-- ============================================================

-- Drop old submission insert policies if present
DROP POLICY IF EXISTS "Members insert own submission" ON community_challenge_submissions;
DROP POLICY IF EXISTS "Members insert submission before deadline" ON community_challenge_submissions;
DROP POLICY IF EXISTS "Members update own submission before deadline" ON community_challenge_submissions;

-- Restrict INSERT: Only member can insert their own submission while challenge is active and before deadline
CREATE POLICY "Members insert submission before deadline"
  ON community_challenge_submissions FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id)
    AND EXISTS (
      SELECT 1 FROM community_challenges
      WHERE id = challenge_id 
        AND status = 'Active' 
        AND submission_deadline > NOW()
    )
  );

-- Restrict UPDATE: Member can update own entry before deadline
CREATE POLICY "Members update own submission before deadline"
  ON community_challenge_submissions FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id)
    AND EXISTS (
      SELECT 1 FROM community_challenges
      WHERE id = challenge_id 
        AND status = 'Active' 
        AND submission_deadline > NOW()
    )
  )
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM community_members WHERE id = member_id)
    AND EXISTS (
      SELECT 1 FROM community_challenges
      WHERE id = challenge_id 
        AND status = 'Active' 
        AND submission_deadline > NOW()
    )
  );
