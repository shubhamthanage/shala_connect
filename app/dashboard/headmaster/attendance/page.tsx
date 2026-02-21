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
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📋 हजेरी व्यवस्थापन
        </div>
        <a
          href="/dashboard/headmaster/reports"
          className="text-saffron text-sm font-semibold hover:underline font-body"
        >
          अहवाल डाउनलोड →
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="card-elevated overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
            <span className="font-bold text-text-900 text-sm font-heading">
              आजची हजेरी — {today}
            </span>
          </div>
          {classStats.length === 0 ? (
            <div className="px-5 py-12 text-center text-text-500 text-sm font-body">
              अजून वर्ग नाहीत.{" "}
              <a href="/dashboard/headmaster/classes/add" className="text-saffron hover:underline">
                वर्ग जोडा
              </a>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    वर्ग
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    एकूण
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    हजर
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    गैरहजर
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    हजेरी%
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStats.map((s) => (
                  <tr key={`${s.grade}-${s.division}`} className="hover:bg-saffron-pale/50">
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      इ.{s.grade}वी {s.division}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {s.total}
                    </td>
                    <td className="text-xs text-green-mid px-4 py-2.5 border-b border-border-school font-body">
                      {s.present}
                    </td>
                    <td className="text-xs text-red-500 px-4 py-2.5 border-b border-border-school font-body">
                      {s.absent}
                    </td>
                    <td className="text-xs px-4 py-2.5 border-b border-border-school">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          s.pct >= 90 ? "bg-green-pale text-green-mid" : s.pct >= 75 ? "bg-saffron-pale text-saffron" : "bg-red-50 text-red-500"
                        } font-body`}
                      >
                        {s.pct}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="text-xs text-text-500 font-body mt-4">
          शिक्षक त्यांच्या वर्गाची हजेरी Teacher डॅशबोर्डवरून घेतात.
        </p>
      </div>
    </>
  )
}
