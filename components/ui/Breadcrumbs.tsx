"use client"

import { usePathname } from "next/navigation"

const LABELS: Record<string, string> = {
  dashboard: "डॅशबोर्ड",
  headmaster: "मुख्य पृष्ठ",
  students: "विद्यार्थी",
  teachers: "शिक्षक",
  fees: "शुल्क",
  attendance: "हजेरी",
  exams: "परीक्षा",
  documents: "दस्तऐवज",
  announcements: "घोषणा",
  settings: "सेटिंग्ज",
  reports: "अहवाल",
  add: "जोडा",
  users: "वापरकर्ते",
  classes: "वर्ग",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  if (segments.length < 2) return null

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/")
    const label = LABELS[seg] ?? seg
    const isLast = i === segments.length - 1
    return { href, label, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1.5">
          {i > 0 && (
            <span className="text-text-300 font-body" aria-hidden>
              /
            </span>
          )}
          {c.isLast ? (
            <span className="font-semibold text-text-900 font-body">{c.label}</span>
          ) : (
            <a
              href={c.href}
              className="text-text-500 hover:text-saffron font-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-1 rounded"
            >
              {c.label}
            </a>
          )}
        </span>
      ))}
    </nav>
  )
}
