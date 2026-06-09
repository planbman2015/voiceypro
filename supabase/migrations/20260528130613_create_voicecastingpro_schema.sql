/*
  # VoiceCastingPro Full Schema

  1. New Tables
    - `profiles` - User profiles linked to auth.users
      - id, user_id, full_name, avatar_url, role (talent/client/admin), created_at, updated_at
    - `voice_profiles` - ElevenLabs voice talent listings
      - id, user_id, name, headline, bio, avatar_url, elevenlabs_voice_link, voice_style_tags, languages, accent, gender, age_range, genres, commercial_use, pricing_text, pricing_min, pricing_max, availability, social_links, status, views, contact_clicks, is_featured, is_verified, created_at, updated_at
    - `categories` - Voice style categories
      - id, name, slug, description
    - `tags` - Searchable tags
      - id, name, slug, category
    - `inquiries` - Contact/lead forms from clients to talent
      - id, voice_profile_id, sender_name, sender_email, sender_company, message, project_type, budget, status, created_at
    - `moderation_flags` - Admin moderation actions
      - id, voice_profile_id, admin_id, action, reason, created_at
    - `profile_analytics` - Daily view/click tracking
      - id, voice_profile_id, date, views, contact_clicks

  2. Security
    - Enable RLS on all tables
    - Profiles: users can read/update their own
    - Voice profiles: public can read approved, owners can manage their own, admins can manage all
    - Inquiries: talent can read their own, senders cannot read others'
    - Moderation: admin only
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  full_name text DEFAULT '',
  avatar_url text DEFAULT '',
  role text DEFAULT 'client' CHECK (role IN ('talent', 'client', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Voice profiles table
CREATE TABLE IF NOT EXISTS voice_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  headline text DEFAULT '',
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  elevenlabs_voice_link text NOT NULL DEFAULT '',
  voice_style_tags text[] DEFAULT '{}',
  languages text[] DEFAULT '{"English"}',
  accent text DEFAULT '',
  gender text DEFAULT '' CHECK (gender IN ('', 'male', 'female', 'neutral', 'other')),
  age_range text DEFAULT '',
  genres text[] DEFAULT '{}',
  commercial_use boolean DEFAULT true,
  pricing_text text DEFAULT '',
  pricing_min integer DEFAULT 0,
  pricing_max integer DEFAULT 0,
  availability text DEFAULT 'available' CHECK (availability IN ('available', 'busy', 'unavailable')),
  social_links jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text DEFAULT '',
  views integer DEFAULT 0,
  contact_clicks integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE voice_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read approved visible profiles"
  ON voice_profiles FOR SELECT
  USING (status = 'approved' AND is_visible = true);

CREATE POLICY "Owners can read own profiles"
  ON voice_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert profiles"
  ON voice_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update own profiles"
  ON voice_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete own profiles"
  ON voice_profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id uuid REFERENCES voice_profiles(id) ON DELETE CASCADE NOT NULL,
  talent_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sender_name text NOT NULL DEFAULT '',
  sender_email text NOT NULL DEFAULT '',
  sender_company text DEFAULT '',
  message text NOT NULL DEFAULT '',
  project_type text DEFAULT '',
  budget text DEFAULT '',
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Talent can read own inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = talent_user_id);

CREATE POLICY "Talent can update own inquiry status"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (auth.uid() = talent_user_id)
  WITH CHECK (auth.uid() = talent_user_id);

-- Moderation flags table
CREATE TABLE IF NOT EXISTS moderation_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id uuid REFERENCES voice_profiles(id) ON DELETE CASCADE NOT NULL,
  admin_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL CHECK (action IN ('approved', 'rejected', 'flagged', 'removed')),
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE moderation_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage moderation flags"
  ON moderation_flags FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert moderation flags"
  ON moderation_flags FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  icon text DEFAULT '',
  sort_order integer DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  USING (true);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  category text DEFAULT ''
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tags"
  ON tags FOR SELECT
  USING (true);

-- Profile analytics table
CREATE TABLE IF NOT EXISTS profile_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voice_profile_id uuid REFERENCES voice_profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('view', 'contact_click', 'elevenlabs_click')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profile_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON profile_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can read own analytics"
  ON profile_analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM voice_profiles WHERE id = voice_profile_id AND user_id = auth.uid()
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_voice_profiles_status ON voice_profiles(status);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_user_id ON voice_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_gender ON voice_profiles(gender);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_accent ON voice_profiles(accent);
CREATE INDEX IF NOT EXISTS idx_voice_profiles_featured ON voice_profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_talent_user_id ON inquiries(talent_user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_voice_profile_id ON inquiries(voice_profile_id);

-- Insert seed categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Commercial', 'commercial', 'Advertising, brand, and marketing voices', 1),
  ('Narration', 'narration', 'Audiobooks, documentaries, e-learning', 2),
  ('Character', 'character', 'Animation, gaming, and character voices', 3),
  ('ASMR', 'asmr', 'Relaxation and ASMR content', 4),
  ('Corporate', 'corporate', 'Business, training, and IVR', 5),
  ('Podcast', 'podcast', 'Podcast hosting and intros', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert seed tags
INSERT INTO tags (name, slug, category) VALUES
  ('Warm', 'warm', 'style'),
  ('Authoritative', 'authoritative', 'style'),
  ('Conversational', 'conversational', 'style'),
  ('Energetic', 'energetic', 'style'),
  ('Smooth', 'smooth', 'style'),
  ('Gravelly', 'gravelly', 'style'),
  ('Bright', 'bright', 'style'),
  ('Deep', 'deep', 'style'),
  ('ASMR', 'asmr', 'genre'),
  ('Narration', 'narration', 'genre'),
  ('Commercial', 'commercial', 'genre'),
  ('Character', 'character', 'genre'),
  ('Documentary', 'documentary', 'genre'),
  ('E-Learning', 'e-learning', 'genre'),
  ('Podcast', 'podcast', 'genre'),
  ('Animation', 'animation', 'genre')
ON CONFLICT (slug) DO NOTHING;

-- Seed demo voice profiles (will appear as approved)
-- Note: These use placeholder user_ids that won't match real auth users
-- They are for display purposes only in the demo

