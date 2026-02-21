"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/auth/LogoutButton"

const NAV_ITEMS = [
  { href: "/dashboard/student", icon: "📊", label: "डॅशबोर्ड", exact: true },
]

export function StudentSidebar({
  studentName,
  classLabel,
  schoolName,
  className,
}: {
  studentName: string
  classLabel: string
  schoolName: string
  className?: string
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`w-[240px] bg-navy-2 text-white flex flex-col flex-shrink-0 relative overflow-hidden ${className ?? ""}`}
    >
      {/* Subtle orb */}
      <div
        className="absolute top-[-50%] right-[-30%] w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)" }}
      />

      {/* Brand */}
      <div className="p-5 border-b border-white/10 relative z-10">
        <Link href="/dashboard/student" className="block">
          <div className="font-extrabold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
            शाळा<span className="text-saffron-bright">Connect</span>
          </div>
          <div className="text-[9px] text-white/30 tracking-[2px] uppercase font-semibold mt-0.5 font-[family-name:var(--font-noto-devanagari)]">
            {schoolName}
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="py-4 px-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-gold flex items-center justify-center text-sm flex-shrink-0">
            👦
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-xs font-[family-name:var(--font-noto-devanagari)] truncate">
              {studentName}
            </div>
            <div className="text-[9px] text-white/55 font-[family-name:var(--font-noto-devanagari)]">
              {classLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-3 overflow-y-auto sidebar-scroll relative z-10">
        <p className="sc-section-label">मुख्य</p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl mb-0.5 transition-all text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] ${
                isActive
                  ? "bg-amber-400/15 border-l-[3px] border-amber-400 text-amber-300 font-semibold pl-[10px]"
                  : "text-white/55 hover:bg-white/6 hover:text-white/80"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}

        <p className="sc-section-label mt-2">अभ्यास</p>
        <div className="px-3 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 space-y-1.5">
          <p className="text-[11px] text-white/55 font-[family-name:var(--font-noto-devanagari)]">
            हजेरी, गुण, गृहपाठ डॅशबोर्डवर
          </p>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 relative z-10">
        <LogoutButton className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-white/6 text-white/55 hover:text-white/80 w-full text-left transition-all">
          <span className="text-base">🚪</span>
          <span className="text-[13px] font-[family-name:var(--font-noto-devanagari)]">लॉगआउट</span>
        </LogoutButton>
      </div>
    </aside>
  )
}
