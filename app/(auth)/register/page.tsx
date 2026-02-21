"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerSchoolWithHeadmaster } from "@/app/actions/register"
import { createClient } from "@/lib/supabase/client"
import toast from "react-hot-toast"
import { Building2, User, Mail, Lock, Phone, MapPin } from "lucide-react"

const SCHOOL_TYPES = [
  { value: "primary", label: "प्राथमिक" },
  { value: "secondary", label: "माध्यमिक" },
  { value: "higher_secondary", label: "उच्च माध्यमिक" },
  { value: "combined", label: "संयुक्त" },
] as const

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [school, setSchool] = useState({
    schoolName: "",
    district: "",
    taluka: "",
    udiseCode: "",
    schoolType: "primary" as const,
    address: "",
    phone: "",
    email: "",
  })
  const [headmaster, setHeadmaster] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  })

  const handleSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!school.schoolName.trim() || !school.district.trim() || !school.taluka.trim()) {
      toast.error("शाळेचे नाव, जिल्हा आणि तालुका भरा")
      return
    }
    setStep(2)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (headmaster.password !== headmaster.confirmPassword) {
      toast.error("पासवर्ड जुळत नाही")
      return
    }
    if (headmaster.password.length < 6) {
      toast.error("पासवर्ड किमान ६ अक्षरे असावे")
      return
    }

    setLoading(true)
    try {
      const result = await registerSchoolWithHeadmaster(
        {
          schoolName: school.schoolName,
          district: school.district,
          taluka: school.taluka,
          udiseCode: school.udiseCode || undefined,
          schoolType: school.schoolType,
          address: school.address || undefined,
          phone: school.phone || undefined,
          email: school.email || undefined,
        },
        {
          name: headmaster.name,
          email: headmaster.email,
          password: headmaster.password,
          phone: headmaster.phone || undefined,
        }
      )

      if (result.success) {
        toast.success("नोंदणी यशस्वी!")
        // Brief delay for Supabase to propagate new user, then auto-login
        await new Promise((r) => setTimeout(r, 800))
        try {
          const supabase = createClient()
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email: headmaster.email,
            password: headmaster.password,
          })
          if (!signInError) {
            await supabase.auth.updateUser({ data: { role: "headmaster" } }).catch(() => {})
            window.location.href = "/dashboard/headmaster"
            return
          }
        } catch {
          // Fall through to login redirect
        }
        toast.success("नोंदणी यशस्वी! आता लॉगिन करा.")
        window.location.href = "/login?registered=true"
      } else {
        toast.error(result.error || "नोंदणी अयशस्वी")
      }
    } catch {
      toast.error("काहीतरी चूक झाली")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left panel — desktop only, matches login */}
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
                <div className="font-extrabold text-white text-xl font-[family-name:var(--font-noto-devanagari)]">
                  शाळा<span className="text-saffron-bright">Connect</span>
                </div>
                <div className="text-[9px] text-white/35 tracking-[2.5px] uppercase font-semibold">
                  Maharashtra Edu Platform
                </div>
              </div>
            </Link>
          </div>
          <div className="relative z-10 flex-1 flex items-center justify-center py-10">
            <div className="w-full max-w-[340px]">
              <div className="bg-white/[0.07] border border-white/10 rounded-[20px] p-6 shadow-2xl shadow-black/35">
                <div className="font-bold text-white text-sm mb-3 font-[family-name:var(--font-noto-devanagari)]">
                  🚀 ३० दिवस मोफत
                </div>
                <p className="text-[13px] text-white/60 leading-relaxed font-[family-name:var(--font-noto-devanagari)]">
                  नोंदणी केल्यानंतर तुम्हाला मोफत ३० दिवसांचा पूर्ण अॅक्सेस मिळेल. क्रेडिट कार्ड नको.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white/70 text-xs font-[family-name:var(--font-noto-devanagari)]">
                    <span>✓</span> हजेरी, फी, अहवाल — सर्व मॉड्यूल्स
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-[family-name:var(--font-noto-devanagari)]">
                    <span>✓</span> WhatsApp अलर्ट्स
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-xs font-[family-name:var(--font-noto-devanagari)]">
                    <span>✓</span> U-DISE / RTE अहवाल
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-sm text-white/45 leading-relaxed italic font-[family-name:var(--font-noto-devanagari)]">
              &quot;शिक्षण म्हणजे सर्वात शक्तिशाली शस्त्र आहे जे तुम्ही जगाला बदलण्यासाठी वापरू शकता.&quot;
              <br />— नेल्सन मंडेला
            </p>
          </div>
        </div>

        {/* Right panel — Form */}
        <div className="bg-cream flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-border-school p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              शाळा नोंदणी
            </h1>
            <p className="text-sm text-text-500">
              Step {step} of 2
            </p>
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSchoolSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">
                शाळेचे नाव *
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="text"
                  value={school.schoolName}
                  onChange={(e) => setSchool({ ...school, schoolName: e.target.value })}
                  placeholder="उदा. पुणे विद्यामंदिर"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">जिल्हा *</label>
                <input
                  type="text"
                  value={school.district}
                  onChange={(e) => setSchool({ ...school, district: e.target.value })}
                  placeholder="उदा. पुणे"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">तालुका *</label>
                <input
                  type="text"
                  value={school.taluka}
                  onChange={(e) => setSchool({ ...school, taluka: e.target.value })}
                  placeholder="उदा. पुणे शहर"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">UDISE कोड</label>
              <input
                type="text"
                value={school.udiseCode}
                onChange={(e) => setSchool({ ...school, udiseCode: e.target.value })}
                placeholder="उदा. 27123456789"
                className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">शाळेचा प्रकार</label>
              <select
                value={school.schoolType}
                onChange={(e) => setSchool({ ...school, schoolType: e.target.value as typeof school.schoolType })}
                className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
              >
                {SCHOOL_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">पत्ता</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="text"
                  value={school.address}
                  onChange={(e) => setSchool({ ...school, address: e.target.value })}
                  placeholder="शाळेचा पूर्ण पत्ता"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">फोन</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                  <input
                    type="tel"
                    value={school.phone}
                    onChange={(e) => setSchool({ ...school, phone: e.target.value })}
                    placeholder="९XXXXXXXXX"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">ईमेल</label>
                <input
                  type="email"
                  value={school.email}
                  onChange={(e) => setSchool({ ...school, email: e.target.value })}
                  placeholder="school@example.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl transition-all font-[family-name:var(--font-noto-devanagari)]"
            >
              पुढे →
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <p className="text-sm text-text-500 mb-4 font-[family-name:var(--font-noto-devanagari)]">
              मुख्याध्यापक खाते तयार करा (हे खाते शाळेचे व्यवस्थापन करेल)
            </p>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">नाव *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="text"
                  value={headmaster.name}
                  onChange={(e) => setHeadmaster({ ...headmaster, name: e.target.value })}
                  placeholder="मुख्याध्यापकाचे नाव"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">ईमेल *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="email"
                  value={headmaster.email}
                  onChange={(e) => setHeadmaster({ ...headmaster, email: e.target.value })}
                  placeholder="headmaster@school.edu.in"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">पासवर्ड *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="password"
                  value={headmaster.password}
                  onChange={(e) => setHeadmaster({ ...headmaster, password: e.target.value })}
                  placeholder="किमान ६ अक्षरे"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">पासवर्ड पुन्हा प्रविष्ट करा *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="password"
                  value={headmaster.confirmPassword}
                  onChange={(e) => setHeadmaster({ ...headmaster, confirmPassword: e.target.value })}
                  placeholder="पासवर्ड पुन्हा टाइप करा"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]">मोबाईल</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-300" />
                <input
                  type="tel"
                  value={headmaster.phone}
                  onChange={(e) => setHeadmaster({ ...headmaster, phone: e.target.value })}
                  placeholder="९XXXXXXXXX"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-border-school bg-cream text-text-900 outline-none focus:border-saffron font-[family-name:var(--font-noto-devanagari)]"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-4 rounded-full border-2 border-border-school text-text-700 font-semibold hover:border-saffron transition-colors font-[family-name:var(--font-noto-devanagari)]"
              >
                मागे
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl transition-all disabled:opacity-70 font-[family-name:var(--font-noto-devanagari)]"
              >
                {loading ? "नोंदणी करत आहे..." : "नोंदणी पूर्ण करा"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-text-500 mt-6 font-[family-name:var(--font-noto-devanagari)]">
          आधीच खाते आहे?{" "}
          <Link href="/login" className="text-saffron font-semibold hover:underline">
            लॉगिन करा
          </Link>
        </p>
      </div>
        </div>
      </div>
    </div>
  )
}
