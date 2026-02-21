-- ═══════════════════════════════════════════════════════════════════════════════
-- ShalaConnect — All-in-One Seed (run this ONCE in Supabase SQL Editor)
-- Password for all users: Test@1234
-- Uses bcrypt hash (cost 10) compatible with Supabase Auth
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Remove existing test users
DELETE FROM auth.identities WHERE provider = 'email' AND user_id IN (
  SELECT id FROM auth.users WHERE email LIKE '%@shalaconnect.test'
);
DELETE FROM auth.users WHERE email LIKE '%@shalaconnect.test';

-- 2. School and class
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

-- 3. Auth users + app users (bcrypt hash for Test@1234, cost 10)
DO $$
DECLARE
  v_school_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_pw TEXT := '$2b$10$1467mv.ojEVVPPXPZazxO.572sRODfrLelFHMZoeHltX50HJoo8O.';
  v_id UUID;
  v_email TEXT;
  v_role TEXT;
  v_name TEXT;
BEGIN
  FOR v_email, v_role, v_name IN
    SELECT * FROM (VALUES
      ('headmaster@shalaconnect.test', 'headmaster', 'मुख्याध्यापक टेस्ट'),
      ('teacher@shalaconnect.test', 'teacher', 'शिक्षक टेस्ट'),
      ('clerk@shalaconnect.test', 'clerk', 'कारकून टेस्ट'),
      ('student@shalaconnect.test', 'student', 'विद्यार्थी टेस्ट'),
      ('parent@shalaconnect.test', 'parent', 'पालक टेस्ट')
    ) AS t(email, role, name)
  LOOP
    v_id := gen_random_uuid();

    -- Token columns must be '' not NULL (Supabase Auth fails on NULL: "Database error querying schema")
    -- Try email_change_token_new first (newer Supabase); fallback to email_change_token (older)
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at,
      confirmation_token, email_change, recovery_token
    )
    VALUES (
      v_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      v_pw,
      NOW(),
      '{"provider":"email","providers":["email"]}',
      format('{"role":"%s"}', v_role)::jsonb,
      NOW(),
      NOW(),
      '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    )
    VALUES (
      gen_random_uuid(),
      v_id,
      format('{"sub":"%s","email":"%s"}', v_id, v_email)::jsonb,
      'email',
      v_id::text,
      NOW(),
      NOW(),
      NOW()
    );

    INSERT INTO public.users (auth_id, school_id, role, name, email)
    VALUES (
      v_id,
      CASE WHEN v_role = 'parent' THEN NULL ELSE v_school_id END,
      v_role::user_role,
      v_name,
      v_email
    )
    ON CONFLICT (auth_id) DO NOTHING;
  END LOOP;
END $$;
