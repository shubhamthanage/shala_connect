-- ═══════════════════════════════════════════════════════════════════════════════
-- ShalaConnect — Maharashtra School Management System
-- Supabase Database Schema
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TYPE user_role AS ENUM ('headmaster', 'teacher', 'clerk', 'student', 'parent');
CREATE TYPE school_type AS ENUM ('primary', 'secondary', 'higher_secondary', 'combined');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE payment_mode AS ENUM ('cash', 'upi', 'card', 'cheque', 'bank_transfer', 'razorpay');
CREATE TYPE notification_type AS ENUM ('whatsapp', 'sms', 'email');
CREATE TYPE notification_sent_to AS ENUM ('all', 'class', 'individual');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');

-- ═══════════════════════════════════════════════════════════════════════════════
-- CORE TABLES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Schools
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  district TEXT NOT NULL,
  taluka TEXT NOT NULL,
  udise_code TEXT UNIQUE,
  type school_type NOT NULL DEFAULT 'primary',
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Users (links to auth.users via auth_id)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  avatar_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT users_school_required CHECK (
    (role IN ('headmaster', 'teacher', 'clerk', 'student') AND school_id IS NOT NULL) OR
    (role = 'parent' AND school_id IS NULL)
  )
);

CREATE INDEX idx_users_auth_id ON users(auth_id);
CREATE INDEX idx_users_school_id ON users(school_id);
CREATE INDEX idx_users_role ON users(role);

-- 3. Classes
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  grade SMALLINT NOT NULL CHECK (grade >= 1 AND grade <= 10),
  division CHAR(1) NOT NULL,
  academic_year TEXT NOT NULL,
  class_teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, grade, division, academic_year)
);

CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_class_teacher_id ON classes(class_teacher_id);
CREATE INDEX idx_classes_academic_year ON classes(academic_year);

-- 4. Students
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  roll_number TEXT,
  dob DATE,
  gender TEXT,
  aadhar TEXT,
  address TEXT,
  photo_url TEXT,
  rte_student BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(school_id, class_id, roll_number)
);

CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_class_id ON students(class_id);

-- 5. Parents
CREATE TABLE parents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp_number TEXT,
  email TEXT,
  relation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parents_student_id ON parents(student_id);

-- Link parent users to parents table (for auth)
ALTER TABLE parents ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX idx_parents_user_id ON parents(user_id);

