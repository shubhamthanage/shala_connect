"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensureUserRow } from "@/lib/ensure-user"
import { DEFAULT_SCHOOL_ID } from "@/lib/ensure-user"

export interface AttendanceStudent {
  id: string
  name: string
  rollNumber: string | null
  status: "present" | "absent" | "late"
}

export async function getTeacherAttendanceData(): Promise<{
  classId: string | null
  classLabel: string
  students: AttendanceStudent[]
  today: string
} | null> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-6',hypothesisId:'H15',location:'app/actions/attendance.ts:getTeacherAttendanceData',message:'attendance session status',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  if (!user) return null

  let { data: userData } = await supabase
    .from("users")
    .select("id, school_id")
    .eq("auth_id", user.id)
    .eq("role", "teacher")
    .single()

  if (!userData && user.user_metadata?.role === "teacher") {
    try {
      await ensureUserRow(user, "teacher", DEFAULT_SCHOOL_ID)
      const { data: refetched } = await supabase
        .from("users")
        .select("id, school_id")
        .eq("auth_id", user.id)
        .eq("role", "teacher")
        .single()
      userData = refetched
    } catch {
      // keep null if fallback fails
    }
  }
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-5',hypothesisId:'H15',location:'app/actions/attendance.ts:getTeacherAttendanceData',message:'attendance teacher user status',data:{hasUserData:!!userData,hasSchoolId:!!userData?.school_id,schoolIdIsDefault:userData?.school_id===DEFAULT_SCHOOL_ID},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  if (!userData?.school_id) return null

  const admin = createAdminClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: teacherClass } = await admin
    .from("classes")
    .select("id, grade, division")
    .eq("class_teacher_id", userData.id)
    .limit(1)
    .single()

  const classId = teacherClass?.id ?? null
  const classLabel = teacherClass
    ? `इ.${teacherClass.grade}वी ${teacherClass.division}`
    : "वर्ग निवडा"

  if (!classId) {
    return { classId: null, classLabel, students: [], today }
  }

  const { data: classStudents } = await admin
    .from("students")
    .select("id, name, roll_number")
    .eq("class_id", classId)
    .order("roll_number")

  const { data: todayAtt } = await admin
    .from("attendance")
    .select("student_id, status")
    .eq("class_id", classId)
    .eq("date", today)

  const students: AttendanceStudent[] = (classStudents || []).map((s) => {
    const rec = (todayAtt || []).find((a) => a.student_id === s.id)
    const status = (rec?.status as "present" | "absent" | "late") ?? "present"
    return {
      id: s.id,
      name: s.name,
      rollNumber: s.roll_number,
      status,
    }
  })

  return { classId, classLabel, students, today }
}

export async function saveAttendance(
  classId: string,
  date: string,
  records: { studentId: string; status: "present" | "absent" | "late" }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return { success: false, error: "लॉगिन करा" }

  const { data: userData } = await supabase
    .from("users")
    .select("id")
    .eq("auth_id", user.id)
    .eq("role", "teacher")
    .single()

  if (!userData) return { success: false, error: "शिक्षक आढळला नाही" }

  const admin = createAdminClient()
  const markedBy = userData.id

  for (const r of records) {
    const { error } = await admin
      .from("attendance")
      .upsert(
        {
          student_id: r.studentId,
          class_id: classId,
          date,
          status: r.status,
          marked_by: markedBy,
        },
        { onConflict: "student_id,date" }
      )

    if (error) return { success: false, error: error.message }
  }

  return { success: true }
}
