"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { DEFAULT_SCHOOL_ID, ensureUserRow } from "@/lib/ensure-user"

export async function getHeadmasterSchool() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-2',hypothesisId:'H6',location:'app/actions/headmaster.ts:10',message:'getHeadmasterSchool session resolved',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-2',hypothesisId:'H6',location:'app/actions/headmaster.ts:33',message:'getHeadmasterSchool school id status',data:{initialHasSchoolId:!!userData?.school_id,finalHasSchoolId:!!schoolId,finalSchoolIdIsDefault:schoolId===DEFAULT_SCHOOL_ID},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
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
