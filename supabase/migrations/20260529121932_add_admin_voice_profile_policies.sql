/*
  # Admin Full-Access Policies for Voice Profiles

  Adds SELECT, UPDATE, DELETE, and INSERT policies so that users with
  role = 'admin' in the profiles table can manage all voice_profile rows,
  regardless of ownership. These supplement the existing owner-scoped policies.

  1. New Policies on voice_profiles
     - "Admins can select all profiles"
     - "Admins can insert profiles"
     - "Admins can update all profiles"
     - "Admins can delete all profiles"
*/

CREATE POLICY "Admins can select all profiles"
  ON voice_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert all profiles"
  ON voice_profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles"
  ON voice_profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all profiles"
  ON voice_profiles FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
