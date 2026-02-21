"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/auth/LogoutButton"

const NAV_ITEMS = [
  { href: "/dashboard/teacher", icon: "📊", label: "डॅशबोर्ड" },
  { href: "/dashboard/teacher/attendance", icon: "📋", label: "हजेरी", badge: "आज" },
  { href: "/dashboard/teacher/homework", icon: "📝", label: "गृहपाठ" },
  { href: "/dashboard/teacher/exams", icon: "📊", label: "परीक्षा व गुण" },
  { href: "/dashboard/teacher/students", icon: "👦", label: "विद्यार्थी यादी" },
  { href: "/dashboard/teacher/reports", icon: "📈", label: "प्रगती अहवाल" },
  { href: "/dashboard/teacher/messages", icon: "💬", label: "पालक संदेश", badge: "३" },
  { href: "/dashboard/teacher/meetings", icon: "🤝", label: "भेट बुकिंग" },
  { href: "/dashboard/teacher/elearning", icon: "📚", label: "ई-लर्निंग" },
  { href: "/dashboard/teacher/schedule", icon: "📅", label: "वेळापत्रक" },
  { href: "/dashboard/teacher/ai", icon: "🤖", label: "AI सहाय्यक" },
]

export function TeacherSidebar({
  teacherName,
  className,
  schoolName,
}: {
  teacherName: string
  className?: string
  schoolName: string
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`w-[240px] bg-navy-2 flex flex-col flex-shrink-0 relative overflow-hidden ${className ?? ""}`}
    >
      <div
        className="absolute top-[-50%] right-[-30%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(244,106,10,0.07), transparent 70%)",
        }}
      />
      <div className="p-5 border-b border-white/10 relative z-10">
        <Link href="/dashboard/teacher" className="block">
          <div className="font-extrabold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
            शाळा<span className="text-saffron-bright">Connect</span>
          </div>
          <div className="text-[9px] text-white/30 tracking-[2px] uppercase font-semibold mt-0.5 font-[family-name:var(--font-plus-jakarta)]">
            {schoolName}
          </div>
        </Link>
      </div>
      <div className="py-4 px-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-sm flex-shrink-0">
            👩‍🏫
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-xs font-[family-name:var(--font-noto-devanagari)] truncate">
              {teacherName}
            </div>
            <div className="text-[9px] text-white/38 font-[family-name:var(--font-noto-devanagari)]">
              शिक्षक
            </div>
          </div>
        </div>
      </div>
      <nav className="flex-1 py-4 px-3 overflow-y-auto relative z-10">
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-white/22 px-2 py-1 font-[family-name:var(--font-plus-jakarta)]">
          मुख्य
        </div>
        {NAV_ITEMS.slice(0, 4).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 py-2.5 px-2.5 rounded-lg mb-0.5 transition-all ${
                isActive
                  ? "bg-saffron/15 border-l-2 border-saffron"
                  : "hover:bg-white/6 text-white/58"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span
                className={`text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] flex-1 ${
                  isActive ? "text-saffron-bright font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-saffron text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-[family-name:var(--font-plus-jakarta)]">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-white/22 px-2 py-1 mt-3 font-[family-name:var(--font-plus-jakarta)]">
          विद्यार्थी
        </div>
        {NAV_ITEMS.slice(4, 6).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 py-2.5 px-2.5 rounded-lg mb-0.5 transition-all ${
                isActive
                  ? "bg-saffron/15 border-l-2 border-saffron"
                  : "hover:bg-white/6 text-white/58"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span
                className={`text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] ${
                  isActive ? "text-saffron-bright font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-white/22 px-2 py-1 mt-3 font-[family-name:var(--font-plus-jakarta)]">
          संवाद
        </div>
        {NAV_ITEMS.slice(6, 8).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 py-2.5 px-2.5 rounded-lg mb-0.5 transition-all ${
                isActive
                  ? "bg-saffron/15 border-l-2 border-saffron"
                  : "hover:bg-white/6 text-white/58"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span
                className={`text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] flex-1 ${
                  isActive ? "text-saffron-bright font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
              {item.badge && (
                <span className="bg-saffron text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full font-[family-name:var(--font-plus-jakarta)]">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
        <div className="text-[9px] font-extrabold tracking-[2px] uppercase text-white/22 px-2 py-1 mt-3 font-[family-name:var(--font-plus-jakarta)]">
          शिक्षण
        </div>
        {NAV_ITEMS.slice(8).map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 py-2.5 px-2.5 rounded-lg mb-0.5 transition-all ${
                isActive
                  ? "bg-saffron/15 border-l-2 border-saffron"
                  : "hover:bg-white/6 text-white/58"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span
                className={`text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] ${
                  isActive ? "text-saffron-bright font-semibold" : ""
                }`}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/10 relative z-10">
        <Link
          href="/dashboard/teacher/settings"
          className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/6 text-white/58"
        >
          <span className="text-base">⚙️</span>
          <span className="text-[13px] font-[family-name:var(--font-noto-devanagari)]">सेटिंग्ज</span>
        </Link>
        <LogoutButton className="flex items-center gap-2.5 py-2 px-2 rounded-lg hover:bg-white/6 text-white/50 w-full text-left">
          <span className="text-base">🚪</span>
          <span className="text-[13px] font-[family-name:var(--font-noto-devanagari)]">लॉगआउट</span>
        </LogoutButton>
      </div>
    </aside>
  )
}
