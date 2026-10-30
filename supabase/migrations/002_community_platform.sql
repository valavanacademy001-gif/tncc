-- ============================================================
-- TNCC Member Community Platform — Database Schema Migration
-- Version: 002
-- Description: Complete schema for Tamil Nadu Creators Club Community Platform
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. COMMUNITY MEMBERS & PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id TEXT UNIQUE NOT NULL, -- e.g. TNCC-2026-0042
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
  total_xp INTEGER DEFAULT 50, -- Starting welcome bonus
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 2. COMMUNITY POSTS (FEED)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  media_url TEXT,
  media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video', 'none')),
  aspect_ratio TEXT DEFAULT 'square', -- 'square', 'portrait', 'landscape'
  hashtags TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Showcase' CHECK (category IN ('All', 'Showcase', 'Discussion', 'Graphic Design', 'Video Editing', 'Photography', 'AI Art', 'Branding')),
  is_showcase BOOLEAN DEFAULT FALSE,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 3. POST LIKES (PREVENT SELF-LIKE & DUPLICATES)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_post_member_like UNIQUE (post_id, member_id)
);

-- ============================================================
-- 4. POST COMMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_post_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 5. SAVED POSTS (BOOKMARKS)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_saved_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_saved_post UNIQUE (post_id, member_id)
);

-- ============================================================
-- 6. RESOURCES (CREATOR RESOURCE LIBRARY)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Downloads', 'Useful Websites', 'Feeds / Videos', 'Blog Posts')),
  resource_type TEXT NOT NULL, -- 'Font', 'PSD Mockup', 'AI Tool', 'Drive Pack', etc.
  thumbnail_url TEXT NOT NULL,
  external_url TEXT NOT NULL,
  is_google_drive BOOLEAN DEFAULT FALSE,
  download_count INTEGER DEFAULT 0,
  published_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 7. CHALLENGES (CREATIVE COMPETITIONS)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  reference_images TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  rules TEXT[] DEFAULT '{}',
  prizes JSONB NOT NULL DEFAULT '{"first": "₹10,000 + TNCC Trophy", "second": "₹5,000 + Certificate", "third": "₹2,500 + Certificate"}',
  xp_reward INTEGER DEFAULT 15,
  bonus_xp_first INTEGER DEFAULT 100,
  bonus_xp_second INTEGER DEFAULT 60,
  bonus_xp_third INTEGER DEFAULT 30,
  start_date TIMESTAMPTZ DEFAULT NOW(),
  submission_deadline TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'Active' CHECK (status IN ('Upcoming', 'Active', 'Submission Closed', 'Completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 8. CHALLENGE SUBMISSIONS
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
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_member_challenge_submission UNIQUE (challenge_id, member_id)
);

-- ============================================================
-- 9. CHALLENGE WINNERS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_challenge_winners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES community_challenges(id) ON DELETE CASCADE,
  first_place_member_id UUID REFERENCES community_members(id),
  first_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  second_place_member_id UUID REFERENCES community_members(id),
  second_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  third_place_member_id UUID REFERENCES community_members(id),
  third_place_submission_id UUID REFERENCES community_challenge_submissions(id),
  announced_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_challenge_winners UNIQUE (challenge_id)
);

-- ============================================================
-- 10. XP TRANSACTIONS (AUDIT TRAIL & PREVENT FARMING)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_xp_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL, -- e.g. 'Created Post', 'Received Like', 'Challenge Participation', 'First Place Winner'
  reference_id TEXT, -- post_id, challenge_id, or like_id
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_xp_action UNIQUE (member_id, reason, reference_id)
);

-- ============================================================
-- 11. PORTFOLIO SHOWCASE PROJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  post_id UUID REFERENCES community_posts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  description TEXT,
  behance_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- 12. JOB OFFERS (CREATIVE JOB BOARD)
-- ============================================================
CREATE TABLE IF NOT EXISTS community_job_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  company_logo_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- Graphic Designer, Video Editor, UI/UX, etc.
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

-- ============================================================
-- 13. COMMUNITY EVENTS (MEMBER-FACING)
-- ============================================================
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
-- 14. COMMUNITY NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS community_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES community_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'xp_earned' CHECK (type IN ('xp_earned', 'like', 'comment', 'challenge_update', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenge_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_challenge_winners ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_job_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_notifications ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read community_members" ON community_members FOR SELECT USING (true);
CREATE POLICY "Public read community_posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public read community_post_likes" ON community_post_likes FOR SELECT USING (true);
CREATE POLICY "Public read community_post_comments" ON community_post_comments FOR SELECT USING (true);
CREATE POLICY "Public read community_resources" ON community_resources FOR SELECT USING (true);
CREATE POLICY "Public read community_challenges" ON community_challenges FOR SELECT USING (true);
CREATE POLICY "Public read community_challenge_submissions" ON community_challenge_submissions FOR SELECT USING (true);
CREATE POLICY "Public read community_challenge_winners" ON community_challenge_winners FOR SELECT USING (true);
CREATE POLICY "Public read community_portfolio_projects" ON community_portfolio_projects FOR SELECT USING (is_hidden = false);
CREATE POLICY "Public read community_job_offers" ON community_job_offers FOR SELECT USING (true);
CREATE POLICY "Public read community_events" ON community_events FOR SELECT USING (true);
