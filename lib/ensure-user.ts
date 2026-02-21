import { createAdminClient } from "@/lib/supabase/admin"
import type { User } from "@supabase/supabase-js"

export const DEFAULT_SCHOOL_ID = "a0000000-0000-0000-0000-000000000001"
export const DEFAULT_CLASS_ID = "b0000000-0000-0000-0000-000000000001"

export async function ensureDefaultSchool() {
  const admin = createAdminClient()
  await admin.from("schools").upsert(
    {
      id: DEFAULT_SCHOOL_ID,
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
  await admin.from("classes").upsert(
    {
      id: DEFAULT_CLASS_ID,
      school_id: DEFAULT_SCHOOL_ID,
      grade: 7,
      division: "A",
      academic_year: "2024-25",
    },
    { onConflict: "id" }
  )
  return admin
}

export async function ensureUserRow(
  user: User,
  role: "headmaster" | "teacher" | "clerk" | "student" | "parent",
  schoolId: string | null
) {
  const admin = await ensureDefaultSchool()
  const { data } = await admin
    .from("users")
    .upsert(
      {
        auth_id: user.id,
        school_id: schoolId,
        role,
        name: user.user_metadata?.name ?? user.email ?? role,
        email: user.email ?? "",
      },
      { onConflict: "auth_id" }
    )
    .select("id")
    .single()
  return { admin, userId: data?.id }
}

export async function ensureStudentRow(user: User) {
  const { admin, userId } = await ensureUserRow(user, "student", DEFAULT_SCHOOL_ID)
  if (!userId) return null
  const { data: existing } = await admin
    .from("students")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle()
  if (existing) return existing.id
  const { data: student } = await admin
    .from("students")
    .insert({
      school_id: DEFAULT_SCHOOL_ID,
      class_id: DEFAULT_CLASS_ID,
      name: user.user_metadata?.name ?? user.email ?? "विद्यार्थी",
      user_id: userId,
    })
    .select("id")
    .single()
  return student?.id ?? null
}
