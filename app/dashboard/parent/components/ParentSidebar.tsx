"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogoutButton } from "@/components/auth/LogoutButton"

const NAV_ITEMS = [
  { href: "/dashboard/parent", icon: "📊", label: "डॅशबोर्ड", exact: true },
]

export function ParentSidebar({
  parentName,
  schoolName,
  className,
}: {
  parentName: string
  schoolName: string
  className?: string
}) {
  const pathname = usePathname()

  return (
    <aside
      className={`w-[240px] bg-navy-2 flex flex-col flex-shrink-0 relative overflow-hidden ${className ?? ""}`}
    >
      {/* Subtle orb */}
      <div
        className="absolute top-[-50%] right-[-30%] w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07), transparent 70%)" }}
      />

      {/* Brand */}
      <div className="p-5 border-b border-white/10 relative z-10">
        <Link href="/dashboard/parent" className="block">
          <div className="font-extrabold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
            शाळा<span className="text-saffron-bright">Connect</span>
          </div>
          <div className="text-[9px] text-white/30 tracking-[2px] uppercase font-semibold mt-0.5">
            {schoolName}
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="py-4 px-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">
            👨‍👩‍👦
          </div>
          <div className="min-w-0">
            <div className="font-bold text-white text-xs font-[family-name:var(--font-noto-devanagari)] truncate">
              {parentName}
            </div>
            <div className="text-[9px] text-white/38 font-[family-name:var(--font-noto-devanagari)]">
              पालक
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
                  ? "bg-violet-500/15 border-l-[3px] border-violet-400 text-violet-300 font-semibold pl-[10px]"
                  : "text-white/55 hover:bg-white/6 hover:text-white/80"
              }`}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}

        <p className="sc-section-label mt-2">माझी मुले</p>
        <div className="px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10">
          <p className="text-[11px] text-white/38 font-[family-name:var(--font-noto-devanagari)]">
            मुलांची माहिती डॅशबोर्डवर उपलब्ध
          </p>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 relative z-10">
        <LogoutButton className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-white/6 text-white/50 w-full text-left transition-all">
          <span className="text-base">🚪</span>
          <span className="text-[13px] font-[family-name:var(--font-noto-devanagari)]">लॉगआउट</span>
        </LogoutButton>
      </div>
    </aside>
  )
}
