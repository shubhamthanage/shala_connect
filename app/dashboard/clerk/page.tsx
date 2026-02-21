import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

async function getClerkStats(schoolId: string) {
  try {
    const admin = createAdminClient()
    const [studentsRes, feesRes, docsRes] = await Promise.all([
      admin.from("students").select("id", { count: "exact" }).eq("school_id", schoolId),
      admin.from("fees").select("amount, paid").eq("school_id", schoolId),
      admin.from("certificates").select("id", { count: "exact" }).eq("school_id", schoolId),
    ])
    const totalStudents = studentsRes.count ?? 0
    const feesPending = (feesRes.data ?? []).filter((f) => !f.paid).reduce((sum, f) => sum + (f.amount ?? 0), 0)
    const docsIssued = docsRes.count ?? 0
    return { totalStudents, feesPending, docsIssued }
  } catch {
    return { totalStudents: 0, feesPending: 0, docsIssued: 0 }
  }
}

const QUICK_ACTIONS = [
  {
    icon: "👨‍🎓",
    label: "नवीन प्रवेश",
    desc: "विद्यार्थी / पालक नोंदणी",
    href: "/dashboard/clerk/students/add",
    accent: "from-saffron to-gold",
    accentBg: "bg-saffron/10",
    accentText: "text-saffron",
    accentBorder: "hover:border-saffron",
  },
  {
    icon: "📋",
    label: "हजेरी पहा",
    desc: "आजची हजेरी तपासा",
    href: "/dashboard/clerk/attendance",
    accent: "from-sky to-blue-500",
    accentBg: "bg-sky/10",
    accentText: "text-sky",
    accentBorder: "hover:border-sky",
  },
  {
    icon: "💰",
    label: "शुल्क व्यवस्थापन",
    desc: "फी तपासा व अपडेट करा",
    href: "/dashboard/clerk/fees",
    accent: "from-green-mid to-green-bright",
    accentBg: "bg-green-mid/10",
    accentText: "text-green-mid",
    accentBorder: "hover:border-green-mid",
  },
  {
    icon: "📄",
    label: "दाखले व दस्तऐवज",
    desc: "TC, बोनाफाईड, प्रमाणपत्र",
    href: "/dashboard/clerk/documents",
    accent: "from-purple-500 to-violet-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-500",
    accentBorder: "hover:border-purple-400",
  },
]

export default async function ClerkDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let stats = { totalStudents: 0, feesPending: 0, docsIssued: 0 }
  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("school_id")
      .eq("auth_id", user.id)
      .single()
    if (userData?.school_id) {
      stats = await getClerkStats(userData.school_id)
    }
  }

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
    return `₹${n}`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            🧑‍💻 कारकून डॅशबोर्ड
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">{dateStr}</div>
        </div>
        <Link
          href="/dashboard/clerk/students/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
        >
          + नवीन प्रवेश
        </Link>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in-up">
          <div className="bg-white rounded-2xl p-5 border border-border-school shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-saffron to-gold" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-xl">👨‍🎓</div>
              <span className="text-[10px] font-bold text-green-mid bg-green-pale px-2 py-0.5 rounded-full">सक्रिय</span>
            </div>
            <div className="font-extrabold text-text-900 text-3xl font-[family-name:var(--font-noto-devanagari)]">
              {stats.totalStudents}
            </div>
            <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">एकूण विद्यार्थी</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border-school shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-red-400 to-red-500" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">💰</div>
              <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">थकित</span>
            </div>
            <div className="font-extrabold text-text-900 text-3xl font-[family-name:var(--font-noto-devanagari)]">
              {formatCurrency(stats.feesPending)}
            </div>
            <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">शुल्क थकबाकी</div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-border-school shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-purple-500 to-violet-500" />
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-xl">📄</div>
              <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">जारी</span>
            </div>
            <div className="font-extrabold text-text-900 text-3xl font-[family-name:var(--font-noto-devanagari)]">
              {stats.docsIssued}
            </div>
            <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">दाखले जारी</div>
          </div>
        </div>

        {/* Quick Actions Heading */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-saffron to-gold" />
          <h2 className="font-bold text-text-900 text-base font-[family-name:var(--font-noto-devanagari)]">
            जलद कार्ये
          </h2>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {QUICK_ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`bg-white rounded-2xl border-2 border-border-school p-6 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-start gap-3 group ${a.accentBorder}`}
            >
              <div className={`w-12 h-12 rounded-xl ${a.accentBg} flex items-center justify-center text-2xl`}>
                {a.icon}
              </div>
              <div>
                <div className={`font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)] group-hover:${a.accentText} transition-colors`}>
                  {a.label}
                </div>
                <div className="text-xs text-text-300 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">
                  {a.desc}
                </div>
              </div>
              <div className={`text-xs font-semibold ${a.accentText} font-[family-name:var(--font-noto-devanagari)] flex items-center gap-1 mt-auto`}>
                उघडा →
              </div>
            </Link>
          ))}
        </div>

        {/* Help banner */}
        <div className="bg-gradient-to-br from-navy to-navy-3 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-base mb-1 font-[family-name:var(--font-noto-devanagari)]">
              मदत हवी आहे?
            </div>
            <p className="text-sm text-white/55 font-[family-name:var(--font-noto-devanagari)]">
              कोणतीही समस्या असल्यास मुख्याध्यापकांशी संपर्क करा
            </p>
          </div>
          <div className="text-4xl">🤝</div>
        </div>
      </div>
    </div>
  )
}
