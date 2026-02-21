# "Database error querying schema" — Fix

**Cause:** `auth.users` has NULL in token columns. Supabase Auth fails when reading such users.

## Fix 1: SQL (run in Supabase Dashboard → SQL Editor)

Run `supabase/fix_auth_schema_complete.sql`. Then clear cookies and try login.

## Fix 2: Recreate users via Admin API

```bash
npm run db:seed:reset
```

Then login at http://localhost:3000/login (headmaster@shalaconnect.test / Test@1234).

## Fix 3: New project

Create new project at [supabase.com/dashboard](https://supabase.com/dashboard), update .env.local, run `npm run db:migrate && npm run db:seed:reset`.
