
/*
# Seed Demo Voice Profiles

Inserts 6 demo voice talent profiles so the landing page and browse page
show real content immediately. Creates placeholder auth users and matching
profiles first (required by the voice_profiles foreign key constraint).

1. New Data
   - 6 placeholder auth.users rows (demo-only, non-login accounts)
   - 6 corresponding public.profiles rows
   - 6 voice_profiles rows with status='approved', is_visible=true

2. Notes
   - Uses ON CONFLICT DO NOTHING so re-running is safe
   - Demo users cannot sign in (no password set)
   - All voices have sort_order 1-6 and is_featured=true for top 3
*/

DO $$
BEGIN

-- Insert placeholder auth users
INSERT INTO auth.users (id, instance_id, email, encrypted_password, created_at, updated_at, aud, role, email_confirmed_at)
VALUES
  ('00000000-0000-0000-0001-000000000001'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo1@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now()),
  ('00000000-0000-0000-0001-000000000002'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo2@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now()),
  ('00000000-0000-0000-0001-000000000003'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo3@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now()),
  ('00000000-0000-0000-0001-000000000004'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo4@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now()),
  ('00000000-0000-0000-0001-000000000005'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo5@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now()),
  ('00000000-0000-0000-0001-000000000006'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'demo6@voiceypro.com', '', now(), now(), 'authenticated', 'authenticated', now())
ON CONFLICT (id) DO NOTHING;

-- Insert profiles
INSERT INTO profiles (id, user_id, full_name, avatar_url, role, created_at, updated_at)
VALUES
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000001'::uuid, 'Marcus Cole',    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000002'::uuid, 'Sophia Laurent', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000003'::uuid, 'James Ryder',    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000004'::uuid, 'Aisha Mensah',   'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000005'::uuid, 'Lars Eriksson',  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now()),
  (gen_random_uuid(), '00000000-0000-0000-0001-000000000006'::uuid, 'Carmen Reyes',   'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400', 'talent', now(), now())
ON CONFLICT (user_id) DO NOTHING;

-- Insert voice profiles
INSERT INTO voice_profiles (
  id, user_id, name, headline, bio, avatar_url, elevenlabs_voice_link,
  voice_style_tags, languages, accent, gender, age_range, genres,
  commercial_use, pricing_text, pricing_min, pricing_max, availability,
  social_links, status, rejection_reason, views, contact_clicks,
  is_featured, is_verified, is_visible, sort_order, created_at, updated_at
) VALUES
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    '00000000-0000-0000-0001-000000000001'::uuid,
    'Marcus Cole',
    'Commercial & Documentary ElevenLabs Voice | Deep, Authoritative Narration',
    'With over 12 years in professional voice work, I specialize in commercial campaigns, documentary narration, and corporate content. My ElevenLabs Professional Voice Clone captures every nuance of my natural delivery — warm, measured, and built for trust.',
    'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo1',
    ARRAY['Authoritative','Warm','Deep'],
    ARRAY['English'],
    'American', 'male', '35-50',
    ARRAY['Commercial','Documentary','Corporate','Narration'],
    true, 'Starting at $150/project', 150, 800, 'available',
    '{"linkedin":"https://linkedin.com","website":"https://example.com"}'::jsonb,
    'approved', '', 1247, 89, true, true, true, 1, now(), now()
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    '00000000-0000-0000-0001-000000000002'::uuid,
    'Sophia Laurent',
    'ASMR & Meditation ElevenLabs Voice | Soft, Soothing Presence',
    'I create immersive audio experiences for wellness brands, meditation apps, and e-learning platforms. My Professional Voice Clone on ElevenLabs faithfully reproduces my signature soft, close-mic delivery that listeners love.',
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo2',
    ARRAY['Warm','Smooth','Conversational'],
    ARRAY['English','French'],
    'British', 'female', '25-35',
    ARRAY['ASMR','Meditation','E-Learning','Narration'],
    true, 'From $100/project', 100, 500, 'available',
    '{"tiktok":"https://tiktok.com","instagram":"https://instagram.com"}'::jsonb,
    'approved', '', 2103, 156, true, true, true, 2, now(), now()
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    '00000000-0000-0000-0001-000000000003'::uuid,
    'James Ryder',
    'Character & Animation ElevenLabs Voice | Range from Hero to Villain',
    'Gaming veteran with 200+ character roles. My ElevenLabs Professional Voice Clone lets game studios and animation studios prototype characters instantly using my versatile voice library before committing to full productions.',
    'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo3',
    ARRAY['Gravelly','Deep','Energetic'],
    ARRAY['English'],
    'American', 'male', '30-45',
    ARRAY['Character','Animation','Gaming','Commercial'],
    true, 'Custom quotes for projects', 200, 2000, 'available',
    '{"website":"https://example.com","imdb":"https://imdb.com"}'::jsonb,
    'approved', '', 876, 67, true, true, true, 3, now(), now()
  ),
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    '00000000-0000-0000-0001-000000000004'::uuid,
    'Aisha Mensah',
    'Audiobook & Podcast ElevenLabs Voice | African-American Storytelling Tradition',
    'Award-winning audiobook narrator and podcast host. My ElevenLabs Professional Voice Clone captures my expressive, story-driven style with perfect tonal fidelity — ideal for long-form content where consistency matters.',
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo4',
    ARRAY['Warm','Bright','Conversational'],
    ARRAY['English'],
    'American', 'female', '28-40',
    ARRAY['Narration','Podcast','Audiobook','E-Learning'],
    true, '$0.10 per word (min $75)', 75, 600, 'busy',
    '{"linkedin":"https://linkedin.com","podcast":"https://example.com"}'::jsonb,
    'approved', '', 1589, 112, false, true, true, 4, now(), now()
  ),
  (
    '10000000-0000-0000-0000-000000000005'::uuid,
    '00000000-0000-0000-0001-000000000005'::uuid,
    'Lars Eriksson',
    'Nordic ElevenLabs Voice | Corporate, Tech & Scandinavian Accent',
    'Based in Stockholm, I provide professional Scandinavian-accented English for global tech brands, fintech companies, and international e-learning platforms. My ElevenLabs clone is optimized for corporate and B2B content.',
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo5',
    ARRAY['Authoritative','Smooth','Conversational'],
    ARRAY['English','Swedish'],
    'Scandinavian', 'male', '30-45',
    ARRAY['Corporate','E-Learning','Commercial','Documentary'],
    true, '€120–€400 per project', 130, 440, 'available',
    '{"linkedin":"https://linkedin.com"}'::jsonb,
    'approved', '', 723, 44, false, true, true, 5, now(), now()
  ),
  (
    '10000000-0000-0000-0000-000000000006'::uuid,
    '00000000-0000-0000-0001-000000000006'::uuid,
    'Carmen Reyes',
    'Bilingual ElevenLabs Voice | Spanish & English Commercial Specialist',
    'Fluent native speaker in both English and Spanish, I deliver polished commercial and brand content for companies targeting US-Hispanic and Latin American markets. My ElevenLabs Professional Voice Clone is available in both languages.',
    'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://elevenlabs.io/voice-lab/share/demo6',
    ARRAY['Warm','Energetic','Bright'],
    ARRAY['English','Spanish'],
    'Latin American', 'female', '25-38',
    ARRAY['Commercial','Narration','Corporate','Podcast'],
    true, '$120 base / project', 120, 700, 'available',
    '{"instagram":"https://instagram.com","fiverr":"https://fiverr.com"}'::jsonb,
    'approved', '', 1342, 98, false, true, true, 6, now(), now()
  )
ON CONFLICT (id) DO NOTHING;

END $$;
