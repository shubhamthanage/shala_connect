#!/usr/bin/env node
/**
 * Run Supabase migrations using DATABASE_URL.
 * Add to .env.local: DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
 * Get it from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
 */

const path = require("path")
const fs = require("fs")

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

const { Client } = require("pg")
const MIGRATIONS_DIR = path.join(__dirname, "..", "supabase", "migrations")

const SKIP_ERRORS = [
  "already exists",
  "duplicate key value",
  "42710", // duplicate_object
  "42P07", // duplicate_table
]

function shouldSkip(err) {
  const msg = (err.message || "").toLowerCase()
  const code = err.code || ""
  return SKIP_ERRORS.some((s) => msg.includes(s.toLowerCase()) || code.includes(s))
}

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set.")
    console.error("Add to .env.local:")
    console.error("  DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres")
    console.error("Get it from: Supabase Dashboard → Project Settings → Database → Connection string (URI)")
    process.exit(1)
  }

  const client = new Client({ connectionString: dbUrl })

  try {
    await client.connect()
    console.log("✓ Connected to database\n")

    const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()

    if (files.length === 0) {
      console.log("No migration files found.")
      return
    }

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file)
      const sql = fs.readFileSync(filePath, "utf8")
      process.stdout.write(`Running ${file}... `)
      try {
        await client.query(sql)
        console.log("✓")
      } catch (err) {
        if (shouldSkip(err)) {
          console.log("⏭ (already applied)")
        } else {
          console.error("✗")
          console.error("  Error:", err.message)
          throw err
        }
      }
    }

    console.log("\n✓ Migrations complete.")
  } finally {
    await client.end()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
