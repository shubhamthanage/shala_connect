-- ═══════════════════════════════════════════════════════════════════════════════
-- FIX "Database error querying schema" / immediate logout after login
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new
-- Run this ONCE. Fixes auth.users token columns (NULL → '')
-- ═══════════════════════════════════════════════════════════════════════════════

-- Step 1: Fix known token columns (Supabase GoTrue expects '' not NULL)
UPDATE auth.users SET confirmation_token = '' WHERE confirmation_token IS NULL;
UPDATE auth.users SET recovery_token = '' WHERE recovery_token IS NULL;
UPDATE auth.users SET email_change = '' WHERE email_change IS NULL;
UPDATE auth.users SET email_change_token_new = '' WHERE email_change_token_new IS NULL;

-- Step 2: Fix any other token/varchar columns (dynamic, for future schema changes)
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
