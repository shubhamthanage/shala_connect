"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendWhatsApp } from "@/lib/whatsapp"

export interface FeeOverviewData {
  schoolId?: string
  totalCollected: number
  totalPending: number
  classWiseStatus: Array<{
    grade: number
    division: string
    totalStudents: number
    collected: number
    pending: number
    pendingCount: number
  }>
  defaulters: Array<{
    id: string
    name: string
    rollNumber: string | null
    classLabel: string
    pendingAmount: number
    parentPhone: string | null
  }>
}

export async function getFeeOverview(): Promise<FeeOverviewData | null> {
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

  const schoolId = userData?.school_id
  if (!schoolId) return null

  const admin = createAdminClient()

  const { data: students } = await admin
    .from("students")
    .select("id, name, roll_number, class_id")
    .eq("school_id", schoolId)

  const studentIds = (students || []).map((s) => s.id)
  let totalCollected = 0
  if (studentIds.length > 0) {
    const { data: payments } = await admin
      .from("fee_payments")
      .select("amount_paid")
      .in("student_id", studentIds)
    totalCollected = (payments || []).reduce((sum, p) => sum + Number(p.amount_paid), 0)
  }

  const { data: classes } = await admin
    .from("classes")
    .select("id, grade, division")
    .eq("school_id", schoolId)
    .order("grade")
    .order("division")

  const classWiseStatus: FeeOverviewData["classWiseStatus"] = []
  const defaulters: FeeOverviewData["defaulters"] = []

  const annualFeePerStudent = 4500

  for (const c of classes || []) {
    const { data: classStudents } = await admin
      .from("students")
      .select("id, name, roll_number")
      .eq("class_id", c.id)

    const totalStudents = classStudents?.length ?? 0
    let classCollected = 0
    let classPendingCount = 0

    for (const s of classStudents || []) {
      const { data: studentPayments } = await admin
        .from("fee_payments")
        .select("amount_paid")
        .eq("student_id", s.id)

      const paid = (studentPayments || []).reduce((sum, p) => sum + Number(p.amount_paid), 0)
      classCollected += paid

      const pending = annualFeePerStudent - paid
      if (pending > 0) {
        classPendingCount++
        const { data: parent } = await admin
          .from("parents")
          .select("phone, whatsapp_number")
          .eq("student_id", s.id)
          .limit(1)
          .single()

        defaulters.push({
          id: s.id,
          name: s.name,
          rollNumber: s.roll_number,
          classLabel: `इ.${c.grade}वी ${c.division}`,
          pendingAmount: pending,
          parentPhone: parent?.whatsapp_number || parent?.phone || null,
        })
      }
    }

    const totalExpected = totalStudents * annualFeePerStudent
    const classPending = totalExpected - classCollected

    classWiseStatus.push({
      grade: c.grade,
      division: c.division,
      totalStudents,
      collected: classCollected,
      pending: classPending,
      pendingCount: classPendingCount,
    })
  }

  const totalPending = classWiseStatus.reduce((s, r) => s + r.pending, 0)

  return {
    schoolId,
    totalCollected,
    totalPending,
    classWiseStatus,
    defaulters: defaulters.sort((a, b) => b.pendingAmount - a.pendingAmount),
  }
}

export async function sendFeeReminder(studentId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return { success: false, error: "Unauthorized" }

  const admin = createAdminClient()
  const { data: student } = await admin
    .from("students")
    .select("id, name, school_id")
    .eq("id", studentId)
    .single()

  if (!student) return { success: false, error: "विद्यार्थी आढळला नाही" }

  const { data: parent } = await admin
    .from("parents")
    .select("phone, whatsapp_number, name")
    .eq("student_id", studentId)
    .limit(1)
    .single()

  const phone = parent?.whatsapp_number || parent?.phone
  if (!phone) return { success: false, error: "पालकाचा फोन नंबर उपलब्ध नाही" }

  const { data: school } = await admin.from("schools").select("name").eq("id", student.school_id).single()

  const result = await sendWhatsApp(
    phone,
    "FEE_REMINDER",
    {
      school_name: school?.name || "शाळा",
      parent_name: parent?.name || "पालक",
      student_name: student.name,
      fee_type: "वार्षिक शुल्क",
      amount: 4500,
      due_date: "31-03-2025",
      payment_link: process.env.NEXT_PUBLIC_APP_URL || "https://shalaconnect.in/fees",
    },
    { schoolId: student.school_id }
  )
  return result.success ? { success: true } : { success: false, error: result.error }
}

export async function sendBulkFeeReminders(): Promise<{ success: boolean; sent?: number; error?: string }> {
  const overview = await getFeeOverview()
  if (!overview?.schoolId) return { success: false, error: "डेटा उपलब्ध नाही" }

  const { data: school } = await createAdminClient()
    .from("schools")
    .select("name")
    .eq("id", overview.schoolId)
    .single()

  let sent = 0
  for (const d of overview.defaulters) {
    if (!d.parentPhone) continue
    const { data: parent } = await createAdminClient()
      .from("parents")
      .select("name")
      .eq("student_id", d.id)
      .limit(1)
      .single()
    const result = await sendWhatsApp(
      d.parentPhone,
      "FEE_REMINDER",
      {
        school_name: school?.name || "शाळा",
        parent_name: parent?.name || "पालक",
        student_name: d.name,
        fee_type: "वार्षिक शुल्क",
        amount: d.pendingAmount,
        due_date: "31-03-2025",
        payment_link: process.env.NEXT_PUBLIC_APP_URL || "https://shalaconnect.in/fees",
      },
      { schoolId: overview.schoolId }
    )
    if (result.success) sent++
  }
  return { success: true, sent }
}
