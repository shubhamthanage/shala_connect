import { redirect } from "next/navigation"
import { getHeadmasterSchoolId, getSchoolStudentsWithClass } from "@/app/actions/users"

export default async function StudentsPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const students = await getSchoolStudentsWithClass(schoolId)

  const classLabel = (c: { grade?: number; division?: string } | null) => {
    if (!c?.grade) return "—"
    return `इ.${c.grade}वी ${c.division ?? ""}`
  }

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            👨‍🎓 विद्यार्थी व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">एकूण {students.length} विद्यार्थी</div>
        </div>
        <a
          href="/dashboard/headmaster/users/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
        >
          + विद्यार्थी जोडा
        </a>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border-school flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-saffron to-gold" />
              <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
                विद्यार्थी यादी
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#F8FAFD]">
                  <th className="text-[11px] font-semibold text-text-500 px-5 py-3 text-left border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                    नाव
                  </th>
                  <th className="text-[11px] font-semibold text-text-500 px-5 py-3 text-left border-b border-border-school font-[family-name:var(--font-plus-jakarta)]">
                    Roll No.
                  </th>
                  <th className="text-[11px] font-semibold text-text-500 px-5 py-3 text-left border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                    वर्ग
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-16 font-[family-name:var(--font-noto-devanagari)]">
                      <div className="text-4xl mb-3">👨‍🎓</div>
                      <p className="text-text-500 text-sm mb-2">अजून विद्यार्थी नाहीत.</p>
                      <Link href="/dashboard/headmaster/users/add" className="text-saffron font-semibold hover:underline text-sm">
                        विद्यार्थी जोडा →
                      </Link>
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s.id} className="hover:bg-[#F8FAFD] transition-colors border-b border-border-school last:border-0">
                      <td className="text-[13px] font-medium text-text-700 px-5 py-3 font-[family-name:var(--font-noto-devanagari)]">
                        {s.name}
                      </td>
                      <td className="text-[13px] text-text-500 px-5 py-3 font-[family-name:var(--font-plus-jakarta)]">
                        {s.roll_number ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-saffron/10 text-saffron text-[12px] font-semibold font-[family-name:var(--font-noto-devanagari)]">
                          {classLabel(s.classes as { grade?: number; division?: string } | null)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
