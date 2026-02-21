const ACTIONS = [
  { icon: "📋", label: "हजेरी घ्या", href: "/dashboard/teacher/attendance" },
  { icon: "📝", label: "गृहपाठ द्या", href: "/dashboard/teacher/homework" },
  { icon: "📢", label: "सूचना पाठवा", href: "/dashboard/teacher/messages" },
  { icon: "📊", label: "गुण भरा", href: "/dashboard/teacher/exams" },
  { icon: "📄", label: "दाखला द्या", href: "/dashboard/teacher/documents" },
  { icon: "🤖", label: "AI विचारा", href: "/dashboard/teacher/ai" },
]

export function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-4 py-4 border-b border-border-school">
        <span className="font-bold text-text-900 text-sm font-heading">
          ⚡ जलद कार्ये
        </span>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2.5">
          {ACTIONS.map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="p-3.5 rounded-xl border-2 border-border-school flex flex-col items-center gap-2 text-center bg-white hover:border-saffron hover:bg-saffron-pale transition-all hover:-translate-y-0.5"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-[11px] font-semibold text-text-700 font-body">
                {a.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
