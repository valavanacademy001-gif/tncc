-- ============================================================
-- TNCC Database — Initial Schema Migration
-- Version: 001
-- Description: Complete schema for Tamil Nadu Creators Club
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role_type AS ENUM ('freelancer', 'employer');

CREATE TYPE project_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');

CREATE TYPE proposal_status AS ENUM ('pending', 'shortlisted', 'accepted', 'rejected', 'withdrawn');

CREATE TYPE package_status AS ENUM ('active', 'paused', 'archived');

CREATE TYPE event_type AS ENUM ('workshop', 'meetup', 'conference', 'online', 'exhibition', 'hackathon');

CREATE TYPE event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');

CREATE TYPE event_registration_status AS ENUM ('registered', 'waitlisted', 'cancelled');

CREATE TYPE availability_status AS ENUM ('available', 'busy', 'unavailable');

CREATE TYPE notification_type AS ENUM (
  'proposal_received',
  'proposal_accepted',
  'proposal_rejected',
  'project_status_changed',
  'new_message',
  'event_registration',
  'profile_interaction',
  'review_received'
);

CREATE TYPE currency_code AS ENUM ('INR', 'USD');

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  location TEXT,
  bio TEXT,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  linkedin TEXT,
  behance TEXT,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger: auto-create profile on new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)), ' ', '_'))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Trigger: auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- USER ROLES
-- ============================================================

CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FREELANCER PROFILES
-- ============================================================

CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  professional_title TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  experience_years INTEGER DEFAULT 0,
  hourly_rate NUMERIC(10, 2),
  currency currency_code DEFAULT 'INR',
  availability availability_status DEFAULT 'available',
  location TEXT,
  about TEXT,
  languages TEXT[] DEFAULT ARRAY['Tamil', 'English'],
  portfolio_intro TEXT,
  response_time TEXT DEFAULT '< 24 hours',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_freelancer_profiles_updated_at
  BEFORE UPDATE ON freelancer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Many-to-many: freelancers ↔ skills
