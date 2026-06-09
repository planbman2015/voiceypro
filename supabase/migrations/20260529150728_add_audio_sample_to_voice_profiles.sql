/*
  # Add audio sample support to voice profiles

  1. Schema Changes
    - `voice_profiles`: add `demo_audio_url` column (text, nullable) for storing a public URL
      to an uploaded audio sample (mp3/wav/ogg, max 10 MB)

  2. Storage
    - New `voice-samples` public bucket with 10 MB file size limit
    - Supports audio/mpeg, audio/wav, audio/ogg, audio/mp4
    - Authenticated users can upload/update/delete only within their own folder
    - Public read access so the audio player works without auth

  3. Notes
    - Column is optional; existing profiles default to NULL (no sample)
    - No RLS changes needed on voice_profiles — existing policies cover this column
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'voice_profiles' AND column_name = 'demo_audio_url'
  ) THEN
    ALTER TABLE voice_profiles ADD COLUMN demo_audio_url text DEFAULT NULL;
  END IF;
END $$;

-- Create voice-samples storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voice-samples',
  'voice-samples',
  true,
  10485760,
  ARRAY['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-wav', 'audio/wave']
)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "Public can view voice samples"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'voice-samples');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload voice samples"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'voice-samples'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own files
CREATE POLICY "Authenticated users can update own voice samples"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'voice-samples'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own files
CREATE POLICY "Authenticated users can delete own voice samples"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'voice-samples'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
