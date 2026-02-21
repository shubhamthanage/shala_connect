import { redirect } from "next/navigation"
import { getHeadmasterSchoolId } from "@/app/actions/users"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export default async function AttendancePage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const admin = createAdminClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: classes } = await admin
    .from("classes")
    .select("id, grade, division")
    .eq("school_id", schoolId)
    .order("grade")
    .order("division")

  const classStats: Array<{ grade: number; division: string; total: number; present: number; absent: number; pct: number }> = []

  for (const c of classes || []) {
    const { data: students } = await admin
      .from("students")
      .select("id")
      .eq("class_id", c.id)
    const total = students?.length ?? 0
    const { data: att } = await admin
      .from("attendance")
      .select("student_id, status")
      .eq("class_id", c.id)
      .eq("date", today)
    const present = (att || []).filter((a) => a.status === "present" || a.status === "late").length
    const absent = total - present
    const pct = total > 0 ? Math.round((present / total) * 100) : 0
    classStats.push({
      grade: c.grade,
      division: c.division,
      total,
      present,
      absent,
      pct,
    })
  }

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            📋 हजेरी व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">शाळेची संपूर्ण हजेरी</div>
        </div>
        <a
          href="/dashboard/headmaster/reports"
          className="text-saffron text-sm font-semibold hover:underline font-body"
        >
          अहवाल डाउनलोड →
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">लवकरच उपलब्ध होईल</h3>
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] text-sm max-w-sm mx-auto">संपूर्ण शाळेची हजेरी Analytics येथे दिसेल.</p>
        </div>
        <p className="text-xs text-text-500 font-body mt-4">
          शिक्षक त्यांच्या वर्गाची हजेरी Teacher डॅशबोर्डवरून घेतात.
        </p>
      </div>
    </>
  )
}
