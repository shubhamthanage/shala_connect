"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { DEFAULT_SCHOOL_ID, ensureUserRow } from "@/lib/ensure-user"

export async function getHeadmasterSchool() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return null

  const { data: userData } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "headmaster")
    .single()

  let schoolId = userData?.school_id ?? null
  if (!schoolId && user.user_metadata?.role === "headmaster") {
    try {
      await ensureUserRow(user, "headmaster", DEFAULT_SCHOOL_ID)
      const { data: refetched } = await supabase
        .from("users")
        .select("school_id")
        .eq("auth_id", user.id)
        .eq("role", "headmaster")
        .single()
      schoolId = refetched?.school_id ?? DEFAULT_SCHOOL_ID
    } catch {
      // Keep null when auto-link fails
    }
  }
  if (!schoolId) return null

  const admin = createAdminClient()
  const { data: school } = await admin
    .from("schools")
    .select("*")
    .eq("id", schoolId)
    .single()

  return school
}

export async function getSchoolNotifications(schoolId: string, limit = 10) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("notifications")
    .select("id, template, recipient_phone, status, created_at")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return data || []
}
