-- Add missing columns to notifications table for WhatsApp logging.
--
-- OPTION A: Run via npm (recommended)
--   1. Add to .env.local: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
--   2. Get it from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
--   3. Run: npm run db:migrate
--
-- OPTION B: Run manually in Supabase SQL Editor (paste this file).

-- Step 1: Add columns (safe to run multiple times)
ALTER TABLE notifications
  ADD COLUMN IF NOT EXISTS recipient_phone text,
  ADD COLUMN IF NOT EXISTS meta jsonb DEFAULT '{}';

-- Step 2: Add index for phone lookups
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_phone
  ON notifications(recipient_phone);

-- Step 3: Verify columns exist (run separately to see output)
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'notifications'
-- ORDER BY ordinal_position;
