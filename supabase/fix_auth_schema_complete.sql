-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX "Database error querying schema" — Run in Supabase SQL Editor
-- Run this ONCE. Fixes auth.users token columns (NULL → '')
-- ═══════════════════════════════════════════════════════════════════════════════

-- Step 1: Fix existing users — set all token varchar columns to ''
DO $$
DECLARE
  col RECORD;
  sql TEXT;
BEGIN
  FOR col IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'auth' AND table_name = 'users'
      AND data_type IN ('character varying', 'varchar', 'text')
      AND (column_name LIKE '%token%' OR column_name = 'email_change')
  LOOP
    sql := format(
      'UPDATE auth.users SET %I = COALESCE(%I, '''') WHERE %I IS NULL',
      col.column_name, col.column_name, col.column_name
    );
    EXECUTE sql;
    RAISE NOTICE 'Fixed column: %', col.column_name;
  END LOOP;
END $$;

-- Step 2: Set defaults so future inserts get '' (optional, may require Supabase support)
-- Uncomment only if Step 1 alone doesn't fix login:
/*
ALTER TABLE auth.users ALTER COLUMN confirmation_token SET DEFAULT '';
ALTER TABLE auth.users ALTER COLUMN recovery_token SET DEFAULT '';
ALTER TABLE auth.users ALTER COLUMN email_change SET DEFAULT '';
*/