-- Link student users to students table (for auth)
ALTER TABLE students ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX idx_students_user_id ON students(user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ATTENDANCE
-- ═══════════════════════════════════════════════════════════════════════════════

-- 6. Attendance
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
CREATE INDEX idx_attendance_date ON attendance(date);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FEES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 7. Fee Structures
CREATE TABLE fee_structures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  fee_type TEXT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
  academic_year TEXT NOT NULL,
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_school_id ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_class_id ON fee_structures(class_id);

-- 8. Fee Payments
CREATE TABLE fee_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
  amount_paid DECIMAL(12, 2) NOT NULL CHECK (amount_paid >= 0),
  payment_date DATE NOT NULL,
  payment_mode payment_mode NOT NULL,
  razorpay_order_id TEXT,
  receipt_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_fee_structure_id ON fee_payments(fee_structure_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ACADEMICS
-- ═══════════════════════════════════════════════════════════════════════════════

-- 9. Exams
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  exam_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  max_marks DECIMAL(6, 2) NOT NULL CHECK (max_marks >= 0),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_school_id ON exams(school_id);
CREATE INDEX idx_exams_class_id ON exams(class_id);

-- 10. Marks
CREATE TABLE marks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained DECIMAL(6, 2) NOT NULL CHECK (marks_obtained >= 0),
  grade TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(exam_id, student_id)
);

CREATE INDEX idx_marks_exam_id ON marks(exam_id);
CREATE INDEX idx_marks_student_id ON marks(student_id);

-- 11. Homework
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_homework_class_id ON homework(class_id);
CREATE INDEX idx_homework_teacher_id ON homework(teacher_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- 12. Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL,
  sent_to notification_sent_to NOT NULL,
  status notification_status NOT NULL DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- For class/individual targeting
  target_class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_notifications_school_id ON notifications(school_id);
CREATE INDEX idx_notifications_status ON notifications(status);

-- ═══════════════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS FOR RLS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Get current app user record
CREATE OR REPLACE FUNCTION get_app_user()
RETURNS TABLE (
  user_id UUID,
  user_school_id UUID,
  user_role user_role,
  is_headmaster BOOLEAN,
  is_teacher BOOLEAN,
  is_student BOOLEAN,
  is_parent BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.school_id,
    u.role,
    (u.role = 'headmaster'),
    (u.role = 'teacher'),
    (u.role = 'student'),
    (u.role = 'parent')
  FROM users u
  WHERE u.auth_id = auth.uid()
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get teacher's class IDs
CREATE OR REPLACE FUNCTION get_teacher_class_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT id FROM classes WHERE class_teacher_id = p_user_id;
$$ LANGUAGE sql STABLE;

-- Get parent's student IDs
CREATE OR REPLACE FUNCTION get_parent_student_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT student_id FROM parents WHERE user_id = p_user_id;
$$ LANGUAGE sql STABLE;

-- ═══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════

ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: SCHOOLS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access to their school
CREATE POLICY "headmaster_schools_all" ON schools
  FOR ALL USING (
    id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher/Clerk/Student: read their school
CREATE POLICY "staff_students_schools_read" ON schools
  FOR SELECT USING (
    id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND school_id IS NOT NULL)
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: USERS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Users can read their own record
CREATE POLICY "users_read_own" ON users
  FOR SELECT USING (auth_id = auth.uid());

-- Headmaster: full access to users in their school
CREATE POLICY "headmaster_users_all" ON users
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher/Clerk: read users in their school
CREATE POLICY "staff_users_read" ON users
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role IN ('teacher', 'clerk'))
  );

-- Parent: read their own record and users linked to their children
CREATE POLICY "parent_users_read" ON users
  FOR SELECT USING (
    id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)
    OR id IN (SELECT user_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- Student: read own record
CREATE POLICY "student_users_read_own" ON users
  FOR SELECT USING (auth_id = auth.uid());

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: CLASSES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_classes_all" ON classes
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher: full access to their classes
CREATE POLICY "teacher_classes_all" ON classes
  FOR ALL USING (
    class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)
  );

-- Clerk: read all classes in school
CREATE POLICY "clerk_classes_read" ON classes
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk')
  );

-- Student: read own class
CREATE POLICY "student_classes_read" ON classes
  FOR SELECT USING (
    id IN (SELECT class_id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read classes of their children
CREATE POLICY "parent_classes_read" ON classes
  FOR SELECT USING (
    id IN (SELECT class_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: STUDENTS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_students_all" ON students
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher: access students in their classes
CREATE POLICY "teacher_students_all" ON students
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Clerk: full access to students in school
CREATE POLICY "clerk_students_all" ON students
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk')
  );

-- Student: read own record only
CREATE POLICY "student_read_own" ON students
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)
  );

-- Parent: read their children only
CREATE POLICY "parent_students_read" ON students
  FOR SELECT USING (
    id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: PARENTS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster/Teacher/Clerk: access parents of students in school
CREATE POLICY "staff_parents_all" ON parents
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN users u ON u.auth_id = auth.uid()
      WHERE s.school_id = u.school_id
        AND u.role IN ('headmaster', 'teacher', 'clerk')
    )
  );

-- Parent: read own record only
CREATE POLICY "parent_read_own" ON parents
  FOR SELECT USING (
    user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)
  );

-- Student: read parents linked to them (for viewing own parent info)
CREATE POLICY "student_parents_read" ON parents
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: ATTENDANCE
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_attendance_all" ON attendance
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster'))
  );

-- Teacher: access attendance for their classes
CREATE POLICY "teacher_attendance_all" ON attendance
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Clerk: full access
CREATE POLICY "clerk_attendance_all" ON attendance
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk'))
  );

-- Student: read own attendance only
CREATE POLICY "student_attendance_read" ON attendance
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read attendance of their children
CREATE POLICY "parent_attendance_read" ON attendance
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: FEE_STRUCTURES
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_fee_structures_all" ON fee_structures
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher/Clerk: read
CREATE POLICY "staff_fee_structures_read" ON fee_structures
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role IN ('teacher', 'clerk'))
  );

