"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Lock, Eye, EyeOff } from "lucide-react"

function LeftPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-navy-2 to-slate-2 p-12 relative overflow-hidden">
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
        <div className="text-center">
          <div className="text-5xl mb-4">🔑</div>
          <p className="text-white/80 text-sm font-body">
            नवीन पासवर्ड सेट करा आणि तुमच्या खात्यात प्रवेश करा.
          </p>
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
  )
}

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash
    if (!hash || !hash.includes("type=recovery")) {
      setInvalidLink(true)
    }
    setReady(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (password.length < 6) {
      setError("पासवर्ड किमान ६ अक्षरे असावे")
      return
    }
    if (password !== confirmPassword) {
      setError("दोन्ही पासवर्ड जुळत नाहीत")
      return
    }
    if (!isSupabaseConfigured()) {
      setError("Supabase कॉन्फिगर करा.")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.updateUser({ password })
      if (err) throw err
      setSuccess(true)
      setTimeout(() => router.push("/login?reset=success"), 2000)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "पासवर्ड अपडेट अयशस्वी. लिंक कालबाह्य झाला असू शकते."
      )
    } finally {
      setLoading(false)
    }
  }

  if (!ready) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-white/60 font-body">
          लोड होत आहे...
        </div>
      </div>
    )
  }

  if (invalidLink) {
    return (
      <div className="min-h-screen bg-navy flex flex-col">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          <LeftPanel />
          <div className="bg-cream flex items-center justify-center p-12">
            <div className="w-full max-w-[440px] text-center">
              <h1 className="text-[28px] font-extrabold text-text-900 mb-4 font-heading">
                अवैध किंवा कालबाह्य लिंक
              </h1>
              <p className="text-sm text-text-500 mb-6 font-body">
                हा reset लिंक वापरला गेला आहे किंवा कालबाह्य झाला आहे. कृपया नवीन reset link मागवा.
              </p>
              <Link
                href="/login/forgot-password"
                className="inline-flex items-center gap-2 text-saffron font-semibold hover:underline font-body"
              >
                पासवर्ड रीसेट करा
              </Link>
              <Link
                href="/login"
                className="block mt-6 text-sm text-text-500 hover:text-saffron font-body"
              >
                ← लॉगिनवर परत जा
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <LeftPanel />
        <div className="bg-cream flex items-center justify-center p-12">
          <div className="w-full max-w-[440px]">
            <h1 className="text-[28px] font-extrabold text-text-900 mb-1.5 font-heading">
              नवीन पासवर्ड सेट करा
            </h1>
            <p className="text-sm text-text-500 mb-8 font-body">
              तुमचा नवीन पासवर्ड प्रविष्ट करा
            </p>

            {success ? (
              <div className="rounded-xl border-2 border-green-500/30 bg-green-50 p-6 font-body">
                <div className="font-bold text-green-800 text-base mb-2">
                  ✅ पासवर्ड अपडेट झाला!
                </div>
                <p className="text-sm text-green-700">
                  तुम्हाला लॉगिन पृष्ठावर नेण्यात आले आहे...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-700 font-body">
                    नवीन पासवर्ड
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-300" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-border-school bg-white text-text-900 text-sm outline-none transition-colors focus:border-saffron focus:shadow-[0_0_0_3px_rgba(244,106,10,0.1)] font-body placeholder:text-text-300"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                    >
                      {showPassword ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-700 font-body">
                    पासवर्ड पुन्हा प्रविष्ट करा
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-300" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-border-school bg-white text-text-900 text-sm outline-none transition-colors focus:border-saffron focus:shadow-[0_0_0_3px_rgba(244,106,10,0.1)] font-body placeholder:text-text-300"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-300 hover:text-text-500"
                    >
                      {showConfirm ? <EyeOff className="w-[17px] h-[17px]" /> : <Eye className="w-[17px] h-[17px]" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-600 font-body">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-saffron/30 hover:shadow-xl hover:shadow-saffron/45 hover:-translate-y-0.5 transition-all disabled:opacity-70 font-body"
                >
                  {loading ? "सेट करत आहे..." : "पासवर्ड सेट करा"}
                </button>
              </form>
            )}

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm text-saffron font-semibold hover:underline font-body"
            >
              ← लॉगिनवर परत जा
            </Link>

            <p className="text-[11px] text-text-300 text-center mt-8 font-body">
              🔒 SSL Encrypted · DPDP Compliant · Made in India 🇮🇳
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
