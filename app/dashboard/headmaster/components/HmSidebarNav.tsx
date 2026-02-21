"use client"

import { usePathname } from "next/navigation"

// Use <a> for full page navigation so auth cookies are sent (client-side RSC fetch can miss cookies)
const SIDEBAR_NAV = [
  { href: "/dashboard/headmaster", icon: "📊", label: "मुख्य पृष्ठ", exact: true },
  { href: "/dashboard/headmaster/students", icon: "👨‍🎓", label: "विद्यार्थी", exact: false },
  { href: "/dashboard/headmaster/teachers", icon: "👩‍🏫", label: "शिक्षक", exact: false },
  { href: "/dashboard/headmaster/fees", icon: "💰", label: "शुल्क", exact: false },
  { href: "/dashboard/headmaster/attendance", icon: "📋", label: "हजेरी", exact: false },
  { href: "/dashboard/headmaster/exams", icon: "📝", label: "परीक्षा", exact: false },
  { href: "/dashboard/headmaster/documents", icon: "📁", label: "दस्तऐवज", exact: false },
  { href: "/dashboard/headmaster/announcements", icon: "📢", label: "घोषणा", exact: false },
  { href: "/dashboard/headmaster/reports", icon: "📄", label: "अहवाल", exact: false },
  { href: "/dashboard/headmaster/settings", icon: "⚙️", label: "सेटिंग्ज", exact: false },
] as const

export function HmSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 p-3 overflow-y-auto relative z-10" aria-label="मुख्य नेव्हिगेशन">
      {SIDEBAR_NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href)
        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 py-3 px-3.5 rounded-xl mb-1 transition-all duration-200 font-body text-[13px] ${
              isActive
                ? "bg-saffron/20 border-l-[3px] border-saffron text-saffron-bright font-semibold shadow-[inset_0_0_0_1px_rgba(244,106,10,0.1)]"
                : "text-white/60 font-medium hover:bg-white/[0.08] hover:text-white/85 border-l-[3px] border-transparent"
            }`}
          >
            <span className="text-[18px] w-[24px] text-center shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        )
      })}
    </nav>
  )
}
