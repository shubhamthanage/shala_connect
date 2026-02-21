
export interface AttendanceStudent {
  id: string
  name: string
  rollNumber: string | null
  attendancePct: number
  status: "present" | "absent" | "late"
}

function getStatusStyle(pct: number) {
  if (pct >= 85) return { bg: "bg-green-pale", text: "text-green-mid", label: "हजर" }
  if (pct >= 70) return { bg: "bg-amber-100", text: "text-amber-700", label: "लक्ष द्या" }
  return { bg: "bg-red-50", text: "text-red-600", label: "कमी" }
}

function getBarColor(pct: number) {
  if (pct >= 85) return "bg-green-mid"
  if (pct >= 70) return "bg-amber-500"
  return "bg-red-500"
}

export function AttendanceWidget({
  students,
  classLabel,
  viewAllHref,
}: {
  students: AttendanceStudent[]
  classLabel: string
  viewAllHref?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-4 py-4 border-b border-border-school flex items-center justify-between">
        <span className="font-bold text-text-900 text-sm font-heading">
          📋 आजची हजेरी — {classLabel}
        </span>
        {viewAllHref && (
          <a
            href={viewAllHref}
            className="text-saffron text-xs font-semibold hover:underline font-body"
          >
            संपूर्ण पहा →
          </a>
        )}
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {students.length === 0 ? (
            <p className="text-text-500 text-sm py-4 text-center font-body">
              अजून विद्यार्थी नाहीत
            </p>
          ) : (
            students.slice(0, 6).map((s) => {
              const style = getStatusStyle(s.attendancePct)
              return (
                <div
                  key={s.id}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-cream border border-border-school flex items-center justify-center text-sm flex-shrink-0">
                    {s.name.includes("ा") || s.name.includes("ी") ? "👧" : "👦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-text-900 text-[13px] truncate font-body">
                      {s.name}
                    </div>
                    <div className="text-[10px] text-text-300 font-body">
                      रोल नं. {s.rollNumber ?? "—"}
                    </div>
                  </div>
                  <div className="w-[100px] h-1.5 bg-cream rounded overflow-hidden flex-shrink-0">
                    <div
                      className={`h-full rounded ${getBarColor(s.attendancePct)}`}
                      style={{ width: `${Math.min(s.attendancePct, 100)}%` }}
                    />
                  </div>
                  <span className="font-bold text-text-700 text-xs min-w-9 text-right font-body">
                    {s.attendancePct}%
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-body ${style.bg} ${style.text}`}
                  >
                    {style.label}
                  </span>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
