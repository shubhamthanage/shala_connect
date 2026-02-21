import Link from "next/link"

const ACTIONS = [
  { icon: "👨‍🎓", label: "नवीन प्रवेश", href: "/dashboard/clerk/students/add", desc: "विद्यार्थी / पालक नोंदणी" },
  { icon: "📋", label: "हजेरी", href: "/dashboard/clerk/attendance", desc: "हजेरी पहा" },
  { icon: "💰", label: "शुल्क", href: "/dashboard/clerk/fees", desc: "फी माहिती" },
  { icon: "📄", label: "दाखले", href: "/dashboard/clerk/documents", desc: "दस्तऐवज" },
]

export default function ClerkDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-900 mb-2 font-[family-name:var(--font-noto-devanagari)]">
        🧑‍💻 कारकून डॅशबोर्ड
      </h1>
      <p className="text-text-500 mb-8 font-[family-name:var(--font-noto-devanagari)]">
        जलद कार्ये निवडा
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="bg-white rounded-2xl border-2 border-border-school p-6 hover:border-saffron hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col items-center text-center"
          >
            <span className="text-4xl mb-3">{a.icon}</span>
            <span className="font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {a.label}
            </span>
            <span className="text-xs text-text-500 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              {a.desc}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
