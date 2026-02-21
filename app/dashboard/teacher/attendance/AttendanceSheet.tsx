"use client"

import { useState } from "react"
import { saveAttendance } from "@/app/actions/attendance"
import toast from "react-hot-toast"
import type { AttendanceStudent } from "@/app/actions/attendance"

interface AttendanceSheetProps {
  classId: string
  classLabel: string
  students: AttendanceStudent[]
  date: string
}

export function AttendanceSheet({ classId, classLabel, students, date }: AttendanceSheetProps) {
  const [records, setRecords] = useState<Record<string, "present" | "absent" | "late">>(() => {
    const m: Record<string, "present" | "absent" | "late"> = {}
    for (const s of students) {
      m[s.id] = s.status
    }
    return m
  })
  const [saving, setSaving] = useState(false)

  const handleStatusChange = (studentId: string, status: "present" | "absent" | "late") => {
    setRecords((prev) => ({ ...prev, [studentId]: status }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const result = await saveAttendance(
        classId,
        date,
        Object.entries(records).map(([studentId, status]) => ({ studentId, status }))
      )
      if (result.success) {
        toast.success("हजेरी जतन झाली!")
      } else {
        toast.error(result.error || "जतन अयशस्वी")
      }
    } catch {
      toast.error("काहीतरी चूक झाली")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-5 py-4 border-b border-border-school flex justify-between items-center">
        <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
          {classLabel} — आजची हजेरी
        </span>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl disabled:opacity-70 font-[family-name:var(--font-noto-devanagari)]"
        >
          {saving ? "जतन करत आहे..." : "जतन करा"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cream">
              <th className="text-[10px] font-bold uppercase text-text-300 px-4 py-2 text-left font-[family-name:var(--font-noto-devanagari)]">
                रोल
              </th>
              <th className="text-[10px] font-bold uppercase text-text-300 px-4 py-2 text-left font-[family-name:var(--font-noto-devanagari)]">
                नाव
              </th>
              <th className="text-[10px] font-bold uppercase text-text-300 px-4 py-2 text-left font-[family-name:var(--font-noto-devanagari)]">
                हजर
              </th>
              <th className="text-[10px] font-bold uppercase text-text-300 px-4 py-2 text-left font-[family-name:var(--font-noto-devanagari)]">
                उशीर
              </th>
              <th className="text-[10px] font-bold uppercase text-text-300 px-4 py-2 text-left font-[family-name:var(--font-noto-devanagari)]">
                गैरहजर
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-border-school hover:bg-saffron-pale/30">
                <td className="px-4 py-2.5 text-xs text-text-700 font-[family-name:var(--font-noto-devanagari)]">
                  {s.rollNumber ?? "—"}
                </td>
                <td className="px-4 py-2.5 text-xs text-text-700 font-[family-name:var(--font-noto-devanagari)]">
                  {s.name}
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, "present")}
                    className={`w-10 h-10 rounded-lg border-2 font-bold text-sm font-[family-name:var(--font-noto-devanagari)] transition-all ${
                      records[s.id] === "present"
                        ? "border-green-500 bg-green-100 text-green-700"
                        : "border-border-school hover:border-green-400"
                    }`}
                  >
                    ✓
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, "late")}
                    className={`w-10 h-10 rounded-lg border-2 font-bold text-sm font-[family-name:var(--font-noto-devanagari)] transition-all ${
                      records[s.id] === "late"
                        ? "border-amber-500 bg-amber-100 text-amber-700"
                        : "border-border-school hover:border-amber-400"
                    }`}
                  >
                    L
                  </button>
                </td>
                <td className="px-4 py-2.5">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(s.id, "absent")}
                    className={`w-10 h-10 rounded-lg border-2 font-bold text-sm font-[family-name:var(--font-noto-devanagari)] transition-all ${
                      records[s.id] === "absent"
                        ? "border-red-500 bg-red-100 text-red-700"
                        : "border-border-school hover:border-red-400"
                    }`}
                  >
                    ✗
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
