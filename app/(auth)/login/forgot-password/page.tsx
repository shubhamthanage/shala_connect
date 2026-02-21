"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { Mail } from "lucide-react"

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
          <div className="text-5xl mb-4">🔐</div>
          <p className="text-white/80 text-sm font-body">
            पासवर्ड विसरलात? तुमचा ईमेल टाका आणि आम्ही reset link पाठवतो.
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!email.trim()) {
      setError("ईमेल प्रविष्ट करा")
      return
    }
    if (!isSupabaseConfigured()) {
      setError("Supabase कॉन्फिगर करा. .env.local मध्ये NEXT_PUBLIC_SUPABASE_URL आणि NEXT_PUBLIC_SUPABASE_ANON_KEY सेट करा.")
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/login/reset-password`,
      })
      if (err) throw err
      setSuccess(true)
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "ईमेल पाठवताना त्रुटी झाली. पुन्हा प्रयत्न करा."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <LeftPanel />
        <div className="bg-cream flex items-center justify-center p-12">
          <div className="w-full max-w-[440px]">
            <h1 className="text-[28px] font-extrabold text-text-900 mb-1.5 font-heading">
              पासवर्ड रीसेट करा
            </h1>
            <p className="text-sm text-text-500 mb-8 font-body">
              तुमचा ईमेल टाका — आम्ही reset link पाठवतो
            </p>

            {success ? (
              <div className="rounded-xl border-2 border-green-500/30 bg-green-50 p-6 font-body">
                <div className="font-bold text-green-800 text-base mb-2">
                  ✅ Reset link पाठवला!
                </div>
                <p className="text-sm text-green-700 mb-1">
                  तुमच्या <strong>{email}</strong> वर reset link पाठवला आहे.
                </p>
                <p className="text-sm text-green-700">
                  ईमेल तपासा आणि link वर click करा.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-text-700 font-body">
                    ईमेल
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[17px] h-[17px] text-text-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-white text-text-900 text-sm outline-none transition-colors focus:border-saffron focus:shadow-[0_0_0_3px_rgba(244,106,10,0.1)] font-body placeholder:text-text-300"
                      disabled={loading}
                    />
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
                  {loading ? "पाठवत आहे..." : "Reset Link पाठवा"}
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
