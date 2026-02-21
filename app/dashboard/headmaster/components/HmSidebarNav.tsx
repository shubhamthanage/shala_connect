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

const SECTIONS = [
  { label: "डॅशबोर्ड", items: [0] },
  { label: "व्यवस्थापन", items: [1, 2, 3, 4, 5] },
  { label: "प्रशासन", items: [6, 7, 8] },
]

export function HmSidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="flex-1 py-3 px-3 overflow-y-auto sidebar-scroll">
      {SECTIONS.map((section) => (
        <div key={section.label}>
          <p className="sc-section-label">{section.label}</p>
          {section.items.map((idx) => {
            const item = SIDEBAR_NAV[idx]
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 py-2.5 px-3 rounded-xl mb-0.5 transition-all text-[13px] font-medium font-[family-name:var(--font-noto-devanagari)] ${
                  isActive
                    ? "bg-saffron/15 border-l-[3px] border-saffron text-saffron-bright font-semibold pl-[10px]"
                    : "text-white/55 hover:bg-white/6 hover:text-white/80"
                }`}
              >
                <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
