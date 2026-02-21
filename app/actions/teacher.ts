"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { DEFAULT_SCHOOL_ID, ensureUserRow } from "@/lib/ensure-user"

export interface TeacherDashboardData {
  teacherName: string
  schoolName: string
  primaryClass: { id: string; grade: number; division: string } | null
  kpis: {
    attendanceToday: { present: number; absent: number; total: number }
    homeworkPending: number
    avgMarks: number
    unreadParentMessages: number
  }
  attendanceStudents: Array<{
    id: string
    name: string
    rollNumber: string | null
    attendancePct: number
    status: "present" | "late" | "absent"
  }>
  upcomingEvents: Array<{
    day: number
    month: string
    title: string
    subtitle: string
  }>
  activities: Array<{
    icon: string
    iconBg: string
    title: string
    time: string
  }>
}

export async function getTeacherDashboard(): Promise<TeacherDashboardData | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-2',hypothesisId:'H7',location:'app/actions/teacher.ts:42',message:'getTeacherDashboard session resolved',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  if (!user) return null

  let { data: userData } = await supabase
    .from("users")
    .select("id, name, school_id")
    .eq("auth_id", user.id)
    .eq("role", "teacher")
    .single()

  if (!userData?.school_id && user.user_metadata?.role === "teacher") {
    try {
      await ensureUserRow(user, "teacher", DEFAULT_SCHOOL_ID)
      const { data: refetched } = await supabase
        .from("users")
        .select("id, name, school_id")
        .eq("auth_id", user.id)
        .eq("role", "teacher")
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
      .select("id, name, school_id")
      .eq("auth_id", user.id)
      .eq("role", "teacher")
      .single()
    userData = adminUserData ?? null
  }
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-2',hypothesisId:'H7',location:'app/actions/teacher.ts:67',message:'getTeacherDashboard userData status',data:{hasUserData:!!userData,hasSchoolId:!!userData?.school_id},timestamp:Date.now()})}).catch(()=>{})
  // #endregion

  if (!userData?.school_id) {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-2',hypothesisId:'H7',location:'app/actions/teacher.ts:71',message:'getTeacherDashboard returning null due to missing school_id',data:{},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    return null
  }

  const admin = createAdminClient()
  const teacherId = userData.id

  // School name
  const { data: school } = await admin
    .from("schools")
    .select("name")
    .eq("id", userData.school_id)
    .single()

  // Teacher's primary class (first class where they're class teacher)
  const { data: teacherClasses } = await admin
    .from("classes")
    .select("id, grade, division")
    .eq("class_teacher_id", teacherId)
    .order("grade")
    .order("division")
    .limit(1)

  const primaryClass = teacherClasses?.[0] ?? null

  const today = new Date().toISOString().split("T")[0]

  // KPI: Today's attendance (for primary class or first class in school)
  let attendanceToday = { present: 0, absent: 0, total: 0 }
  let attendanceStudents: TeacherDashboardData["attendanceStudents"] = []

  const classId = primaryClass?.id
  if (classId) {
    const { data: classStudents } = await admin
      .from("students")
      .select("id, name, roll_number")
      .eq("class_id", classId)
      .order("roll_number")

    const totalStudents = classStudents?.length ?? 0

    if (totalStudents > 0) {
      const { data: todayAtt } = await admin
        .from("attendance")
        .select("student_id, status")
        .eq("class_id", classId)
        .eq("date", today)

      const presentCount = (todayAtt || []).filter((a) => a.status === "present").length
      const lateCount = (todayAtt || []).filter((a) => a.status === "late").length
      const absentCount = (todayAtt || []).filter((a) => a.status === "absent").length

      attendanceToday = {
        present: presentCount + lateCount,
        absent: absentCount,
        total: totalStudents,
      }

      // Build attendance list with % (last 30 days for pct)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const startDate = thirtyDaysAgo.toISOString().split("T")[0]

      for (const s of classStudents || []) {
        const { data: histAtt } = await admin
          .from("attendance")
          .select("status")
          .eq("student_id", s.id)
          .gte("date", startDate)
          .lte("date", today)

        const totalDays = (histAtt || []).length || 1
        const presentDays = (histAtt || []).filter((a) => a.status === "present" || a.status === "late").length
        const pct = Math.round((presentDays / totalDays) * 100)

        const todayRecord = (todayAtt || []).find((a) => a.student_id === s.id)
        const status = (todayRecord?.status as "present" | "late" | "absent") ?? "absent"

        let statusLabel = "हजर"
        if (pct < 70) statusLabel = "कमी"
        else if (pct < 85) statusLabel = "लक्ष द्या"

        attendanceStudents.push({
          id: s.id,
          name: s.name,
          rollNumber: s.roll_number,
          attendancePct: pct,
          status: status === "present" || status === "late" ? "present" : "absent",
        })
      }

      // Sort by roll number
      attendanceStudents.sort((a, b) =>
        String(a.rollNumber || "").localeCompare(String(b.rollNumber || ""))
      )
    }
  }

  // If no students from DB, use demo data for attendance
  if (attendanceStudents.length === 0) {
    attendanceStudents = [
      { id: "1", name: "रमेश पाटील", rollNumber: "01", attendancePct: 95, status: "present" },
      { id: "2", name: "सीता जाधव", rollNumber: "02", attendancePct: 72, status: "present" },
      { id: "3", name: "अमित शिंदे", rollNumber: "03", attendancePct: 62, status: "absent" },
      { id: "4", name: "प्रिया कुलकर्णी", rollNumber: "04", attendancePct: 100, status: "present" },
    ]
    attendanceToday = { present: 37, absent: 5, total: 42 }
  }

  // KPI: Homework pending (due in next 7 days, not yet "done" - we don't have submission table, so count assigned)
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 7)
  const { count: homeworkPending } = await admin
    .from("homework")
    .select("id", { count: "exact", head: true })
    .eq("teacher_id", teacherId)
    .lte("due_date", nextWeek.toISOString().split("T")[0])
    .gte("due_date", today)

  // KPI: Avg marks (from marks for teacher's classes)
  let avgMarks = 72.4
  if (classId) {
    const { data: exams } = await admin
      .from("exams")
      .select("id")
      .eq("class_id", classId)
      .limit(5)
    const examIds = (exams || []).map((e) => e.id)
    if (examIds.length > 0) {
      const { data: marksData } = await admin
        .from("marks")
        .select("marks_obtained")
        .in("exam_id", examIds)
      const marks = (marksData || []).map((m) => Number(m.marks_obtained))
      if (marks.length > 0) {
        avgMarks = Math.round((marks.reduce((a, b) => a + b, 0) / marks.length) * 10) / 10
      }
    }
  }

  // KPI: Unread parent messages (notifications targeting teacher, status pending)
  const { count: unreadMessages } = await admin
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("school_id", userData.school_id)
    .eq("target_user_id", teacherId)
    .eq("status", "pending")

  // Upcoming events (exams, parent meetings - demo + real)
  let upcomingExams: { exam_name: string; subject: string; date: string }[] = []
  if (classId) {
    const { data } = await admin
      .from("exams")
      .select("exam_name, subject, date")
      .eq("class_id", classId)
      .gte("date", today)
      .order("date")
      .limit(3)
    upcomingExams = data || []
  }

  const upcomingEvents: TeacherDashboardData["upcomingEvents"] = (
    upcomingExams || []
  ).map((e) => ({
    day: new Date(e.date).getDate(),
    month: ["जाने", "फेब्रु", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑग", "सप्ट", "ऑक्ट", "नोव्ह", "डिसें"][
      new Date(e.date).getMonth()
    ],
    title: `${e.exam_name} — इ.${primaryClass?.grade || 7}वी ${primaryClass?.division || "अ"}`,
    subtitle: `${e.subject} · सकाळी ११:००`,
  }))

  if (upcomingEvents.length === 0) {
    upcomingEvents.push(
      { day: 21, month: "FEB", title: "गणित टेस्ट — इ.७वी अ", subtitle: "सकाळी ११:०० · वर्ग ७अ" },
      { day: 25, month: "FEB", title: "पालक-शिक्षक भेट", subtitle: "दुपारी ४:०० · ३ भेटी बुक" },
      { day: 15, month: "MAR", title: "वार्षिक परीक्षा सुरू", subtitle: "वेळापत्रक पाठवा" }
    )
  }

  // Activities (demo for now - could add from audit/activity table later)
  const activities: TeacherDashboardData["activities"] = [
    { icon: "📋", iconBg: "#FFF3E8", title: `इ.${primaryClass?.grade || 7}वी ${primaryClass?.division || "अ"} हजेरी घेतली`, time: "आज · सकाळी ७:५५" },
    { icon: "💬", iconBg: "#F0FDF4", title: "रमेश पाटीलच्या आईस WhatsApp", time: "काल · दुपारी ३:२०" },
    { icon: "📊", iconBg: "#F0F8FF", title: "अर्धवार्षिक गुण प्रविष्ट केले", time: "२ दिवसांपूर्वी" },
    { icon: "📝", iconBg: "#F5F0FF", title: "गणित गृहपाठ दिला — अध्याय ४", time: "३ दिवसांपूर्वी" },
  ]

  return {
    teacherName: userData.name || "शिक्षक",
    schoolName: school?.name || "शाळा",
    primaryClass,
    kpis: {
      attendanceToday,
      homeworkPending: homeworkPending ?? 3,
      avgMarks,
      unreadParentMessages: unreadMessages ?? 3,
    },
    attendanceStudents,
    upcomingEvents,
    activities,
  }
}
