import Link from "next/link"
import { redirect } from "next/navigation"
import { getHeadmasterSchoolId, getSchoolClasses } from "@/app/actions/users"

export default async function ClassesPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const classes = await getSchoolClasses(schoolId)

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            📚 वर्ग व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">
            एकूण {classes.length} वर्ग
          </div>
        </div>
        <Link
          href="/dashboard/headmaster/classes/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
        >
          + वर्ग जोडा
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">🏫</div>
            <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">
              अजून वर्ग तयार केलेले नाहीत
            </h3>
            <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] mb-5 text-sm max-w-sm mx-auto">
              वर्ग जोडा आणि नंतर विद्यार्थी/शिक्षक व्यवस्थापन सुरू करा.
            </p>
            <Link
              href="/dashboard/headmaster/classes/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
            >
              + पहिला वर्ग जोडा
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border-school overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-cream border-b border-border-school">
                <tr>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-500 uppercase tracking-wide font-[family-name:var(--font-plus-jakarta)]">
                    इयत्ता
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-500 uppercase tracking-wide font-[family-name:var(--font-plus-jakarta)]">
                    विभाग
                  </th>
                  <th className="text-left px-5 py-3 text-[11px] font-bold text-text-500 uppercase tracking-wide font-[family-name:var(--font-plus-jakarta)]">
                    शैक्षणिक वर्ष
                  </th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-b border-border-school/60 last:border-0">
                    <td className="px-5 py-3 text-sm font-semibold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
                      इ. {cls.grade}वी
                    </td>
                    <td className="px-5 py-3 text-sm text-text-700 font-[family-name:var(--font-noto-devanagari)]">
                      {cls.division}
                    </td>
                    <td className="px-5 py-3 text-sm text-text-500 font-[family-name:var(--font-noto-devanagari)]">
                      {cls.academic_year}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
