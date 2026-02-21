# How to Get Supabase Keys for Shala Connect (New UI)

Step-by-step guide to copy the 4 required keys from the Supabase dashboard.

---

## Prerequisites

1. Sign in at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your **shala-connect** project (or create one)

---

## Method 1: Connect Dialog (fastest)

1. Open your project in the dashboard
2. Click the **Connect** button (top-right, or in the project overview)
3. In the Connect dialog you’ll see:
   - **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
   - **API Keys** section:
     - **anon** (public) → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - **service_role** (secret) → use for `SUPABASE_SERVICE_ROLE_KEY`
   - **Database** section:
     - **Connection string (URI)** → use for `DATABASE_URL`
     - Replace `[YOUR-PASSWORD]` with your database password (Project Settings → Database → Reset password if needed)

---

## Method 2: Via Settings (detailed)

### 1. `NEXT_PUBLIC_SUPABASE_URL`

1. Left sidebar → **Project Settings** (gear icon)
2. **General** tab
3. Copy **Reference ID** or **API URL** (e.g. `https://xxxxx.supabase.co`)

### 2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`

1. Left sidebar → **Project Settings** → **API**
2. Under **Project API keys**:
   - **API Keys** tab: copy **anon** key (JWT)
   - Or **Legacy API Keys** tab: copy **anon** key (JWT)
3. This key is safe for client-side use (browser, mobile apps)

### 3. `SUPABASE_SERVICE_ROLE_KEY`

1. Same page: **Project Settings** → **API**
2. Under **Project API keys**:
   - **API Keys** tab: copy **service_role** key (JWT)
   - Or **Legacy API Keys** tab: copy **service_role** key (JWT)
3. This key bypasses Row Level Security — use only on the server, never in the browser

### 4. `DATABASE_URL`

1. Left sidebar → **Project Settings** → **Database**
2. **Connection string** section
3. Choose **URI** (e.g. `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)
4. Replace `[YOUR-PASSWORD]` with your database password
5. If you don’t know your password: **Database** → **Reset database password**

---

## Add to `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://uorqjeaohgzpuibikbjd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.uorqjeaohgzpuibikbjd.supabase.co:5432/postgres
```

Replace the example values with your actual keys and password.

---

## New vs legacy keys

Supabase is moving to new key formats:

| Old (still works) | New format |
|------------------|------------|
| `anon` (JWT)     | `sb_publishable_...` |
| `service_role` (JWT) | `sb_secret_...` |

Shala Connect currently uses the **anon** and **service_role** JWT keys. Both are available under **Legacy API Keys** in Project Settings → API. Use those until you migrate to the new keys.

---

## Quick links (replace `PROJECT_REF` with your project ID)

- **Connect dialog** (all 4 keys in one place): `https://supabase.com/dashboard/project/PROJECT_REF?showConnect=true`
- **API keys**: `https://supabase.com/dashboard/project/PROJECT_REF/settings/api`
- **Database / connection string**: `https://supabase.com/dashboard/project/PROJECT_REF/settings/database`
