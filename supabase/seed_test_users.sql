-- ═══════════════════════════════════════════════════════════════════════════════
-- ShalaConnect — Seed Test Users
-- Run this in Supabase SQL Editor AFTER creating Auth users in the Dashboard
-- ═══════════════════════════════════════════════════════════════════════════════

-- DIAGNOSTIC: Run this first to check if Auth users exist (should return 5 rows)
-- SELECT email, id FROM auth.users WHERE email LIKE '%@shalaconnect.test';

-- DIAGNOSTIC: Check app users (should return 5 after seed)
-- SELECT email, role FROM public.users;

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 1: Create demo school and class (run this first)
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

-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 2: Create Auth users in Supabase Dashboard first!
-- Go to: Authentication → Users → Add user → Create new user
--
-- Create these 5 users (password for all: Test@1234):
-- | Email                        | Password  |
-- |-----------------------------|-----------|
-- | headmaster@shalaconnect.test | Test@1234 |
-- | teacher@shalaconnect.test    | Test@1234 |
-- | clerk@shalaconnect.test      | Test@1234 |
-- | student@shalaconnect.test     | Test@1234 |
-- | parent@shalaconnect.test     | Test@1234 |
--
-- After creating each, copy their UUID from the user row (click on user).
-- ═══════════════════════════════════════════════════════════════════════════════

-- STEP 3: Add app users (replace the UUIDs below with actual auth user IDs from Dashboard)
-- Get UUIDs from: Authentication → Users → click each user → copy "User UID"

DO $$
DECLARE
  v_school_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_auth_headmaster UUID;
  v_auth_teacher UUID;
  v_auth_clerk UUID;
  v_auth_student UUID;
  v_auth_parent UUID;
BEGIN
  -- Get auth user IDs (replace these with your actual UUIDs from Dashboard)
  SELECT id INTO v_auth_headmaster FROM auth.users WHERE email = 'headmaster@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_teacher FROM auth.users WHERE email = 'teacher@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_clerk FROM auth.users WHERE email = 'clerk@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_student FROM auth.users WHERE email = 'student@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_parent FROM auth.users WHERE email = 'parent@shalaconnect.test' LIMIT 1;

  IF v_auth_headmaster IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, email)
    VALUES (v_auth_headmaster, v_school_id, 'headmaster', 'मुख्याध्यापक टेस्ट', 'headmaster@shalaconnect.test')
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;

  IF v_auth_teacher IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, email)
    VALUES (v_auth_teacher, v_school_id, 'teacher', 'शिक्षक टेस्ट', 'teacher@shalaconnect.test')
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;

  IF v_auth_clerk IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, email)
    VALUES (v_auth_clerk, v_school_id, 'clerk', 'कारकून टेस्ट', 'clerk@shalaconnect.test')
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;

  IF v_auth_student IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, email)
    VALUES (v_auth_student, v_school_id, 'student', 'विद्यार्थी टेस्ट', 'student@shalaconnect.test')
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;

  IF v_auth_parent IS NOT NULL THEN
    -- Parent has school_id = NULL
    INSERT INTO users (auth_id, school_id, role, name, email)
    VALUES (v_auth_parent, NULL, 'parent', 'पालक टेस्ट', 'parent@shalaconnect.test')
    ON CONFLICT (auth_id) DO NOTHING;
  END IF;
END $$;