CREATE TABLE freelancer_skills (
  freelancer_id UUID REFERENCES freelancer_profiles(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (freelancer_id, skill_id)
);

-- ============================================================
-- EMPLOYER PROFILES
-- ============================================================

CREATE TABLE employer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  company_logo TEXT,
  industry TEXT,
  company_size TEXT,
  website TEXT,
  location TEXT,
  about TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_employer_profiles_updated_at
  BEFORE UPDATE ON employer_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  budget_min NUMERIC(12, 2),
  budget_max NUMERIC(12, 2),
  currency currency_code DEFAULT 'INR',
  deadline DATE,
  location TEXT,
  is_remote BOOLEAN DEFAULT TRUE,
  experience_level TEXT DEFAULT 'intermediate',
  status project_status DEFAULT 'draft',
  proposals_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION generate_project_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := REGEXP_REPLACE(TRIM(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM projects WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_slug
  BEFORE INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION generate_project_slug();

-- ============================================================
-- PROJECT SKILLS (many-to-many)
-- ============================================================

CREATE TABLE project_skills (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- ============================================================
-- PROPOSALS
-- ============================================================

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  proposed_price NUMERIC(12, 2) NOT NULL,
  currency currency_code DEFAULT 'INR',
  delivery_days INTEGER NOT NULL,
  status proposal_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate active proposals from same freelancer for same project
  CONSTRAINT unique_active_proposal UNIQUE NULLS NOT DISTINCT (project_id, freelancer_id)
);

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update proposals_count on project
CREATE OR REPLACE FUNCTION update_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects SET proposals_count = proposals_count + 1 WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects SET proposals_count = GREATEST(proposals_count - 1, 0) WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_proposal_change
  AFTER INSERT OR DELETE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_project_proposal_count();

-- ============================================================
-- PACKAGES
-- ============================================================

CREATE TABLE packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency currency_code DEFAULT 'INR',
  delivery_days INTEGER NOT NULL DEFAULT 7,
  revisions INTEGER DEFAULT 2,
  includes TEXT[],
  status package_status DEFAULT 'active',
  orders_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_package_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := REGEXP_REPLACE(TRIM(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM packages WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_package_slug
  BEFORE INSERT ON packages
  FOR EACH ROW EXECUTE FUNCTION generate_package_slug();

-- ============================================================
-- PACKAGE ORDERS
-- ============================================================

CREATE TABLE package_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  currency currency_code DEFAULT 'INR',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_package_orders_updated_at
  BEFORE UPDATE ON package_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PORTFOLIO ITEMS
-- ============================================================

CREATE TABLE portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  project_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- EVENTS
-- ============================================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  event_type event_type DEFAULT 'meetup',
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  cover_image_url TEXT,
  capacity INTEGER,
  registrations_count INTEGER DEFAULT 0,
  status event_status DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION generate_event_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9\s]', '', 'g'));
  base_slug := REGEXP_REPLACE(TRIM(base_slug), '\s+', '-', 'g');
  final_slug := base_slug;

  WHILE EXISTS (SELECT 1 FROM events WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_generate_v4())) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;

  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_event_slug
  BEFORE INSERT ON events
  FOR EACH ROW EXECUTE FUNCTION generate_event_slug();

-- ============================================================
-- EVENT REGISTRATIONS
-- ============================================================

CREATE TABLE event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  status event_registration_status DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_event_registration UNIQUE (event_id, user_id)
);

-- Update registrations_count on event
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'registered' THEN
    UPDATE events SET registrations_count = registrations_count + 1 WHERE id = NEW.event_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'registered' THEN
    UPDATE events SET registrations_count = GREATEST(registrations_count - 1, 0) WHERE id = OLD.event_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'registered' AND NEW.status != 'registered' THEN
      UPDATE events SET registrations_count = GREATEST(registrations_count - 1, 0) WHERE id = NEW.event_id;
    ELSIF OLD.status != 'registered' AND NEW.status = 'registered' THEN
      UPDATE events SET registrations_count = registrations_count + 1 WHERE id = NEW.event_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_event_registration_change
  AFTER INSERT OR UPDATE OR DELETE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION update_event_registration_count();

-- ============================================================
-- REVIEWS
-- ============================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reviewee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent duplicate reviews for the same project relationship
  CONSTRAINT unique_project_review UNIQUE (project_id, reviewer_id, reviewee_id)
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONVERSATIONS
-- ============================================================

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_1 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2 UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_conversation UNIQUE (
    LEAST(participant_1::TEXT, participant_2::TEXT)::UUID,
    GREATEST(participant_1::TEXT, participant_2::TEXT)::UUID
  )
);

-- ============================================================
-- MESSAGES
-- ============================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  attachment_url TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update last_message_at on conversation
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations SET last_message_at = NEW.created_at WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();

-- ============================================================
-- SAVED ITEMS
-- ============================================================

CREATE TABLE saved_projects (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, project_id)
);

CREATE TABLE saved_creators (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, creator_id),
  CONSTRAINT no_self_save CHECK (user_id != creator_id)
);

CREATE TABLE saved_packages (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, package_id)
);

