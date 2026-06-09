ALTER TABLE voice_profiles ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

UPDATE voice_profiles
SET sort_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) AS rn
  FROM voice_profiles
) sub
WHERE voice_profiles.id = sub.id;
