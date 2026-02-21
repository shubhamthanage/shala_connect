import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Client } from "pg"

/**
 * One-time fix for test user passwords (SQL seed used wrong bcrypt format).
 * Call: GET /api/admin/fix-test-passwords
 * Requires: DATABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
const PASSWORD = "Test@1234"

export async function GET() {
  const dbUrl = process.env.DATABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing Supabase config" },
      { status: 500 }
    )
  }
  if (!dbUrl) {
    return NextResponse.json(
      {
        error: "DATABASE_URL required. Add to .env.local from Supabase Dashboard → Database → Connection string (URI)",
      },
      { status: 500 }
    )
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  let rows: { id: string; email: string }[] = []
  try {
    const pg = new Client({ connectionString: dbUrl })
    await pg.connect()
    const res = await pg.query<{ id: string; email: string }>(
      "SELECT id, email FROM auth.users WHERE email LIKE '%@shalaconnect.test'"
    )
    rows = res.rows
    await pg.end()
  } catch (e) {
    return NextResponse.json(
      { error: "Database connection failed. Check DATABASE_URL.", details: (e as Error).message },
      { status: 500 }
    )
  }

  const results: { email: string; ok: boolean; error?: string }[] = []
  for (const u of rows) {
    const { error } = await supabase.auth.admin.updateUserById(u.id, {
      password: PASSWORD,
    })
    results.push({
      email: u.email,
      ok: !error,
      error: error?.message,
    })
  }

  return NextResponse.json({
    message: "Password reset to Test@1234 for test users",
    results,
  })
}
