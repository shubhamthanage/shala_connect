#!/usr/bin/env node
/**
 * Run Supabase seed (supabase/seed_complete.sql) using DATABASE_URL.
 * Requires: Auth users created first in Supabase Dashboard (see seed_complete.sql header).
 */

const { Client } = require("pg")
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

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set in .env.local")
    console.error("Add: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres")
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })
  const seedPath = path.join(__dirname, "..", "supabase", "seed_complete.sql")

  try {
    await client.connect()
    console.log("✓ Connected to database")
    console.log("Running seed_complete.sql...\n")

    const sql = fs.readFileSync(seedPath, "utf8")
    await client.query(sql)

    console.log("\n✓ Seed complete.")
    console.log("\nVerify: Run the verification query in Supabase SQL Editor (see end of seed_complete.sql)")
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
