"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function getHeadmasterSchoolId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "headmaster")
    .single()

  return data?.school_id ?? null
}

export async function getClerkSchoolId(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "clerk")
    .single()

  return data?.school_id ?? null
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
