"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import { Eye, EyeOff, Phone, Lock, Fingerprint } from "lucide-react"

const ROLES = [
  { id: "headmaster", label: "मुख्याध्यापक", sub: "Headmaster", emoji: "👨‍💼" },
  { id: "teacher", label: "शिक्षक", sub: "Teacher", emoji: "👩‍🏫" },
  { id: "clerk", label: "कारकून", sub: "Clerk", emoji: "🧑‍💻" },
  { id: "student", label: "विद्यार्थी", sub: "Student", emoji: "👦" },
  { id: "parent", label: "पालक", sub: "Parent", emoji: "👨‍👩‍👦" },
] as const

const DASHBOARD_PATHS: Record<(typeof ROLES)[number]["id"], string> = {
  headmaster: "/dashboard/headmaster",
  teacher: "/dashboard/teacher",
  clerk: "/dashboard/clerk",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
}

export default function LoginForm() {
  const searchParams = useSearchParams()
  const [role, setRole] = useState<(typeof ROLES)[number]["id"]>("headmaster")
  const [phoneOrEmail, setPhoneOrEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const err = searchParams.get("error")
    if (err) {
      const msg =
        err === "no_session"
          ? "सत्र मिळाले नाही. पुन्हा लॉगिन करा."
          : err === "wrong_role"
            ? "चुकीची भूमिका. योग्य भूमिका निवडा."
            : err === "no_school"
              ? "शाळा डेटा मिळाला नाही. व्यवस्थापकाशी संपर्क करा."
              : err === "db_error"
                ? "लॉगिन नंतर तात्काळ लॉगआउट होत असेल तर: Supabase Dashboard → SQL Editor मध्ये supabase/fix_auth_schema_complete.sql चालवा."
                : decodeURIComponent(err)
      toast.error(msg, err === "db_error" ? { duration: 8000 } : undefined)
    }
    const reset = searchParams.get("reset")
    if (reset === "success") toast.success("पासवर्ड अपडेट झाला. आता लॉगिन करा.")
    const registered = searchParams.get("registered")
    if (registered === "true") toast.success("शाळा नोंदणी यशस्वी! आता लॉगिन करा.")
  }, [searchParams])

  const isPhone = /^[6-9]\d{9}$/.test(phoneOrEmail.replace(/\s/g, ""))
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneOrEmail.trim())

  const handleLogin = async (e: React.FormEvent) => {
    if (!isSupabaseConfigured()) {
      e.preventDefault()
      toast.error("Supabase कॉन्फिगर करा. .env.local मध्ये NEXT_PUBLIC_SUPABASE_URL आणि NEXT_PUBLIC_SUPABASE_ANON_KEY सेट करा.")
      return
    }
    if (!phoneOrEmail.trim()) {
      e.preventDefault()
      toast.error("मोबाईल नंबर किंवा ईमेल प्रविष्ट करा")
      return
    }

    if (isEmail) {
      if (!password) {
        e.preventDefault()
        toast.error("पासवर्ड प्रविष्ट करा")
        return
      }
      // Let form POST to /api/auth/login — server sets cookies on redirect, then browser follows
      return
    }

    e.preventDefault()
    setLoading(true)
    try {
      if (isPhone) {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithOtp({
          phone: `+91${phoneOrEmail.replace(/\D/g, "")}`,
          options: {
            data: { role },
            shouldCreateUser: true,
          },
        })
        if (error) throw error
        toast.success("OTP तुमच्या मोबाईलवर पाठवला आहे. सत्यापित केल्यानंतर प्रवेश होईल.")
        // Supabase redirects to configured URL after OTP verification
      } else {
        toast.error("वैध मोबाईल नंबर (९XXXXXXXXX) किंवा ईमेल प्रविष्ट करा")
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "प्रवेश अयशस्वी")
    } finally {
      setLoading(false)
    }
  }

  const handleBiometric = () => {
    toast("Biometric login लवकरच उपलब्ध होईल", { icon: "🤳" })
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-navy flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen min-h-[100dvh]">
        {/* Mobile: compact header with back link */}
        <div className="lg:hidden flex items-center justify-between p-4 safe-area-padding bg-navy-2 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg">
              🏫
            </div>
            <span className="font-bold text-white text-base font-heading">
              शाळा<span className="text-saffron-bright">Connect</span>
            </span>
          </Link>
          <Link href="/register" className="text-saffron text-sm font-semibold font-body">
            नोंदणी
          </Link>
        </div>

        {/* Left panel — design.html login-l */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-navy-2 to-slate-2 p-12 relative overflow-hidden">
          {/* Saffron orb */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 600px 500px at 80% 30%, rgba(244,106,10,0.12), transparent 70%)",
            }}
          />
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-xl shadow-lg shadow-saffron/40">
                🏫
              </div>
              <div>
                <div className="font-extrabold text-white text-xl font-heading">
                  शाळा<span className="text-saffron-bright">Connect</span>
                </div>
                <div className="text-[9px] text-white/35 tracking-[2.5px] uppercase font-semibold">
                  Maharashtra Edu Platform
                </div>
              </div>
            </Link>
          </div>
          <div className="relative z-10 flex-1 flex items-center justify-center py-10">
            <div className="w-full max-w-[360px]">
              <div className="bg-white/[0.07] border border-white/[0.12] rounded-[20px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="font-bold text-white text-sm mb-3 font-heading">
                  📊 आजचा सारांश
                </div>
                <div className="flex gap-2 mb-2">
                  <div className="flex-1 bg-white/[0.07] rounded-xl p-2.5 text-center">
                    <div className="font-extrabold text-white text-[17px] font-heading">
                      १,२४७
                    </div>
                    <div className="text-[9px] text-white/40 font-body">
                      विद्यार्थी
                    </div>
                  </div>
                  <div className="flex-1 bg-white/[0.07] rounded-xl p-2.5 text-center">
                    <div className="font-extrabold text-white text-[17px] font-heading">
                      ८७%
                    </div>
                    <div className="text-[9px] text-white/40 font-body">
                      हजेरी
                    </div>
                  </div>
                  <div className="flex-1 bg-white/[0.07] rounded-xl p-2.5 text-center">
                    <div className="font-extrabold text-white text-[17px] font-heading">
                      ₹२.४L
                    </div>
                    <div className="text-[9px] text-white/40 font-body">
                      फी जमा
                    </div>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.08] rounded overflow-hidden mb-1.5">
                  <div
                    className="h-full bg-gradient-to-r from-saffron to-gold rounded w-[78%]"
                  />
                </div>
                <div className="text-[10px] text-white/45 font-body">
                  💚 ३ विद्यार्थ्यांचे WhatsApp गेले
                </div>
              </div>
              <div className="bg-white/[0.09] border border-white/10 rounded-2xl p-3.5 -mt-3 ml-6 mr-[-24px] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
                <div className="text-[11px] text-white/60 font-body">
                  🔔 वार्षिक परीक्षा — १५ मार्चपासून
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/45 leading-relaxed italic font-body">
              &quot;शिक्षण म्हणजे सर्वात शक्तिशाली शस्त्र आहे जे तुम्ही जगाला
              बदलण्यासाठी वापरू शकता.&quot;
              <br />— नेल्सन मंडेला
            </p>
          </div>
        </div>

        {/* Right panel — Login form */}
        <div className="bg-cream flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 safe-area-padding">
          <div className="w-full max-w-[440px]">
            <h1 className="text-[28px] font-extrabold text-text-900 mb-1.5 font-heading">
              🙏 स्वागत आहे
            </h1>
            <p className="text-sm text-text-500 mb-8 font-body">
              तुमच्या शाळाConnect खात्यात प्रवेश करा
            </p>

            {/* Role selector */}
            <div className="mb-5 sm:mb-6">
              <span className="block text-[13px] font-semibold text-text-700 mb-3 font-body">
                तुम्ही कोण आहात?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl border-[1.5px] transition-all text-left min-h-[48px] touch-manipulation ${
                      role === r.id
                        ? "border-saffron bg-saffron-pale shadow-[0_0_0_3px_rgba(244,106,10,0.12)]"
                        : "border-border-school bg-white hover:border-saffron hover:shadow-sh-sm"
                    }`}
                  >
                    <span className="text-xl shrink-0">{r.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-text-900 truncate font-body">
                        {r.label}
                      </div>
                      <div className="text-[10px] text-text-300 font-body">
                        {r.sub}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form - native POST to API (cookies set on redirect response) */}
            <form
              action="/api/auth/login"
              method="POST"
              onSubmit={handleLogin}
              className="flex flex-col gap-3.5"
            >
              <input type="hidden" name="role" value={role} />
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-text-700 font-body">
                  मोबाईल नंबर / Email
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-300" />
                  <input
                    name="email"
                    type="text"
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder="९XXXXXXXXX किंवा email@example.com"
                    className="input-base pl-11"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-text-700 font-body">
                  पासवर्ड
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-300" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-base pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                  >
                    {showPassword ? (
                      <EyeOff className="w-[17px] h-[17px]" />
                    ) : (
                      <Eye className="w-[17px] h-[17px]" />
                    )}
                  </button>
                </div>
                <Link
                  href="/login/forgot-password"
                  className="text-xs text-saffron font-semibold text-right font-body"
                >
                  पासवर्ड विसरलात?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 sm:py-4 text-[14px] sm:text-[15px] min-h-[48px] disabled:opacity-70 touch-manipulation"
              >
                {loading ? "प्रवेश करत आहे..." : "आत जा →"}
              </button>
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#E5EEF6]" />
                <span className="text-[11px] text-text-300">किंवा</span>
                <div className="flex-1 h-px bg-[#E5EEF6]" />
              </div>
              <button
                type="button"
                onClick={handleBiometric}
                className="btn-secondary w-full py-3 sm:py-3.5 text-sm min-h-[44px] touch-manipulation"
              >
                <Fingerprint className="w-5 h-5" />
                Fingerprint / Face ID ने login करा
              </button>
            </form>

            <p className="text-xs text-text-300 text-center mt-5 font-body">
              नवीन शाळा?{" "}
              <Link
                href="/register"
                className="text-saffron font-semibold hover:underline"
              >
                मोफत नोंदणी करा →
              </Link>
            </p>
            <p className="text-[11px] text-text-300 text-center mt-4 font-body">
              🔒 SSL Encrypted · DPDP Compliant · Made in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
