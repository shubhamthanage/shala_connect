"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const SIDEBAR_NAV = [
  { href: "/dashboard/headmaster", icon: "📊", label: "Analytics", exact: true },
  { href: "/dashboard/headmaster/students", icon: "👨‍🎓", label: "विद्यार्थी", exact: false },
  { href: "/dashboard/headmaster/teachers", icon: "👩‍🏫", label: "शिक्षक", exact: false },
  { href: "/dashboard/headmaster/fees", icon: "💰", label: "शुल्क", exact: false },
  { href: "/dashboard/headmaster/attendance", icon: "📋", label: "हजेरी", exact: false },
  { href: "/dashboard/headmaster/exams", icon: "📝", label: "परीक्षा", exact: false },
  { href: "/dashboard/headmaster/documents", icon: "📁", label: "दस्तऐवज", exact: false },
  { href: "/dashboard/headmaster/announcements", icon: "📢", label: "घोषणा", exact: false },
  { href: "/dashboard/headmaster/settings", icon: "⚙️", label: "सेटिंग्ज", exact: false },
] as const

export function HmSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-2">
      {SIDEBAR_NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 py-2.5 px-3 rounded-lg mb-0.5 transition-all font-[family-name:var(--font-noto-devanagari)] text-[12px] ${
              isActive
                ? "bg-saffron/20 border-l-2 border-saffron text-saffron-bright font-semibold"
                : "text-white/55 font-medium hover:bg-white/5"
            }`}
          >
            <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
