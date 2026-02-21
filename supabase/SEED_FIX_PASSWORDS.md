# Fix Test User Passwords (Invalid Login Credentials)

If you get "Invalid login credentials" when logging in with test users, the passwords need to be reset.

## Option 1: Generate SQL (recommended, no DATABASE_URL)

1. Run: `npm run db:fix-passwords`
2. Copy the output (the UPDATE statements)
3. Paste into **Supabase Dashboard** → **SQL Editor** → Run
4. Log in at http://localhost:3000/login with any test user, password: `Test@1234`

## Option 2: Supabase Dashboard

1. Go to **Supabase Dashboard** → **Authentication** → **Users**
2. For each test user: click user → **"..."** → **Send password recovery** (user will get email) or delete and recreate via **Add user** with password `Test@1234`

## Option 3: API Route (requires DATABASE_URL)

1. Add `DATABASE_URL` to `.env.local`
2. Restart dev server, visit: http://localhost:3000/api/admin/fix-test-passwords

## Option 4: CLI Script (requires DATABASE_URL)

```bash
npm run db:seed:users -- --fix
```
