"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensureStudentRow } from "@/lib/ensure-user"

export interface StudentDashboardData {
  name: string
  classLabel: string
  attendancePct: number
  marks: Array<{ examName: string; subject: string; marks: number; maxMarks: number }>
  homework: Array<{ subject: string; description: string; dueDate: string }>
  timetable: Array<{ day: string; time: string; subject: string }>
}

export async function getStudentDashboard(): Promise<StudentDashboardData | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return null

  let { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "student")
    .single()

  if (!userData && user.user_metadata?.role === "student") {
    try {
      await ensureStudentRow(user)
      const { data: refetched } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", user.id)
        .eq("role", "student")
        .single()
      userData = refetched
    } catch {
      // No admin key or insert failed
    }
  }
  if (!userData) {
    const admin = createAdminClient()
    const { data: adminUserData } = await admin
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .eq("role", "student")
      .single()
    userData = adminUserData ?? null
  }

  if (!userData) return null

  const admin = createAdminClient()

  const { data: student } = await admin
    .from("students")
    .select("id, name, class_id, classes(grade, division)")
    .eq("user_id", userData.id)
    .single()

  if (!student?.class_id) return null

  const cls = Array.isArray(student.classes) ? student.classes[0] : student.classes
  const classLabel = cls && typeof cls === "object" && "grade" in cls
    ? `इ.${(cls as { grade: number; division: string }).grade}वी ${(cls as { grade: number; division: string }).division}`
    : "—"

  const today = new Date().toISOString().split("T")[0]
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]

  const { data: att } = await admin
    .from("attendance")
    .select("status")
    .eq("student_id", student.id)
    .gte("date", startDate)
    .lte("date", today)

  const totalDays = (att || []).length || 1
  const presentDays = (att || []).filter((a) => a.status === "present" || a.status === "late").length
  const attendancePct = Math.round((presentDays / totalDays) * 100)

  const { data: marksData } = await admin
    .from("marks")
    .select("exam_id, marks_obtained")
    .eq("student_id", student.id)

  const examIds = Array.from(new Set((marksData || []).map((m) => m.exam_id)))
  const marks: StudentDashboardData["marks"] = []

  if (examIds.length > 0) {
    const { data: exams } = await admin
      .from("exams")
      .select("id, exam_name, subject, max_marks")
      .in("id", examIds)

    for (const m of marksData || []) {
      const exam = (exams || []).find((e) => e.id === m.exam_id)
      if (exam) {
        marks.push({
          examName: exam.exam_name,
          subject: exam.subject,
          marks: Number(m.marks_obtained),
          maxMarks: Number(exam.max_marks),
        })
      }
    }
  }

  const { data: homeworkData } = await admin
    .from("homework")
    .select("subject, description, due_date")
    .eq("class_id", student.class_id)
    .gte("due_date", today)
    .order("due_date")
    .limit(5)

  const homework: StudentDashboardData["homework"] = (homeworkData || []).map((h) => ({
    subject: h.subject,
    description: h.description,
    dueDate: String(h.due_date).slice(0, 10),
  }))

  const dayNames = ["सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार"]
  const timetable: StudentDashboardData["timetable"] = dayNames.flatMap((day, i) =>
    ["गणित", "मराठी", "इंग्रजी", "विज्ञान", "सामाजिक"].map((subj, j) => ({
      day,
      time: `${9 + j}:00`,
      subject: subj,
    }))
  ).slice(0, 10)

  return {
    name: student.name,
    classLabel,
    attendancePct,
    marks,
    homework,
    timetable,
  }
}
