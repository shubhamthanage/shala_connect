#!/bin/bash
# Reset test users and recreate via Admin API (bypasses SQL token column issues)
# Run: ./scripts/seed-via-admin-api.sh
# Or: npm run db:seed:users -- --reset

set -e
echo "Resetting and recreating test users via Supabase Admin API..."
node scripts/seed-test-users.js --reset
echo ""
echo "Done. Try logging in at http://localhost:3000/login"
