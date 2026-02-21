"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { DEFAULT_SCHOOL_ID, ensureUserRow } from "@/lib/ensure-user"

export async function getHeadmasterSchoolId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H3',location:'app/actions/users.ts:10',message:'getHeadmasterSchoolId session resolved',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "headmaster")
    .single()
  let schoolId = data?.school_id ?? null
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
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-1',hypothesisId:'H3',location:'app/actions/users.ts:35',message:'getHeadmasterSchoolId final result',data:{initialHasSchoolId:!!data?.school_id,finalHasSchoolId:!!schoolId,finalSchoolIdIsDefault:schoolId===DEFAULT_SCHOOL_ID},timestamp:Date.now()})}).catch(()=>{})
  // #endregion

  return schoolId
}

export async function getClerkSchoolId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-4',hypothesisId:'H11',location:'app/actions/users.ts:getClerkSchoolId',message:'clerk school lookup session status',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "clerk")
    .single()

  let schoolId = data?.school_id ?? null
  if (!schoolId && user.user_metadata?.role === "clerk") {
    try {
      await ensureUserRow(user, "clerk", DEFAULT_SCHOOL_ID)
      const { data: refetched } = await supabase
        .from("users")
        .select("school_id")
        .eq("auth_id", user.id)
        .eq("role", "clerk")
        .single()
      schoolId = refetched?.school_id ?? DEFAULT_SCHOOL_ID
    } catch {
      // Keep null when auto-link fails
    }
  }
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-3',hypothesisId:'H11',location:'app/actions/users.ts:getClerkSchoolId',message:'clerk school lookup final result',data:{initialHasSchoolId:!!data?.school_id,finalHasSchoolId:!!schoolId,finalSchoolIdIsDefault:schoolId===DEFAULT_SCHOOL_ID},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  return schoolId
}

export async function getSchoolIdForStaff(): Promise<string | null> {
  const headmaster = await getHeadmasterSchoolId()
  if (headmaster) return headmaster
  return getClerkSchoolId()
}

export async function getSchoolClasses(schoolId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("classes")
    .select("id, grade, division, academic_year")
    .eq("school_id", schoolId)
    .order("grade")
    .order("division")

  if (error) return []
  return data || []
}

export async function getSchoolStudents(schoolId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("students")
    .select("id, name, roll_number, class_id")
    .eq("school_id", schoolId)

  if (error) return []
  return data || []
}

export async function getSchoolTeachers(schoolId: string) {
  const admin = createAdminClient()
  const { data, error } = await admin
    .from("users")
    .select("id, name, email, phone, is_active")
    .eq("school_id", schoolId)
    .eq("role", "teacher")
    .order("name")

  if (error) return []
  return data || []
}

export async function getSchoolStudentsWithClass(schoolId: string) {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from("students")
    .select("id, name, roll_number, class_id, classes(grade, division)")
    .eq("school_id", schoolId)
    .order("name")

  if (error) return []
  return data || []
}

export async function addClass(
  schoolId: string,
  grade: number,
  division: string,
  academicYear: string
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from("classes").insert({
    school_id: schoolId,
    grade,
    division: division.toUpperCase(),
    academic_year: academicYear,
  })
  return { success: !error, error: error?.message }
}
