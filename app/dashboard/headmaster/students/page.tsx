import Link from "next/link"
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
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
          👨‍🎓 विद्यार्थी व्यवस्थापन
        </div>
        <Link
          href="/dashboard/headmaster/users/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl font-[family-name:var(--font-noto-devanagari)]"
        >
          + विद्यार्थी जोडा
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
            <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
              विद्यार्थी यादी
            </span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
                  नाव
                </th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
                  रोल नंबर
                </th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
                  वर्ग
                </th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-text-500 text-sm font-[family-name:var(--font-noto-devanagari)]">
                    अजून विद्यार्थी नाहीत.{" "}
                    <Link href="/dashboard/headmaster/users/add" className="text-saffron hover:underline">
                      विद्यार्थी जोडा
                    </Link>
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s.id} className="hover:bg-saffron-pale/50">
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                      {s.name}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                      {s.roll_number ?? "—"}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                      {classLabel(s.classes as { grade?: number; division?: string } | null)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
