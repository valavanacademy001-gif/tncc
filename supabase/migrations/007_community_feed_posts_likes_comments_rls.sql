-- ============================================================
-- TNCC SUPABASE MIGRATION 007: COMMUNITY FEED, POSTS, LIKES, COMMENTS & BOOKMARKS
-- ============================================================
-- Implements live PostgreSQL backend operations and strict Row Level Security (RLS)
-- for TNCC statewide creator feed.
-- Dependencies: 001_initial_schema.sql, 002_community_platform.sql, 003_community_admin_and_rls.sql, 005_xp_transaction_ledger_and_antifarming.sql
-- ============================================================

-- Ensure uuid-ossp extension is enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. VERIFY AND EXTEND COMMUNITY_POSTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  media_url TEXT DEFAULT '',
  media_type TEXT DEFAULT 'none' CHECK (media_type IN ('image', 'video', 'none')),
  aspect_ratio TEXT DEFAULT 'square' CHECK (aspect_ratio IN ('square', 'portrait', 'landscape')),
  hashtags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Showcase',
  is_showcase BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure constraints and columns exist if table was previously created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'saves_count') THEN
    ALTER TABLE public.community_posts ADD COLUMN saves_count INTEGER DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'community_posts' AND column_name = 'updated_at') THEN
    ALTER TABLE public.community_posts ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

-- Indexes for lightning fast feed queries
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_member_id ON public.community_posts(member_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_is_showcase ON public.community_posts(is_showcase);

-- ============================================================
-- 2. VERIFY AND EXTEND COMMUNITY_POST_LIKES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.community_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_post_member_like UNIQUE (post_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_community_post_likes_post ON public.community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_member ON public.community_post_likes(member_id);

-- ============================================================
-- 3. VERIFY AND EXTEND COMMUNITY_POST_COMMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.community_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_post_comments_post ON public.community_post_comments(post_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_member ON public.community_post_comments(member_id);

-- ============================================================
-- 4. VERIFY AND EXTEND COMMUNITY_SAVED_POSTS (BOOKMARKS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.community_saved_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.community_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_saved_post UNIQUE (post_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_community_saved_posts_member ON public.community_saved_posts(member_id);
CREATE INDEX IF NOT EXISTS idx_community_saved_posts_post ON public.community_saved_posts(post_id);

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_saved_posts ENABLE ROW LEVEL SECURITY;

-- --- A. community_posts ---
DROP POLICY IF EXISTS "Public read community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Members insert own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Members and admin update own posts" ON public.community_posts;
DROP POLICY IF EXISTS "Members and admin delete own posts" ON public.community_posts;

-- SELECT: Anyone (public or authenticated) can view community posts
CREATE POLICY "Public read community_posts"
  ON public.community_posts FOR SELECT
  USING (true);

-- INSERT: Authenticated members can only create posts under their own member_id
CREATE POLICY "Members insert own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR EXISTS (SELECT 1 FROM public.community_admins WHERE user_id = auth.uid())
  );

-- UPDATE: Only post author or admin can update
CREATE POLICY "Members and admin update own posts"
  ON public.community_posts FOR UPDATE
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR EXISTS (SELECT 1 FROM public.community_admins WHERE user_id = auth.uid())
  );

-- DELETE: Only post author or admin can delete
CREATE POLICY "Members and admin delete own posts"
  ON public.community_posts FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR EXISTS (SELECT 1 FROM public.community_admins WHERE user_id = auth.uid())
  );

-- --- B. community_post_likes ---
DROP POLICY IF EXISTS "Public read community_post_likes" ON public.community_post_likes;
DROP POLICY IF EXISTS "Members insert own likes" ON public.community_post_likes;
DROP POLICY IF EXISTS "Members delete own likes" ON public.community_post_likes;

CREATE POLICY "Public read community_post_likes"
  ON public.community_post_likes FOR SELECT
  USING (true);

CREATE POLICY "Members insert own likes"
  ON public.community_post_likes FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Members delete own likes"
  ON public.community_post_likes FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

-- --- C. community_post_comments ---
DROP POLICY IF EXISTS "Public read community_post_comments" ON public.community_post_comments;
DROP POLICY IF EXISTS "Members insert own comments" ON public.community_post_comments;
DROP POLICY IF EXISTS "Members and admin delete own comments" ON public.community_post_comments;

CREATE POLICY "Public read community_post_comments"
  ON public.community_post_comments FOR SELECT
  USING (true);

CREATE POLICY "Members insert own comments"
  ON public.community_post_comments FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Members and admin delete own comments"
  ON public.community_post_comments FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR EXISTS (SELECT 1 FROM public.community_admins WHERE user_id = auth.uid())
  );

-- --- D. community_saved_posts (Bookmarks) ---
DROP POLICY IF EXISTS "Members read own saved posts" ON public.community_saved_posts;
DROP POLICY IF EXISTS "Members insert own saved posts" ON public.community_saved_posts;
DROP POLICY IF EXISTS "Members delete own saved posts" ON public.community_saved_posts;

CREATE POLICY "Members read own saved posts"
  ON public.community_saved_posts FOR SELECT
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
    OR EXISTS (SELECT 1 FROM public.community_admins WHERE user_id = auth.uid())
  );

CREATE POLICY "Members insert own saved posts"
  ON public.community_saved_posts FOR INSERT
  WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

