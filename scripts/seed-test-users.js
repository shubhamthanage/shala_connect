#!/usr/bin/env node
/**
 * Seed test users via Supabase Admin API (correct password format).
 * Run: npm run db:seed:users              # create if missing
 * Run: npm run db:seed:users -- --fix    # fix password for existing users (Test@1234)
 * Run: npm run db:seed:users -- --reset  # delete & recreate
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Load .env.local
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

const SCHOOL_ID = "a0000000-0000-0000-0000-000000000001"
const PASSWORD = "Test@1234"

const TEST_USERS = [
  { email: "headmaster@shalaconnect.test", role: "headmaster", name: "मुख्याध्यापक टेस्ट", schoolId: SCHOOL_ID },
  { email: "teacher@shalaconnect.test", role: "teacher", name: "शिक्षक टेस्ट", schoolId: SCHOOL_ID },
  { email: "clerk@shalaconnect.test", role: "clerk", name: "कारकून टेस्ट", schoolId: SCHOOL_ID },
  { email: "student@shalaconnect.test", role: "student", name: "विद्यार्थी टेस्ट", schoolId: SCHOOL_ID },
  { email: "parent@shalaconnect.test", role: "parent", name: "पालक टेस्ट", schoolId: null },
]

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    console.error("❌ Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local")
    process.exit(1)
  }

  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  console.log("Seeding school, class, and test users...\n")

  // Ensure school and class exist
  await supabase.from("schools").upsert(
    {
      id: SCHOOL_ID,
      name: "पुणे विद्यामंदिर",
      district: "Pune",
      taluka: "Pune City",
      udise_code: "27123456789",
      type: "combined",
      address: "शिवाजीनगर, पुणे",
      phone: "02012345678",
      email: "contact@punevidyamandir.edu.in",
    },
    { onConflict: "id" }
  )
  await supabase.from("classes").upsert(
    {
      id: "b0000000-0000-0000-0000-000000000001",
      school_id: SCHOOL_ID,
      grade: 7,
      division: "A",
      academic_year: "2024-25",
    },
    { onConflict: "id" }
  )
  console.log("  ✓ School and class ready\n")

  const reset = process.argv.includes("--reset")
  const fix = process.argv.includes("--fix")

  if (fix) {
    console.log("Fixing passwords for existing users...\n")
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      console.error("  ❌ DATABASE_URL required for --fix.")
      console.error("     Add to .env.local: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres")
      console.error("     Get from: Supabase Dashboard → Project Settings → Database → Connection string (URI)")
      console.error("     Or: With dev server running, visit http://localhost:3000/api/admin/fix-test-passwords")
      return
    }
    const { Client } = require("pg")
    const pg = new Client({ connectionString: dbUrl })
    await pg.connect()
    const { rows } = await pg.query(
      "SELECT id, email FROM auth.users WHERE email LIKE '%@shalaconnect.test'"
    )
    await pg.end()
    if (rows.length === 0) {
      console.log("  No @shalaconnect.test users in auth. Run: npm run db:seed:users (creates new users)")
      return
    }
    for (const u of rows) {
      const { error } = await supabase.auth.admin.updateUserById(u.id, { password: PASSWORD })
      if (error) console.error(`  ❌ ${u.email}: ${error.message}`)
      else console.log(`  ✓ ${u.email} (password reset)`)
    }
    console.log("\n✓ Done. Login at http://localhost:3000/login")
    return
  }

  if (reset) {
    console.log("Resetting test users...\n")
    const dbUrl = process.env.DATABASE_URL
    if (dbUrl) {
      // Delete via SQL (works even when Admin API listUsers fails on corrupted users)
      try {
        const { Client } = require("pg")
        const pg = new Client({ connectionString: dbUrl })
        await pg.connect()
        await pg.query("DELETE FROM auth.identities WHERE provider = 'email' AND user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@shalaconnect.test')")
        const del = await pg.query("DELETE FROM auth.users WHERE email LIKE '%@shalaconnect.test' RETURNING email")
        await pg.query("DELETE FROM public.users WHERE email LIKE '%@shalaconnect.test'")
        await pg.end()
        del.rows?.forEach((r) => console.log(`  🗑 Deleted ${r.email}`))
      } catch (e) {
        console.warn("  ⚠ SQL delete failed, trying Admin API:", e.message)
        const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 100 })
        const toDelete = listData?.users?.filter((x) => x.email?.endsWith("@shalaconnect.test")) ?? []
        for (const u of toDelete) {
          await supabase.auth.admin.deleteUser(u.id)
          console.log(`  🗑 Deleted ${u.email}`)
        }
      }
    } else {
      const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 100 })
      const toDelete = listData?.users?.filter((x) => x.email?.endsWith("@shalaconnect.test")) ?? []
      for (const u of toDelete) {
        await supabase.auth.admin.deleteUser(u.id)
        console.log(`  🗑 Deleted ${u.email}`)
      }
    }
    console.log("")
  }

  console.log("Creating users (password: Test@1234)...\n")

  for (const u of TEST_USERS) {
    if (!reset) {
      const { data: existing } = await supabase.from("users").select("id").eq("email", u.email).maybeSingle()
      if (existing) {
        console.log(`  ⏭ ${u.email} (already exists)`)
        continue
      }
    }

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      email: u.email,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { name: u.name, role: u.role },
    })

    if (authErr) {
      if (authErr.message?.includes("already been registered") || authErr.message?.includes("already exists")) {
        const { data: listData } = await supabase.auth.admin.listUsers({ perPage: 50 })
        const authUser = listData?.users?.find((x) => x.email === u.email)
        if (authUser) {
          const { error: userErr } = await supabase.from("users").insert({
            auth_id: authUser.id,
            school_id: u.schoolId,
            role: u.role,
            name: u.name,
            email: u.email,
          })
          if (userErr) console.error(`  ❌ ${u.email}: ${userErr.message}`)
          else console.log(`  ✓ ${u.email} (linked)`)
        } else {
          console.error(`  ❌ ${u.email}: auth user not found`)
        }
      } else {
        console.error(`  ❌ ${u.email}: ${authErr.message}`)
      }
      continue
    }

    const { error: userErr } = await supabase.from("users").insert({
      auth_id: authData.user.id,
      school_id: u.schoolId,
      role: u.role,
      name: u.name,
      email: u.email,
    })

    if (userErr) {
      console.error(`  ❌ ${u.email}: ${userErr.message}`)
    } else {
      console.log(`  ✓ ${u.email}`)
    }
  }

  console.log("\n✓ Done. Login at http://localhost:3000/login")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
