"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensureUserRow } from "@/lib/ensure-user"

export interface ParentDashboardData {
  children: Array<{
    id: string
    name: string
    classLabel: string
    attendancePct: number
    avgMarks: number
    feePending: number
  }>
}

export async function getParentDashboard(): Promise<ParentDashboardData | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return null

  let { data: parentUser } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "parent")
    .single()

  if (!parentUser && user.user_metadata?.role === "parent") {
    try {
      await ensureUserRow(user, "parent", null)
      const { data: refetched } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .eq("role", "parent")
        .single()
      parentUser = refetched
    } catch {
      // No admin key or insert failed
    }
  }
  if (!parentUser && user.user_metadata?.role === "parent") {
    try {
      const admin = createAdminClient()
      const { data: adminUser } = await admin
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .eq("role", "parent")
        .maybeSingle()
      if (adminUser) parentUser = adminUser
    } catch {
      // Ignore admin fallback failure
    }
  }

  if (!parentUser) return null

  const admin = createAdminClient()

  const { data: parentRecords } = await admin
    .from("parents")
    .select("student_id")
    .eq("user_id", parentUser.id)

  const studentIds = (parentRecords || []).map((p) => p.student_id)
  if (studentIds.length === 0) {
    return { children: [] }
  }

  const { data: students } = await admin
    .from("students")
    .select("id, name, class_id, classes(grade, division)")
    .in("id", studentIds)

  const today = new Date().toISOString().split("T")[0]
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]

  const children: ParentDashboardData["children"] = []

  for (const s of students || []) {
    const cls = Array.isArray(s.classes) ? s.classes[0] : s.classes
    const classLabel = cls && typeof cls === "object" && "grade" in cls
      ? `इ.${(cls as { grade: number; division: string }).grade}वी ${(cls as { grade: number; division: string }).division}`
      : "—"

    const { data: att } = await admin
      .from("attendance")
      .select("status")
      .eq("student_id", s.id)
      .gte("date", startDate)
      .lte("date", today)

    const totalDays = (att || []).length || 1
    const presentDays = (att || []).filter((a) => a.status === "present" || a.status === "late").length
    const attendancePct = Math.round((presentDays / totalDays) * 100)

    const { data: exams } = await admin
      .from("exams")
      .select("id")
      .eq("class_id", s.class_id)
      .limit(5)
    const examIds = (exams || []).map((e) => e.id)

    let avgMarks = 0
    if (examIds.length > 0) {
      const { data: marksData } = await admin
        .from("marks")
        .select("marks_obtained")
        .eq("student_id", s.id)
        .in("exam_id", examIds)
      const marks = (marksData || []).map((m) => Number(m.marks_obtained))
      if (marks.length > 0) {
        avgMarks = Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 10) / 10
      }
    }

    const { data: feeStructs } = await admin
      .from("fee_structures")
      .select("id, amount")
      .eq("class_id", s.class_id)
      .eq("academic_year", "2024-25")

    const totalDue = (feeStructs || []).reduce((sum, f) => sum + Number(f.amount), 0)
    const { data: payments } = await admin
      .from("fee_payments")
      .select("amount_paid")
      .eq("student_id", s.id)
    const totalPaid = (payments || []).reduce((sum, p) => sum + Number(p.amount_paid), 0)
    const feePending = Math.max(0, totalDue - totalPaid)

    children.push({
      id: s.id,
      name: s.name,
      classLabel,
      attendancePct,
      avgMarks,
      feePending,
    })
  }

  return { children }
}
