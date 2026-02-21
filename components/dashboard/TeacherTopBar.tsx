"use client"

import { useState, useRef, useEffect } from "react"
import { LogoutButton } from "@/components/auth/LogoutButton"

export function TeacherTopBar({
  teacherName,
  schoolName,
  dateStr,
}: {
  teacherName: string
  schoolName: string
  dateStr: string
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false)
      }
    }
    document.addEventListener("click", close)
    return () => document.removeEventListener("click", close)
  }, [])

  const initials = teacherName.charAt(0) || "श"

  return (
    <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-4 md:px-6 flex-shrink-0 shadow-xs gap-4">
      {/* Left: page title + subtitle */}
      <div className="min-w-0 flex-1">
        <div className="font-bold text-text-900 text-[15px] font-body truncate">
          नमस्कार, {teacherName} 🙏
        </div>
        <div className="text-[11px] text-text-300 font-body truncate">
          {dateStr} · {schoolName}
        </div>
      </div>

      {/* Right: search + calendar + notifications + user menu */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-[#F4F7FB] border border-border-school rounded-full pl-3 pr-4 py-1.5 w-[190px]">
          <span className="text-text-300 text-sm shrink-0">🔍</span>
          <input
            type="text"
            placeholder="शोधा..."
            className="bg-transparent border-none outline-none text-[13px] text-text-900 w-full font-body placeholder:text-text-300"
          />
        </div>

        {/* Calendar */}
        <button
          type="button"
          className="w-9 h-9 rounded-full bg-[#F4F7FB] border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors"
          aria-label="वेळापत्रक"
        >
          📅
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative w-9 h-9 rounded-full bg-[#F4F7FB] border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors"
            aria-label="सूचना"
          >
            🔔
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-saffron rounded-full border-2 border-white" />
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1 w-72 bg-white rounded-xl border border-border-school shadow-sh-lg py-2 z-50">
              <div className="px-4 py-2 border-b border-border-school font-bold text-sm text-text-900 font-body">
                सूचना
              </div>
              <div className="px-4 py-5 text-center text-text-500 text-sm font-body">
                नवीन सूचना नाहीत
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F4F7FB] transition-colors"
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-white text-sm font-bold font-body">
              {initials}
            </div>
            <span className="hidden md:inline text-sm font-semibold text-text-900 font-body">
              शिक्षक
            </span>
            <svg
              className={`w-4 h-4 text-text-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-border-school shadow-sh-lg py-2 z-50">
              <div className="px-4 py-2.5 border-b border-border-school">
                <div className="text-sm font-bold text-text-900 font-body">{teacherName}</div>
                <div className="text-[11px] text-text-300 font-body">{schoolName}</div>
              </div>
              <a
                href="/dashboard/teacher/schedule"
                className="block px-4 py-2 text-sm text-text-700 hover:bg-cream font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                📅 वेळापत्रक
              </a>
              <a
                href="/dashboard/teacher/reports"
                className="block px-4 py-2 text-sm text-text-700 hover:bg-cream font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                📈 प्रगती अहवाल
              </a>
              <hr className="my-1.5 border-border-school" />
              <LogoutButton
                className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-body"
                onClick={() => setUserMenuOpen(false)}
              >
                🚪 बाहेर पडा
              </LogoutButton>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
