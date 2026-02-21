-- ═══════════════════════════════════════════════════════════════════════════════
-- ShalaConnect — Seed School + Class (run this first)
-- Run in Supabase SQL Editor.
-- Then run: npm run db:seed:users  (creates users with correct password)
-- Password for all users: Test@1234
-- ═══════════════════════════════════════════════════════════════════════════════

-- Remove existing test users (so npm run db:seed:users can create fresh ones)
DELETE FROM auth.identities WHERE provider = 'email' AND user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@shalaconnect.test'
);
DELETE FROM auth.users WHERE email LIKE '%@shalaconnect.test';

-- School and class
INSERT INTO schools (id, name, district, taluka, udise_code, type, address, phone, email)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'पुणे विद्यामंदिर',
  'Pune',
  'Pune City',
  '27123456789',
  'combined',
  'शिवाजीनगर, पुणे',
  '02012345678',
  'contact@punevidyamandir.edu.in'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO classes (id, school_id, grade, division, academic_year)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  7,
  'A',
  '2024-25'
)
ON CONFLICT (school_id, grade, division, academic_year) DO NOTHING;