CREATE POLICY "Members delete own saved posts"
  ON public.community_saved_posts FOR DELETE
  USING (
    auth.uid() = (SELECT user_id FROM public.community_members WHERE id = member_id)
  );

-- ============================================================
-- 6. RPC HELPER FUNCTIONS FOR ATOMIC OPERATIONS
-- ============================================================

-- A. Toggle Bookmark (Save Post)
CREATE OR REPLACE FUNCTION toggle_post_save(
  p_post_id UUID,
  p_member_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_is_saved BOOLEAN;
  v_new_saves_count INTEGER;
BEGIN
  -- Check if already saved
  SELECT EXISTS (
    SELECT 1 FROM public.community_saved_posts
    WHERE post_id = p_post_id AND member_id = p_member_id
  ) INTO v_is_saved;

  IF v_is_saved THEN
    DELETE FROM public.community_saved_posts
    WHERE post_id = p_post_id AND member_id = p_member_id;

    UPDATE public.community_posts
    SET saves_count = GREATEST(0, saves_count - 1),
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING saves_count INTO v_new_saves_count;

    RETURN jsonb_build_object(
      'saved', false,
      'saves_count', v_new_saves_count,
      'message', 'Post removed from saved bookmarks'
    );
  ELSE
    INSERT INTO public.community_saved_posts (post_id, member_id, created_at)
    VALUES (p_post_id, p_member_id, NOW())
    ON CONFLICT (post_id, member_id) DO NOTHING;

    UPDATE public.community_posts
    SET saves_count = saves_count + 1,
        updated_at = NOW()
    WHERE id = p_post_id
    RETURNING saves_count INTO v_new_saves_count;

    RETURN jsonb_build_object(
      'saved', true,
      'saves_count', v_new_saves_count,
      'message', 'Post added to bookmarks'
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. Add Post Comment Atomically
CREATE OR REPLACE FUNCTION add_post_comment(
  p_post_id UUID,
  p_member_id UUID,
  p_text TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_comment_id UUID;
  v_new_comments_count INTEGER;
  v_member public.community_members%ROWTYPE;
BEGIN
  IF p_text IS NULL OR length(trim(p_text)) < 1 THEN
    RAISE EXCEPTION 'Comment text cannot be empty';
  END IF;

  SELECT * INTO v_member FROM public.community_members WHERE id = p_member_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;

  INSERT INTO public.community_post_comments (
    post_id,
    member_id,
    comment_text,
    created_at
  ) VALUES (
    p_post_id,
    p_member_id,
    trim(p_text),
    NOW()
  ) RETURNING id INTO v_comment_id;

  UPDATE public.community_posts
  SET comments_count = comments_count + 1,
      updated_at = NOW()
  WHERE id = p_post_id
  RETURNING comments_count INTO v_new_comments_count;

  RETURN jsonb_build_object(
    'success', true,
    'comment_id', v_comment_id,
    'post_id', p_post_id,
    'comments_count', v_new_comments_count,
    'comment', jsonb_build_object(
      'id', v_comment_id,
      'post_id', p_post_id,
      'member_id', p_member_id,
      'comment_text', trim(p_text),
      'created_at', NOW(),
      'author', jsonb_build_object(
        'username', v_member.username,
        'full_name', v_member.full_name,
        'avatar_url', v_member.avatar_url
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- C. Delete Post Comment Atomically
CREATE OR REPLACE FUNCTION delete_post_comment(
  p_comment_id UUID,
  p_member_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_post_id UUID;
  v_comment_member_id UUID;
  v_new_comments_count INTEGER;
  v_is_admin BOOLEAN := FALSE;
BEGIN
  SELECT post_id, member_id INTO v_post_id, v_comment_member_id
  FROM public.community_post_comments
  WHERE id = p_comment_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Comment not found';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.community_admins
    WHERE user_id = auth.uid()
  ) INTO v_is_admin;

  IF v_comment_member_id <> p_member_id AND NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own comments';
  END IF;

  DELETE FROM public.community_post_comments WHERE id = p_comment_id;

  UPDATE public.community_posts
  SET comments_count = GREATEST(0, comments_count - 1),
      updated_at = NOW()
  WHERE id = v_post_id
  RETURNING comments_count INTO v_new_comments_count;

  RETURN jsonb_build_object(
    'success', true,
    'comment_id', p_comment_id,
    'post_id', v_post_id,
    'comments_count', v_new_comments_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- D. Delete Community Post Atomically
CREATE OR REPLACE FUNCTION delete_community_post(
  p_post_id UUID,
  p_member_id UUID
)
RETURNS JSONB AS $$
DECLARE
  v_post_member_id UUID;
  v_is_admin BOOLEAN := FALSE;
BEGIN
  SELECT member_id INTO v_post_member_id
  FROM public.community_posts
  WHERE id = p_post_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Post not found';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.community_admins
    WHERE user_id = auth.uid()
  ) INTO v_is_admin;

  IF v_post_member_id <> p_member_id AND NOT v_is_admin THEN
    RAISE EXCEPTION 'Unauthorized: You can only delete your own posts';
  END IF;

  DELETE FROM public.community_posts WHERE id = p_post_id;

  -- Decrement member posts_count
  UPDATE public.community_members
  SET posts_count = GREATEST(0, posts_count - 1),
      updated_at = NOW()
  WHERE id = v_post_member_id;

  RETURN jsonb_build_object(
    'success', true,
    'post_id', p_post_id,
    'message', 'Post successfully deleted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