CREATE TABLE saved_events (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, event_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_client ON projects(client_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_proposals_project ON proposals(project_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_packages_creator ON packages(creator_id);
CREATE INDEX idx_packages_category ON packages(category_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_portfolio_creator ON portfolio_items(creator_id);
CREATE INDEX idx_freelancer_profiles_category ON freelancer_profiles(category_id);

-- Full-text search indexes
CREATE INDEX idx_projects_fts ON projects USING GIN (
  to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(description, ''))
);
CREATE INDEX idx_profiles_fts ON profiles USING GIN (
  to_tsvector('english', COALESCE(full_name, '') || ' ' || COALESCE(bio, ''))
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Profiles: public read, own write
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "profiles_own_insert" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_own_update" ON profiles
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User roles: own read/write
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_own_read" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_roles_own_insert" ON user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_roles_own_delete" ON user_roles
  FOR DELETE USING (auth.uid() = user_id);

-- Categories: public read, no public write
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Skills: public read, no public write
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_public_read" ON skills
  FOR SELECT USING (true);

-- Freelancer profiles: public read, own write
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "freelancer_profiles_public_read" ON freelancer_profiles
  FOR SELECT USING (true);

CREATE POLICY "freelancer_profiles_own_insert" ON freelancer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "freelancer_profiles_own_update" ON freelancer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Freelancer skills
ALTER TABLE freelancer_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "freelancer_skills_public_read" ON freelancer_skills
  FOR SELECT USING (true);

CREATE POLICY "freelancer_skills_own_write" ON freelancer_skills
  FOR ALL USING (
    auth.uid() = (SELECT user_id FROM freelancer_profiles WHERE id = freelancer_id)
  );

-- Employer profiles: public read, own write
ALTER TABLE employer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "employer_profiles_public_read" ON employer_profiles
  FOR SELECT USING (true);

CREATE POLICY "employer_profiles_own_insert" ON employer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "employer_profiles_own_update" ON employer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects: open projects public read, own write
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_public_read" ON projects
  FOR SELECT USING (status != 'draft' OR client_id = auth.uid());

CREATE POLICY "projects_own_insert" ON projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "projects_own_update" ON projects
  FOR UPDATE USING (auth.uid() = client_id);

CREATE POLICY "projects_own_delete" ON projects
  FOR DELETE USING (auth.uid() = client_id);

-- Project skills
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_skills_public_read" ON project_skills
  FOR SELECT USING (true);

CREATE POLICY "project_skills_own_write" ON project_skills
  FOR ALL USING (
    auth.uid() = (SELECT client_id FROM projects WHERE id = project_id)
  );

-- Proposals: freelancer own, project owner can view
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "proposals_freelancer_read" ON proposals
  FOR SELECT USING (
    auth.uid() = freelancer_id
    OR auth.uid() = (SELECT client_id FROM projects WHERE id = project_id)
  );

CREATE POLICY "proposals_freelancer_insert" ON proposals
  FOR INSERT WITH CHECK (auth.uid() = freelancer_id);

CREATE POLICY "proposals_freelancer_update" ON proposals
  FOR UPDATE USING (auth.uid() = freelancer_id AND status = 'pending');

CREATE POLICY "proposals_client_update_status" ON proposals
  FOR UPDATE USING (
    auth.uid() = (SELECT client_id FROM projects WHERE id = project_id)
  );

-- Packages: public read, own write
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "packages_public_read" ON packages
  FOR SELECT USING (status = 'active' OR creator_id = auth.uid());

CREATE POLICY "packages_own_insert" ON packages
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "packages_own_update" ON packages
  FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "packages_own_delete" ON packages
  FOR DELETE USING (auth.uid() = creator_id);

-- Package orders: buyer and creator can see
ALTER TABLE package_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "package_orders_own_read" ON package_orders
  FOR SELECT USING (
    auth.uid() = buyer_id
    OR auth.uid() = (SELECT creator_id FROM packages WHERE id = package_id)
  );

CREATE POLICY "package_orders_buyer_insert" ON package_orders
  FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Portfolio items: public read, own write
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_items_public_read" ON portfolio_items
  FOR SELECT USING (true);

CREATE POLICY "portfolio_items_own_write" ON portfolio_items
  FOR ALL USING (auth.uid() = creator_id);

-- Events: public read, own write
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "events_public_read" ON events
  FOR SELECT USING (status != 'cancelled' OR organizer_id = auth.uid());

CREATE POLICY "events_own_insert" ON events
  FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "events_own_update" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Event registrations: own read/write
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "event_registrations_own_read" ON event_registrations
  FOR SELECT USING (
    auth.uid() = user_id
    OR auth.uid() = (SELECT organizer_id FROM events WHERE id = event_id)
  );

CREATE POLICY "event_registrations_own_insert" ON event_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "event_registrations_own_update" ON event_registrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Reviews: public read, own write
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT USING (true);

CREATE POLICY "reviews_own_insert" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notifications: own only
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_own_read" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_own_update" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Conversations: participants only
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "conversations_participants_read" ON conversations
  FOR SELECT USING (auth.uid() = participant_1 OR auth.uid() = participant_2);

CREATE POLICY "conversations_authenticated_insert" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = participant_1 OR auth.uid() = participant_2);

-- Messages: conversation participants only
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "messages_participants_read" ON messages
  FOR SELECT USING (
    auth.uid() IN (
      SELECT participant_1 FROM conversations WHERE id = conversation_id
      UNION
      SELECT participant_2 FROM conversations WHERE id = conversation_id
    )
  );

CREATE POLICY "messages_own_insert" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Saved items: own only
ALTER TABLE saved_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_projects_own" ON saved_projects
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE saved_creators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_creators_own" ON saved_creators
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE saved_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_packages_own" ON saved_packages
  FOR ALL USING (auth.uid() = user_id);

ALTER TABLE saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_events_own" ON saved_events
  FOR ALL USING (auth.uid() = user_id);
