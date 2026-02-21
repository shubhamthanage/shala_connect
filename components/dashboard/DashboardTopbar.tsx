"use client"

import { useState, useRef, useEffect } from "react"
import { Breadcrumbs } from "@/components/ui/Breadcrumbs"
import { LogoutButton } from "@/components/auth/LogoutButton"

export function DashboardTopbar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Array<{ id: string; type: string; to: string; status: string; time: string }>>([])
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        notifRef.current && !notifRef.current.contains(e.target as Node) &&
        userRef.current && !userRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setUserMenuOpen(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  useEffect(() => {
    if (notificationsOpen) {
      fetch("/api/notifications")
        .then((r) => r.json())
        .then((d) => setNotifications(d.notifications || []))
        .catch(() => {})
    }
  }, [notificationsOpen])

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`

  return (
    <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-xs gap-4">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <Breadcrumbs />
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden md:flex items-center gap-2">
          <a
            href="/dashboard/headmaster/reports"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border-school text-text-700 text-xs font-semibold hover:border-saffron hover:text-saffron font-body transition-colors"
          >
            📄 अहवाल
          </a>
          <a
            href="/dashboard/headmaster/announcements"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-xs font-semibold shadow-saffron-glow hover:shadow-saffron-hover font-body transition-colors"
          >
            📢 सूचना
          </a>
        </div>
        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-lg text-text-500 hover:bg-cream hover:text-text-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-1"
            aria-label="शोध"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          {searchOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-border-school shadow-sh-lg py-2 z-50">
              <input
                type="search"
                placeholder="विद्यार्थी, वर्ग, शुल्क शोधा..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const q = searchQuery.trim().toLowerCase()
                    let href = "/dashboard/headmaster/students"
                    if (q.includes("विद्यार्थी") || q.includes("student")) href = "/dashboard/headmaster/students"
                    else if (q.includes("शिक्षक") || q.includes("teacher")) href = "/dashboard/headmaster/teachers"
                    else if (q.includes("शुल्क") || q.includes("fee")) href = "/dashboard/headmaster/fees"
                    else if (q.includes("हजेरी") || q.includes("attendance")) href = "/dashboard/headmaster/attendance"
                    else if (q.includes("अहवाल") || q.includes("report")) href = "/dashboard/headmaster/reports"
                    else if (q) href = `/dashboard/headmaster/students?q=${encodeURIComponent(q)}`
                    setSearchOpen(false)
                    window.location.href = href
                  }
                }}
                className="w-full px-4 py-2 text-sm border-0 focus:ring-0 focus:outline-none font-body placeholder:text-text-300"
                autoFocus
              />
              <div className="px-4 py-2 border-t border-border-school">
                <p className="text-[10px] text-text-300 font-body mb-2">जलद नेव्हिगेशन:</p>
                <div className="flex flex-wrap gap-1.5">
                  {["विद्यार्थी", "शिक्षक", "शुल्क", "हजेरी", "अहवाल"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => {
                        const href = label === "विद्यार्थी" ? "/dashboard/headmaster/students"
                          : label === "शिक्षक" ? "/dashboard/headmaster/teachers"
                          : label === "शुल्क" ? "/dashboard/headmaster/fees"
                          : label === "हजेरी" ? "/dashboard/headmaster/attendance"
                          : "/dashboard/headmaster/reports"
                        setSearchOpen(false)
                        window.location.href = href
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cream text-text-700 text-xs font-body hover:bg-saffron-pale hover:text-saffron transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-lg text-text-500 hover:bg-cream hover:text-text-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-1"
            aria-label="सूचना"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-saffron" aria-hidden />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 bg-white rounded-xl border border-border-school shadow-sh-lg py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-4 py-2 border-b border-border-school font-bold text-sm text-text-900 font-body flex justify-between items-center">
                <span>सूचना</span>
                <a
                  href="/dashboard/headmaster/announcements"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-saffron text-xs font-semibold hover:underline"
                >
                  सर्व पहा
                </a>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-text-500 text-sm font-body">
                  नवीन सूचना नाहीत
                </div>
              ) : (
                <div className="divide-y divide-border-school">
                  {notifications.slice(0, 8).map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-cream/50">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-semibold text-text-700 font-body">{n.type}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          n.status === "sent" ? "bg-green-pale text-green-mid" : n.status === "failed" ? "bg-red-50 text-red-500" : "bg-amber-100 text-amber-700"
                        } font-body`}>
                          {n.status === "sent" ? "पाठवले" : n.status === "failed" ? "अयशस्वी" : "प्रलंबित"}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-500 font-body mt-0.5">→ {n.to}</p>
                      <p className="text-[10px] text-text-300 font-body">{new Date(n.time).toLocaleString("mr-IN")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cream transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron focus-visible:ring-offset-1"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white text-sm font-bold font-body">
              मु
            </div>
            <span className="hidden md:inline text-sm font-semibold text-text-900 font-body">मुख्याध्यापक</span>
            <svg className={`w-4 h-4 text-text-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-border-school shadow-sh-lg py-2 z-50">
              <a
                href="/dashboard/headmaster/settings"
                className="block px-4 py-2 text-sm text-text-700 hover:bg-cream font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                सेटिंग्ज
              </a>
              <a
                href="/dashboard/headmaster/reports"
                className="block px-4 py-2 text-sm text-text-700 hover:bg-cream font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                अहवाल
              </a>
              <hr className="my-2 border-border-school" />
              <LogoutButton
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                बाहेर पडा
              </LogoutButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
