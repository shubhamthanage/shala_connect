import { getStudentDashboard } from "@/app/actions/student"

export default async function StudentDashboardPage() {
  const data = await getStudentDashboard()
  if (!data) {
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

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`

  const attendancePct = data.attendancePct
  const attendanceColor = attendancePct >= 75 ? "#22C55E" : "#EF4444"
  const attendanceBg = attendancePct >= 75 ? "from-green-mid to-green-bright" : "from-red-400 to-red-500"

  // Circular progress for attendance
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (attendancePct / 100) * circumference

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            नमस्कार, {data.name}! 🙏
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">
            {dateStr} · {data.classLabel}
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-gold flex items-center justify-center text-base">
          👦
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Top row: Attendance circle + quick stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5 animate-fade-in-up">
          {/* Attendance card with circle */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-border-school shadow-sm p-5 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-saffron to-gold" />
            <svg width="88" height="88" viewBox="0 0 88 88" className="mb-3">
              <circle cx="44" cy="44" r={radius} fill="none" stroke="#E5EEF6" strokeWidth="8" />
              <circle
                cx="44"
                cy="44"
                r={radius}
                fill="none"
                stroke={attendanceColor}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
              <text x="44" y="44" textAnchor="middle" dy="0.35em" fontSize="16" fontWeight="800" fill="#060E1C">
                {attendancePct}%
              </text>
            </svg>
            <div className="text-[11px] text-text-300 text-center font-[family-name:var(--font-noto-devanagari)]">हजेरी (३० दिवस)</div>
            {attendancePct < 75 && (
              <div className="mt-2 text-[10px] text-red-500 font-semibold text-center font-[family-name:var(--font-noto-devanagari)]">
                ⚠️ ७५% पेक्षा कमी
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-border-school shadow-sm p-5 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-green-mid to-green-bright" />
              <div className="text-2xl mb-2">📊</div>
              <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
                {data.marks.length > 0
                  ? `${Math.round(data.marks.reduce((sum, m) => sum + (m.marks / m.maxMarks) * 100, 0) / data.marks.length)}%`
                  : "—"}
              </div>
              <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">सरासरी गुण</div>
            </div>
            <div className="bg-white rounded-2xl border border-border-school shadow-sm p-5 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-saffron to-gold" />
              <div className="text-2xl mb-2">📝</div>
              <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
                {data.homework.length}
              </div>
              <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">गृहपाठ बाकी</div>
            </div>
            <div className="bg-white rounded-2xl border border-border-school shadow-sm p-5 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-sky to-blue-500" />
              <div className="text-2xl mb-2">📅</div>
              <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
                {data.timetable.length}
              </div>
              <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">आजचे तास</div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Marks */}
          <div className="bg-white rounded-2xl border border-border-school shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-school">
              <div className="flex items-center gap-2">
                <span className="text-lg">📊</span>
                <h2 className="font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">गुण</h2>
              </div>
            </div>
            <div className="p-5">
              {data.marks.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-text-300 text-sm font-[family-name:var(--font-noto-devanagari)]">
                    अजून गुण प्रकाशित झाले नाहीत
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.marks.slice(0, 5).map((m, i) => {
                    const pct = Math.round((m.marks / m.maxMarks) * 100)
                    const barColor = pct >= 60 ? "bg-gradient-to-r from-green-mid to-green-bright" : pct >= 40 ? "bg-gradient-to-r from-saffron to-gold" : "bg-gradient-to-r from-red-400 to-red-500"
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[13px] font-medium text-text-700 font-[family-name:var(--font-noto-devanagari)]">{m.subject}</span>
                          <span className="text-[13px] font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">{m.marks}/{m.maxMarks}</span>
                        </div>
                        <div className="h-1.5 bg-border-school rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-[10px] text-text-300 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">{m.examName} · {pct}%</div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Homework */}
          <div className="bg-white rounded-2xl border border-border-school shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border-school">
              <div className="flex items-center gap-2">
                <span className="text-lg">📝</span>
                <h2 className="font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">गृहपाठ</h2>
              </div>
              {data.homework.length > 0 && (
                <span className="text-[10px] font-bold bg-saffron text-white px-2 py-0.5 rounded-full font-[family-name:var(--font-plus-jakarta)]">
                  {data.homework.length}
                </span>
              )}
            </div>
            <div className="p-5">
              {data.homework.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-text-300 text-sm font-[family-name:var(--font-noto-devanagari)]">सर्व गृहपाठ पूर्ण!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.homework.map((h, i) => (
                    <div key={i} className="border border-border-school rounded-xl p-3 hover:border-saffron/40 transition-colors">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <span className="font-semibold text-text-700 text-[13px] font-[family-name:var(--font-noto-devanagari)]">{h.subject}</span>
                          <p className="text-[12px] text-text-500 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">{h.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-saffron text-[10px]">📅</span>
                        <span className="text-[10px] text-saffron font-semibold font-[family-name:var(--font-noto-devanagari)]">{h.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timetable */}
        <div className="bg-white rounded-2xl border border-border-school shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-border-school">
            <span className="text-lg">📅</span>
            <h2 className="font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">वेळापत्रक</h2>
          </div>
          <div className="overflow-x-auto">
            {data.timetable.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-text-300 text-sm font-[family-name:var(--font-noto-devanagari)]">वेळापत्रक उपलब्ध नाही</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-school bg-[#F8FAFD]">
                    <th className="text-left py-3 px-5 text-[12px] font-semibold text-text-500 font-[family-name:var(--font-noto-devanagari)]">वार</th>
                    <th className="text-left py-3 px-5 text-[12px] font-semibold text-text-500 font-[family-name:var(--font-noto-devanagari)]">वेळ</th>
                    <th className="text-left py-3 px-5 text-[12px] font-semibold text-text-500 font-[family-name:var(--font-noto-devanagari)]">विषय</th>
                  </tr>
                </thead>
                <tbody>
                  {data.timetable.map((t, i) => (
                    <tr key={i} className="border-b border-border-school hover:bg-[#F8FAFD] transition-colors last:border-0">
                      <td className="py-3 px-5 text-[13px] font-medium text-text-700 font-[family-name:var(--font-noto-devanagari)]">{t.day}</td>
                      <td className="py-3 px-5 text-[13px] text-text-500 font-[family-name:var(--font-noto-devanagari)]">{t.time}</td>
                      <td className="py-3 px-5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-saffron/10 text-saffron text-[12px] font-semibold font-[family-name:var(--font-noto-devanagari)]">
                          {t.subject}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
