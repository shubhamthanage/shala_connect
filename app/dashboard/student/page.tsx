import { redirect } from "next/navigation"
import { getStudentDashboard } from "@/app/actions/student"

export default async function StudentDashboardPage() {
  const data = await getStudentDashboard()
  if (!data) redirect("/login?error=no_school")

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-900 mb-2 font-[family-name:var(--font-noto-devanagari)]">
        👦 विद्यार्थी डॅशबोर्ड
      </h1>
      <p className="text-text-500 mb-8 font-[family-name:var(--font-noto-devanagari)]">
        नमस्कार {data.name}! {data.classLabel}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            📋 हजेरी
          </h2>
          <div className="text-3xl font-extrabold text-saffron font-[family-name:var(--font-noto-devanagari)]">
            {data.attendancePct}%
          </div>
          <p className="text-sm text-text-500 mt-1 font-[family-name:var(--font-noto-devanagari)]">
            गेल्या ३० दिवसांची सरासरी
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            📊 गुण
          </h2>
          {data.marks.length === 0 ? (
            <p className="text-text-500 text-sm font-[family-name:var(--font-noto-devanagari)]">
              अजून गुण प्रकाशित झाले नाहीत
            </p>
          ) : (
            <ul className="space-y-2">
              {data.marks.slice(0, 5).map((m, i) => (
                <li key={i} className="flex justify-between text-sm font-[family-name:var(--font-noto-devanagari)]">
                  <span>{m.examName} — {m.subject}</span>
                  <span className="font-semibold">{m.marks}/{m.maxMarks}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            📝 गृहपाठ
          </h2>
          {data.homework.length === 0 ? (
            <p className="text-text-500 text-sm font-[family-name:var(--font-noto-devanagari)]">
              बाकी गृहपाठ नाही
            </p>
          ) : (
            <ul className="space-y-3">
              {data.homework.map((h, i) => (
                <li key={i} className="border-b border-border-school pb-2 last:border-0 font-[family-name:var(--font-noto-devanagari)]">
                  <span className="font-semibold text-text-700">{h.subject}</span>
                  <p className="text-sm text-text-500">{h.description}</p>
                  <span className="text-xs text-saffron">दिनांक: {h.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            📅 वेळापत्रक
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-school">
                  <th className="text-left py-2 font-[family-name:var(--font-noto-devanagari)]">वार</th>
                  <th className="text-left py-2 font-[family-name:var(--font-noto-devanagari)]">वेळ</th>
                  <th className="text-left py-2 font-[family-name:var(--font-noto-devanagari)]">विषय</th>
                </tr>
              </thead>
              <tbody>
                {data.timetable.map((t, i) => (
                  <tr key={i} className="border-b border-border-school">
                    <td className="py-2 font-[family-name:var(--font-noto-devanagari)]">{t.day}</td>
                    <td className="py-2 font-[family-name:var(--font-noto-devanagari)]">{t.time}</td>
                    <td className="py-2 font-[family-name:var(--font-noto-devanagari)]">{t.subject}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
