"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { addUser } from "@/app/actions/register"
import { getHeadmasterSchoolId, getSchoolClasses, getSchoolStudents } from "@/app/actions/users"
import toast from "react-hot-toast"
import { UserPlus, ArrowLeft } from "lucide-react"

const ROLES = [
  { value: "teacher", label: "शिक्षक", emoji: "👩‍🏫" },
  { value: "clerk", label: "कारकून", emoji: "🧑‍💻" },
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

export default function AddUserPage() {
  const router = useRouter()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    role: "teacher" as Role,
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
    getHeadmasterSchoolId().then((id) => {
      if (id) {
        setSchoolId(id)
        getSchoolClasses(id).then(setClasses)
        getSchoolStudents(id).then(setStudents)
      } else {
        toast.error("शाळा आढळली नाही")
        // #region agent log
        fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H20',location:'app/dashboard/headmaster/users/add/page.tsx:useEffect',message:'headmaster user add redirecting to login due to missing school id',data:{hasSchoolId:false},timestamp:Date.now()})}).catch(()=>{})
        // #endregion
        router.push("/login")
      }
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
        toast.success(`${form.role === "teacher" ? "शिक्षक" : form.role === "clerk" ? "कारकून" : form.role === "student" ? "विद्यार्थी" : "पालक"} यशस्वीरित्या जोडला!`)
        setForm({
          role: form.role,
          name: "",
          email: "",
          password: "Test@1234",
          phone: "",
          classId: "",
          rollNumber: "",
          studentId: "",
          relation: form.relation,
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
      <div className="p-8 flex justify-center">
        <div className="animate-pulse text-text-500">लोड होत आहे...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <a
        href="/dashboard/headmaster"
        className="inline-flex items-center gap-2 text-text-500 hover:text-saffron mb-6 font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        मागे
      </a>

      <div className="bg-white rounded-2xl shadow-lg border border-border-school p-8">
        <h1 className="text-2xl font-extrabold text-text-900 mb-2 font-body flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-saffron" />
          वापरकर्ता जोडा
        </h1>
        <p className="text-text-500 mb-6 font-body">
          शिक्षक, कारकून, विद्यार्थी किंवा पालक जोडा
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-700 mb-2 font-body">भूमिका</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value, classId: "", studentId: "" })}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all font-body ${
                    form.role === r.value
                      ? "border-saffron bg-saffron-pale"
                      : "border-border-school hover:border-saffron"
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">नाव *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="पूर्ण नाव"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">ईमेल *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">पासवर्ड *</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="किमान ६ अक्षरे"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
              required
              minLength={6}
            />
            <p className="text-xs text-text-300 mt-1">डीफॉल्ट: Test@1234</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">मोबाईल</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="९XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
            />
          </div>

          {form.role === "student" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">वर्ग *</label>
                <select
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
                  required
                >
                  <option value="">वर्ग निवडा</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      इ. {c.grade}वी {c.division} ({c.academic_year})
                    </option>
                  ))}
                  {classes.length === 0 && (
                    <option value="" disabled>प्रथम वर्ग तयार करा</option>
                  )}
                </select>
                {classes.length === 0 && (
                  <p className="text-sm text-text-500 mt-1 font-body">
                    <a href="/dashboard/headmaster/classes/add" className="text-saffron hover:underline">
                      वर्ग जोडा
                    </a>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">रोल नंबर</label>
                <input
                  type="text"
                  value={form.rollNumber}
                  onChange={(e) => setForm({ ...form, rollNumber: e.target.value })}
                  placeholder="उदा. १"
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
                />
              </div>
            </>
          )}

          {form.role === "parent" && (
            <>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">विद्यार्थी *</label>
                <select
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
                  required
                >
                  <option value="">विद्यार्थी निवडा</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.roll_number ? `(${s.roll_number})` : ""}
                    </option>
                  ))}
                  {students.length === 0 && (
                    <option value="" disabled>प्रथम विद्यार्थी जोडा</option>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">नाते</label>
                <select
                  value={form.relation}
                  onChange={(e) => setForm({ ...form, relation: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
                >
                  <option value="parent">पालक</option>
                  <option value="mother">आई</option>
                  <option value="father">वडील</option>
                  <option value="guardian">पालक</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl transition-all disabled:opacity-70 font-body"
          >
            {loading ? "जोडत आहे..." : "वापरकर्ता जोडा"}
          </button>
        </form>
      </div>
    </div>
  )
}
