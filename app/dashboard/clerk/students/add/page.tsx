"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { addUser } from "@/app/actions/register"
import { getClerkSchoolId, getSchoolClasses, getSchoolStudents } from "@/app/actions/users"
import toast from "react-hot-toast"
import { UserPlus, ArrowLeft } from "lucide-react"

const ROLES = [
  { value: "student", label: "विद्यार्थी", emoji: "👦" },
  { value: "parent", label: "पालक", emoji: "👨‍👩‍👦" },
] as const

type Role = (typeof ROLES)[number]["value"]

interface Class {
  id: string
  grade: number
  division: string
  academic_year: string
}

interface Student {
  id: string
  name: string
  roll_number: string | null
  class_id: string | null
}

export default function ClerkAddStudentPage() {
  const router = useRouter()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    role: "student" as Role,
    name: "",
    email: "",
    password: "Test@1234",
    phone: "",
    classId: "",
    rollNumber: "",
    studentId: "",
    relation: "parent",
  })

  useEffect(() => {
    getClerkSchoolId()
      .then((id) => {
        if (id) {
          setSchoolId(id)
          getSchoolClasses(id).then(setClasses)
          getSchoolStudents(id).then(setStudents)
        } else {
          toast.error("शाळा आढळली नाही")
          // #region agent log
          fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H18',location:'app/dashboard/clerk/students/add/page.tsx:useEffect',message:'clerk add page redirecting to login due to missing school id',data:{hasSchoolId:false},timestamp:Date.now()})}).catch(()=>{})
          // #endregion
          router.push("/login")
        }
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "शाळा आढळली नाही")
        // #region agent log
        fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H18',location:'app/dashboard/clerk/students/add/page.tsx:useEffect',message:'clerk add page redirecting to login from school lookup error',data:{error:err instanceof Error?err.message:'unknown'},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        router.push("/login")
      })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schoolId) return
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      toast.error("नाव, ईमेल आणि पासवर्ड भरा")
      return
    }
    if (form.role === "student" && !form.classId) {
      toast.error("विद्यार्थीसाठी वर्ग निवडा")
      return
    }
    if (form.role === "parent" && !form.studentId) {
      toast.error("पालकासाठी विद्यार्थी निवडा")
      return
    }

    setLoading(true)
    try {
      const result = await addUser({
        role: form.role,
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        schoolId,
        classId: form.classId || undefined,
        rollNumber: form.rollNumber || undefined,
        studentId: form.studentId || undefined,
        relation: form.relation,
      })

      if (result.success) {
        toast.success(
          form.role === "student" ? "विद्यार्थी यशस्वीरित्या नोंदणी झाला!" : "पालक यशस्वीरित्या जोडला!"
        )
        setForm({
          ...form,
          name: "",
          email: "",
          password: "Test@1234",
          phone: "",
          classId: "",
          rollNumber: "",
          studentId: "",
        })
      } else {
        toast.error(result.error || "अयशस्वी")
      }
    } catch {
      toast.error("काहीतरी चूक झाली")
    } finally {
      setLoading(false)
    }
  }

  if (!schoolId) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-[60px] bg-white border-b border-border-school flex items-center px-6 flex-shrink-0 shadow-sm">
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">👨‍🎓 नवीन प्रवेश</div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-[#F4F7FB]">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)]">लोड होत आहे...</p>
          </div>
        </div>
      </div>
    )
  }

  const inputCls = "w-full px-4 py-3 rounded-xl border-2 border-border-school bg-white outline-none focus:border-saffron focus:shadow-[0_0_0_3px_rgba(244,106,10,0.08)] transition-all font-[family-name:var(--font-noto-devanagari)] text-sm text-text-900 placeholder:text-text-300"
  const labelCls = "block text-[13px] font-semibold text-text-700 mb-1.5 font-[family-name:var(--font-noto-devanagari)]"

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clerk"
            className="w-8 h-8 rounded-lg bg-[#F4F7FB] border border-border-school flex items-center justify-center hover:border-saffron transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-500" />
          </Link>
          <div>
            <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
              👨‍🎓 नवीन प्रवेश
            </div>
            <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">विद्यार्थी किंवा पालक नोंदणी</div>
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto bg-[#F4F7FB] p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-border-school p-8">
            <div className="flex items-center gap-3 mb-6 pb-5 border-b border-border-school">
              <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-saffron" />
              </div>
              <div>
                <h1 className="font-extrabold text-text-900 text-lg font-[family-name:var(--font-noto-devanagari)]">नवीन प्रवेश फॉर्म</h1>
                <p className="text-text-300 text-[12px] font-[family-name:var(--font-noto-devanagari)]">सर्व * आवश्यक माहिती भरा</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selector */}
              <div>
                <label className={labelCls}>प्रकार</label>
                <div className="grid grid-cols-2 gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setForm({ ...form, role: r.value, classId: "", studentId: "" })}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border-2 transition-all font-[family-name:var(--font-noto-devanagari)] text-sm font-medium ${
                        form.role === r.value
                          ? "border-saffron bg-saffron-pale text-text-900 shadow-[0_0_0_3px_rgba(244,106,10,0.08)]"
                          : "border-border-school bg-white text-text-500 hover:border-saffron/50"
                      }`}
                    >
                      <span className="text-xl">{r.emoji}</span>
                      <span>{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className={labelCls}>नाव *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="पूर्ण नाव"
                  className={inputCls}
                  required
                />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>ईमेल *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@example.com"
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>मोबाईल</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="९XXXXXXXXX"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className={labelCls}>पासवर्ड *</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="किमान ६ अक्षरे"
                  className={inputCls}
                  required
                  minLength={6}
                />
                <p className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
                  डीफॉल्ट: Test@1234 — वापरकर्ता नंतर बदलू शकतो
                </p>
              </div>

              {form.role === "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>वर्ग *</label>
                    <select
                      value={form.classId}
                      onChange={(e) => setForm({ ...form, classId: e.target.value })}
                      className={inputCls}
                      required
                    >
                      <option value="">वर्ग निवडा</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          इ.{c.grade}वी {c.division} ({c.academic_year})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>रोल नंबर</label>
                    <input
                      type="text"
                      value={form.rollNumber}
                      onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                      placeholder="उदा. २१"
                      className={inputCls}
                    />
                  </div>
                </div>
              )}

              {form.role === "parent" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>विद्यार्थी *</label>
                    <select
                      value={form.studentId}
                      onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                      className={inputCls}
                      required
                    >
                      <option value="">विद्यार्थी निवडा</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} {s.roll_number ? `(${s.roll_number})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>नाते</label>
                    <select
                      value={form.relation}
                      onChange={(e) => setForm({ ...form, relation: e.target.value })}
                      className={inputCls}
                    >
                      <option value="mother">आई</option>
                      <option value="father">वडील</option>
                      <option value="parent">पालक</option>
                      <option value="guardian">पालक (इतर)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <Link
                  href="/dashboard/clerk"
                  className="flex-1 py-3.5 rounded-full border-2 border-border-school text-text-700 font-semibold text-[15px] text-center hover:border-saffron hover:text-saffron transition-all font-[family-name:var(--font-noto-devanagari)]"
                >
                  रद्द करा
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold text-[15px] shadow-md shadow-saffron/30 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-70 font-[family-name:var(--font-noto-devanagari)]"
                >
                  {loading ? "जोडत आहे..." : "नोंदणी करा →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