-- Student: read fee structures for their class
CREATE POLICY "student_fee_structures_read" ON fee_structures
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
    OR class_id IS NULL
  );

-- Parent: read fee structures for their children's classes
CREATE POLICY "parent_fee_structures_read" ON fee_structures
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
    OR class_id IS NULL
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: FEE_PAYMENTS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster/Clerk: full access
CREATE POLICY "headmaster_clerk_fee_payments_all" ON fee_payments
  FOR ALL USING (
    student_id IN (
      SELECT s.id FROM students s
      JOIN users u ON u.auth_id = auth.uid()
      WHERE s.school_id = u.school_id AND u.role IN ('headmaster', 'clerk')
    )
  );

-- Teacher: read fee payments for students in their classes
CREATE POLICY "teacher_fee_payments_read" ON fee_payments
  FOR SELECT USING (
    student_id IN (
      SELECT s.id FROM students s
      WHERE s.class_id IN (SELECT id FROM classes WHERE class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
    )
  );

-- Student: read own fee payments
CREATE POLICY "student_fee_payments_read" ON fee_payments
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read fee payments for their children
CREATE POLICY "parent_fee_payments_read" ON fee_payments
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: EXAMS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_exams_all" ON exams
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher: full access to exams for their classes
CREATE POLICY "teacher_exams_all" ON exams
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Clerk: read all exams in school
CREATE POLICY "clerk_exams_read" ON exams
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk')
  );

-- Student: read exams for their class
CREATE POLICY "student_exams_read" ON exams
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read exams for their children's classes
CREATE POLICY "parent_exams_read" ON exams
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: MARKS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_marks_all" ON marks
  FOR ALL USING (
    exam_id IN (SELECT id FROM exams WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster'))
  );

-- Teacher: full access to marks for their class exams
CREATE POLICY "teacher_marks_all" ON marks
  FOR ALL USING (
    exam_id IN (SELECT id FROM exams WHERE class_id IN (SELECT id FROM classes WHERE class_teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- Clerk: read
CREATE POLICY "clerk_marks_read" ON marks
  FOR SELECT USING (
    exam_id IN (SELECT id FROM exams WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk'))
  );

-- Student: read own marks only
CREATE POLICY "student_marks_read" ON marks
  FOR SELECT USING (
    student_id IN (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read marks of their children
CREATE POLICY "parent_marks_read" ON marks
  FOR SELECT USING (
    student_id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: HOMEWORK
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_homework_all" ON homework
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster'))
  );

-- Teacher: full access to their homework
CREATE POLICY "teacher_homework_all" ON homework
  FOR ALL USING (
    teacher_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)
  );

-- Clerk: read
CREATE POLICY "clerk_homework_read" ON homework
  FOR SELECT USING (
    class_id IN (SELECT id FROM classes WHERE school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'clerk'))
  );

-- Student: read homework for their class
CREATE POLICY "student_homework_read" ON homework
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read homework for their children's classes
CREATE POLICY "parent_homework_read" ON homework
  FOR SELECT USING (
    class_id IN (SELECT class_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS: NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════════════════════════

-- Headmaster: full access
CREATE POLICY "headmaster_notifications_all" ON notifications
  FOR ALL USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role = 'headmaster')
  );

-- Teacher/Clerk: read notifications for their school
CREATE POLICY "staff_notifications_read" ON notifications
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM users WHERE auth_id = auth.uid() AND role IN ('teacher', 'clerk'))
  );

-- Student: read notifications for their school
CREATE POLICY "student_notifications_read" ON notifications
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM students WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1))
  );

-- Parent: read notifications for their children's schools
CREATE POLICY "parent_notifications_read" ON notifications
  FOR SELECT USING (
    school_id IN (SELECT school_id FROM students WHERE id IN (SELECT student_id FROM parents WHERE user_id = (SELECT id FROM users WHERE auth_id = auth.uid() LIMIT 1)))
  );

-- ═══════════════════════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fee_structures_updated_at BEFORE UPDATE ON fee_structures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exams_updated_at BEFORE UPDATE ON exams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_marks_updated_at BEFORE UPDATE ON marks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_homework_updated_at BEFORE UPDATE ON homework
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
