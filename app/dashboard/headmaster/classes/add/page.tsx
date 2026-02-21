"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getHeadmasterSchoolId, getSchoolClasses, addClass } from "@/app/actions/users"
import toast from "react-hot-toast"
import { BookOpen, ArrowLeft } from "lucide-react"

const DIVISIONS = ["A", "B", "C", "D"]

export default function AddClassPage() {
  const router = useRouter()
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const [existingClasses, setExistingClasses] = useState<{ grade: number; division: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    grade: 1,
    division: "A",
    academicYear: "2024-25",
  })

  useEffect(() => {
    getHeadmasterSchoolId().then((id) => {
      if (id) {
        setSchoolId(id)
        getSchoolClasses(id).then((classes) =>
          setExistingClasses(classes.map((c) => ({ grade: c.grade, division: c.division })))
        )
      } else {
        toast.error("शाळा आढळली नाही")
        router.push("/login")
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schoolId) return

    const exists = existingClasses.some(
      (c) => c.grade === form.grade && c.division === form.division
    )
    if (exists) {
      toast.error("हा वर्ग आधीच अस्तित्वात आहे")
      return
    }

    setLoading(true)
    try {
      const result = await addClass(
        schoolId,
        form.grade,
        form.division,
        form.academicYear
      )
      if (result.success) {
        toast.success("वर्ग यशस्वीरित्या जोडला!")
        setExistingClasses((prev) => [
          ...prev,
          { grade: form.grade, division: form.division },
        ])
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
          <BookOpen className="w-6 h-6 text-saffron" />
          वर्ग जोडा
        </h1>
        <p className="text-text-500 mb-6 font-body">
          नवीन वर्ग तयार करा
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-text-700 mb-2 font-body">इयत्ता</label>
            <select
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: parseInt(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((g) => (
                <option key={g} value={g}>
                  इ. {g}वी
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-2 font-body">विभाग</label>
            <div className="flex gap-2">
              {DIVISIONS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setForm({ ...form, division: d })}
                  className={`flex-1 py-3 rounded-xl border-2 transition-all font-body ${
                    form.division === d
                      ? "border-saffron bg-saffron-pale"
                      : "border-border-school hover:border-saffron"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-700 mb-1.5 font-body">शैक्षणिक वर्ष</label>
            <input
              type="text"
              value={form.academicYear}
              onChange={(e) => setForm({ ...form, academicYear: e.target.value })}
              placeholder="2024-25"
              className="w-full px-4 py-3 rounded-xl border-2 border-border-school bg-cream outline-none focus:border-saffron font-body"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl transition-all disabled:opacity-70 font-body"
          >
            {loading ? "जोडत आहे..." : "वर्ग जोडा"}
          </button>
        </form>
      </div>
    </div>
  )
}
