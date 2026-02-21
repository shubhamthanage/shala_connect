import { getStudentDashboard } from "@/app/actions/student"

export default async function StudentDashboardPage() {
  const data = await getStudentDashboard()
  if (!data) {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-4',hypothesisId:'H13',location:'app/dashboard/student/page.tsx',message:'student page shows fallback instead of login redirect',data:{},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-900 mb-2 font-body">
          👦 विद्यार्थी डॅशबोर्ड
        </h1>
        <p className="text-text-500 mb-8 font-body">
          तुमच्या खात्याची माहिती सेटअप होत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-900 mb-2 font-body">
        👦 विद्यार्थी डॅशबोर्ड
      </h1>
      <p className="text-text-500 mb-8 font-body">
        नमस्कार {data.name}! {data.classLabel}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-body">
            📋 हजेरी
          </h2>
          <div className="text-3xl font-extrabold text-saffron font-body">
            {data.attendancePct}%
          </div>
          <p className="text-sm text-text-500 mt-1 font-body">
            गेल्या ३० दिवसांची सरासरी
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-body">
            📊 गुण
          </h2>
          {data.marks.length === 0 ? (
            <p className="text-text-500 text-sm font-body">
              अजून गुण प्रकाशित झाले नाहीत
            </p>
          ) : (
            <ul className="space-y-2">
              {data.marks.slice(0, 5).map((m, i) => (
                <li key={i} className="flex justify-between text-sm font-body">
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
          <h2 className="font-bold text-text-900 mb-4 font-body">
            📝 गृहपाठ
          </h2>
          {data.homework.length === 0 ? (
            <p className="text-text-500 text-sm font-body">
              बाकी गृहपाठ नाही
            </p>
          ) : (
            <ul className="space-y-3">
              {data.homework.map((h, i) => (
                <li key={i} className="border-b border-border-school pb-2 last:border-0 font-body">
                  <span className="font-semibold text-text-700">{h.subject}</span>
                  <p className="text-sm text-text-500">{h.description}</p>
                  <span className="text-xs text-saffron">दिनांक: {h.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border-school p-6">
          <h2 className="font-bold text-text-900 mb-4 font-body">
            📅 वेळापत्रक
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-school">
                  <th className="text-left py-2 font-body">वार</th>
                  <th className="text-left py-2 font-body">वेळ</th>
                  <th className="text-left py-2 font-body">विषय</th>
                </tr>
              </thead>
              <tbody>
                {data.timetable.map((t, i) => (
                  <tr key={i} className="border-b border-border-school">
                    <td className="py-2 font-body">{t.day}</td>
                    <td className="py-2 font-body">{t.time}</td>
                    <td className="py-2 font-body">{t.subject}</td>
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
