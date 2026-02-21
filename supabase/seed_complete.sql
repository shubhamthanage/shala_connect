-- ═══════════════════════════════════════════════════════════════════════════════
-- ShalaConnect — Complete Seed Data for 5 User Flows
-- Run in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════
--
-- STEP 1 (manual): Create Auth users in Supabase Dashboard first!
--   Authentication → Users → Add user (repeat 5 times)
--
--   | Email                        | Password  |
--   |-----------------------------|-----------|
--   | headmaster@shalaconnect.test | Test@1234 |
--   | teacher@shalaconnect.test    | Test@1234 |
--   | clerk@shalaconnect.test      | Test@1234 |
--   | student@shalaconnect.test    | Test@1234 |
--   | parent@shalaconnect.test     | Test@1234 |
--
-- Then run this entire file in SQL Editor.
-- ═══════════════════════════════════════════════════════════════════════════════

-- STEP 2: School
INSERT INTO schools (id, name, district, taluka, udise_code, type, phone, email)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'पुणे विद्यामंदिर',
  'पुणे',
  'हवेली',
  '27234500101',
  'combined',
  '9800000000',
  'info@punevidyamandir.edu'
)
ON CONFLICT (id) DO NOTHING;

-- STEP 3: Classes
INSERT INTO classes (id, school_id, grade, division, academic_year)
VALUES
  ('cccc1111-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 7, 'A', '2024-25'),
  ('cccc1111-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 7, 'B', '2024-25'),
  ('cccc1111-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 8, 'A', '2024-25'),
  ('cccc1111-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, 'A', '2024-25')
ON CONFLICT (school_id, grade, division, academic_year) DO NOTHING;

-- STEP 4: App users (from auth.users by email)
DO $$
DECLARE
  v_school_id UUID := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  v_auth_headmaster UUID;
  v_auth_teacher UUID;
  v_auth_clerk UUID;
  v_auth_student UUID;
  v_auth_parent UUID;
BEGIN
  SELECT id INTO v_auth_headmaster FROM auth.users WHERE email = 'headmaster@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_teacher FROM auth.users WHERE email = 'teacher@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_clerk FROM auth.users WHERE email = 'clerk@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_student FROM auth.users WHERE email = 'student@shalaconnect.test' LIMIT 1;
  SELECT id INTO v_auth_parent FROM auth.users WHERE email = 'parent@shalaconnect.test' LIMIT 1;

  IF v_auth_headmaster IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, phone, email)
    VALUES (v_auth_headmaster, v_school_id, 'headmaster', 'राजेश शर्मा', '9801000001', 'headmaster@shalaconnect.test')
    ON CONFLICT (auth_id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
  END IF;

  IF v_auth_teacher IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, phone, email)
    VALUES (v_auth_teacher, v_school_id, 'teacher', 'सुलभा देशमुख', '9801000002', 'teacher@shalaconnect.test')
    ON CONFLICT (auth_id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
  END IF;

  IF v_auth_clerk IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, phone, email)
    VALUES (v_auth_clerk, v_school_id, 'clerk', 'महेश जाधव', '9801000003', 'clerk@shalaconnect.test')
    ON CONFLICT (auth_id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
  END IF;

  IF v_auth_student IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, phone, email)
    VALUES (v_auth_student, v_school_id, 'student', 'रमेश पाटील', '9801000004', 'student@shalaconnect.test')
    ON CONFLICT (auth_id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
  END IF;

  IF v_auth_parent IS NOT NULL THEN
    INSERT INTO users (auth_id, school_id, role, name, phone, email)
    VALUES (v_auth_parent, NULL, 'parent', 'रजनी पाटील', '9801000005', 'parent@shalaconnect.test')
    ON CONFLICT (auth_id) DO UPDATE SET name = EXCLUDED.name, phone = EXCLUDED.phone, email = EXCLUDED.email;
  END IF;
END $$;

-- Link teacher to class 7A
UPDATE classes
SET class_teacher_id = (SELECT id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'teacher@shalaconnect.test' LIMIT 1)
WHERE id = 'cccc1111-0000-0000-0000-000000000001';

-- STEP 5: 20 students + 30 days attendance each (skip if class 7A already has 20)
DO $$
DECLARE
  names text[] := ARRAY[
    'रमेश पाटील','सीता जाधव','अमित शिंदे','प्रिया कुलकर्णी',
    'विकास मोरे','अनिता काळे','सुरेश वाघ','मेघा देसाई',
    'राहुल नाईक','पूजा गायकवाड','संदेश सावंत','रिया थोरात',
    'आकाश भोसले','निकिता पाटील','वरुण माने','श्रेया कांबळे',
    'हर्षल पवार','दीपाली साळवे','रोहित जगताप','स्मिता दळवी'
  ];
  i int;
  stu_id uuid;
  v_teacher_id uuid;
  v_student_count int;
BEGIN
  SELECT COUNT(*) INTO v_student_count FROM students WHERE class_id = 'cccc1111-0000-0000-0000-000000000001';
  IF v_student_count >= 20 THEN
    RETURN;
  END IF;

  SELECT u.id INTO v_teacher_id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'teacher@shalaconnect.test' LIMIT 1;

  FOR i IN 1..20 LOOP
    INSERT INTO students (id, school_id, class_id, name, roll_number, gender, rte_student)
    VALUES (
      gen_random_uuid(),
      'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
      'cccc1111-0000-0000-0000-000000000001',
      names[i],
      i::text,
      CASE WHEN i % 2 = 0 THEN 'female' ELSE 'male' END,
      i <= 3
    )
    RETURNING id INTO stu_id;

    INSERT INTO attendance (student_id, class_id, date, status, marked_by)
    SELECT
      stu_id,
      'cccc1111-0000-0000-0000-000000000001',
      (CURRENT_DATE - n)::date,
      (ARRAY['present','present','present','present','present','present','present','present','absent','late'])[1 + floor(random() * 10)::int],
      v_teacher_id
    FROM generate_series(1, 30) n
    ON CONFLICT (student_id, date) DO NOTHING;
  END LOOP;
END $$;

-- STEP 6: Fee structures
INSERT INTO fee_structures (school_id, class_id, fee_type, amount, academic_year, due_date)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccc1111-0000-0000-0000-000000000001', 'प्रथम सत्र शुल्क', 4500, '2024-25', '2024-06-15'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccc1111-0000-0000-0000-000000000001', 'द्वितीय सत्र शुल्क', 4500, '2024-25', '2025-01-15'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccc1111-0000-0000-0000-000000000001', 'परीक्षा शुल्क', 500, '2024-25', '2025-02-28');

-- STEP 6b: Sample exam + marks for class 7A (idempotent)
DO $$
DECLARE
  v_exam_id uuid := 'eeee1111-0000-0000-0000-000000000001';
  v_teacher_id uuid;
BEGIN
  SELECT u.id INTO v_teacher_id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'teacher@shalaconnect.test' LIMIT 1;
  INSERT INTO exams (id, school_id, class_id, exam_name, subject, date, max_marks, created_by)
  VALUES (v_exam_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cccc1111-0000-0000-0000-000000000001', 'अर्धवार्षिक परीक्षा', 'गणित', CURRENT_DATE - 30, 50, v_teacher_id)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO marks (exam_id, student_id, marks_obtained)
  SELECT v_exam_id, s.id, 25 + floor(random() * 25)::int
  FROM students s WHERE s.class_id = 'cccc1111-0000-0000-0000-000000000001'
  ON CONFLICT (exam_id, student_id) DO NOTHING;
END $$;

-- STEP 7: Announcements table + sample data (if table exists or we create it)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO announcements (school_id, title, content, created_by, is_published)
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'वार्षिक परीक्षा वेळापत्रक जाहीर',
  'वार्षिक परीक्षा दि. १५ मार्च ते ३० मार्च २०२५ या कालावधीत होणार आहे.',
  (SELECT u.id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'headmaster@shalaconnect.test' LIMIT 1),
  true
WHERE EXISTS (SELECT 1 FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'headmaster@shalaconnect.test');

INSERT INTO announcements (school_id, title, content, created_by, is_published)
SELECT
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'वार्षिक क्रीडा स्पर्धा — नोंदणी सुरू',
  'दि. १ मार्च रोजी वार्षिक क्रीडा स्पर्धा होणार आहे.',
  (SELECT u.id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'headmaster@shalaconnect.test' LIMIT 1),
  true
WHERE EXISTS (SELECT 1 FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'headmaster@shalaconnect.test');

-- Link student user to first student (रमेश पाटील)
UPDATE students
SET user_id = (SELECT u.id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'student@shalaconnect.test' LIMIT 1)
WHERE id = (SELECT id FROM students WHERE name = 'रमेश पाटील' AND class_id = 'cccc1111-0000-0000-0000-000000000001' LIMIT 1);

-- Link parent user to parent of first student
INSERT INTO parents (student_id, name, phone, relation, user_id)
SELECT
  s.id,
  'रजनी पाटील',
  '9801000005',
  'mother',
  (SELECT u.id FROM users u JOIN auth.users a ON u.auth_id = a.id WHERE a.email = 'parent@shalaconnect.test' LIMIT 1)
FROM students s
WHERE s.name = 'रमेश पाटील' AND s.class_id = 'cccc1111-0000-0000-0000-000000000001'
  AND NOT EXISTS (SELECT 1 FROM parents p WHERE p.student_id = s.id)
LIMIT 1;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Verification (run after seeding)
-- ═══════════════════════════════════════════════════════════════════════════════
-- SELECT 'students' as tbl, COUNT(*) FROM students WHERE class_id = 'cccc1111-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'attendance', COUNT(*) FROM attendance
-- UNION ALL SELECT 'fee_structures', COUNT(*) FROM fee_structures WHERE class_id = 'cccc1111-0000-0000-0000-000000000001'
-- UNION ALL SELECT 'announcements', COUNT(*) FROM announcements;
