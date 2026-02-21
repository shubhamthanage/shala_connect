#!/usr/bin/env node
/**
 * Test Supabase Auth API — diagnose "Database error querying schema"
 * Run: node scripts/test-auth-api.js
 */

const fs = require("fs")
const path = require("path")

const envPath = path.join(__dirname, "..", ".env.local")
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8")
  for (const line of content.split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (m) {
      const key = m[1].trim()
      let val = m[2].trim()
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
      if (!process.env[key]) process.env[key] = val
    }
  }
}

const { createClient } = require("@supabase/supabase-js")

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
  }

  const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })
  const anon = createClient(url, anonKey || serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

  const testEmail = "auth-test-" + Date.now() + "@shalaconnect.test"
  const testPw = "Test@1234"

  console.log("1. Testing Admin API: listUsers...")
  const { data: listData, error: listErr } = await admin.auth.admin.listUsers({ perPage: 5 })
  if (listErr) {
    console.error("   ❌ listUsers failed:", listErr.message)
    console.error("      Code:", listErr.status, "| Details:", JSON.stringify(listErr, null, 2))
  } else {
    console.log("   ✓ listUsers OK (", listData?.users?.length ?? 0, "users)")
  }

  console.log("\n2. Testing Admin API: createUser...")
  const { data: createData, error: createErr } = await admin.auth.admin.createUser({
    email: testEmail,
    password: testPw,
    email_confirm: true,
  })
  if (createErr) {
    console.error("   ❌ createUser failed:", createErr.message)
    console.error("      Code:", createErr.status, "| Details:", JSON.stringify(createErr, null, 2))
  } else {
    console.log("   ✓ createUser OK (id:", createData?.user?.id?.slice(0, 8) + "...)")
  }

  if (!createErr) {
    console.log("\n3. Testing signInWithPassword (login)...")
    const { data: signData, error: signErr } = await anon.auth.signInWithPassword({ email: testEmail, password: testPw })
    if (signErr) {
      console.error("   ❌ signIn failed:", signErr.message)
      console.error("      Code:", signErr.status, "| Details:", JSON.stringify(signErr, null, 2))
    } else {
      console.log("   ✓ signIn OK")
    }

    // Cleanup
    await admin.auth.admin.deleteUser(createData.user.id)
    console.log("\n   (test user deleted)")
  }

  console.log("\n--- Summary ---")
  if (listErr && listErr.message?.includes("Database error")) {
    console.log("Auth API has database issues. Create a NEW Supabase project and migrate.")
  } else if (createErr && createErr.message?.includes("Database error")) {
    console.log("createUser fails — project auth schema may be corrupted. Try new project.")
  } else if (!createErr && typeof signErr !== "undefined" && signErr?.message?.includes("Database error")) {
    console.log("Login fails on API-created user — rare. Check Supabase Dashboard → Logs.")
  } else if (!createErr && !signErr) {
    console.log("Auth API works. Use: npm run db:seed:reset to recreate test users.")
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
