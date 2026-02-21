#!/usr/bin/env node
/**
 * Generates SQL to fix test user passwords (correct bcrypt format for Supabase).
 * Run: node scripts/generate-password-fix-sql.js
 * Then run the output in Supabase SQL Editor.
 */
const bcrypt = require("bcrypt")

const PASSWORD = "Test@1234"
const EMAILS = [
  "headmaster@shalaconnect.test",
  "teacher@shalaconnect.test",
  "clerk@shalaconnect.test",
  "student@shalaconnect.test",
  "parent@shalaconnect.test",
]

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 10)
  console.log("-- Run this in Supabase SQL Editor to fix passwords (Test@1234)")
  console.log("-- Generated bcrypt hash (cost 10, matches GoTrue)")
  console.log("")
  for (const email of EMAILS) {
    console.log(`UPDATE auth.users SET encrypted_password = '${hash}' WHERE email = '${email}';`)
  }
  console.log("")
  console.log("-- Done. Try logging in at http://localhost:3000/login")
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
