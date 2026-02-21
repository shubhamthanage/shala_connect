"use client"

import Link from "next/link"
import { useState } from "react"
import toast from "react-hot-toast"

export interface FeeDefaulterRow {
  grade: number
  division: string
  totalStudents: number
  pendingCount: number
  pendingAmount: number
}

interface FeeDefaultersProps {
  data: FeeDefaulterRow[]
  totalStudents: number
  totalPending: number
  schoolId: string
}

export function FeeDefaulters({ data, totalStudents, totalPending, schoolId }: FeeDefaultersProps) {
  const [sending, setSending] = useState(false)

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }

  const rows = data.filter((r) => r.grade > 0)
  const totalRow = data.find((r) => r.grade === 0)

  const handleReminderBulk = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/fees/send-bulk-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school_id: schoolId }),
      })
      const result = await res.json()
      if (result.success) {
        toast.success(`Reminder ${result.sent ?? 0} पालकांना पाठवला`)
      } else {
        toast.error(result.error || "Reminder अयशस्वी")
      }
    } catch {
      toast.error("Reminder अयशस्वी")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
        <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
          💰 शुल्क थकबाकी — वर्गनिहाय
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReminderBulk}
            disabled={sending || (totalRow?.pendingCount ?? 0) === 0}
            className="px-3 py-1.5 rounded-lg bg-saffron text-white text-[11px] font-semibold hover:bg-saffron-bright disabled:opacity-50 disabled:cursor-not-allowed font-[family-name:var(--font-noto-devanagari)]"
          >
            {sending ? "पाठवत आहे..." : "Reminder पाठवा"}
          </button>
          <Link
            href="/dashboard/headmaster/fees"
            className="text-saffron text-xs font-semibold hover:underline font-[family-name:var(--font-noto-devanagari)]"
          >
            शुल्क पहा →
          </Link>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
              वर्ग
            </th>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
              एकूण
            </th>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
              थकित
            </th>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-[family-name:var(--font-plus-jakarta)]">
              रक्कम
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-text-500 text-sm font-[family-name:var(--font-noto-devanagari)]">
                अजून वर्ग नाहीत.
              </td>
            </tr>
          ) : (
            <>
              {rows.map((row) => (
                <tr key={`${row.grade}-${row.division}`} className="hover:bg-saffron-pale/50">
                  <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                    इ.{row.grade}वी {row.division}
                  </td>
                  <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-[family-name:var(--font-noto-devanagari)]">
                    {row.totalStudents}
                  </td>
                  <td
                    className={`text-xs px-4 py-2.5 border-b border-border-school font-bold font-[family-name:var(--font-noto-devanagari)] ${
                      row.pendingCount > 10 ? "text-red-500" : "text-saffron"
                    }`}
                  >
                    {row.pendingCount}
                  </td>
                  <td
                    className={`text-xs px-4 py-2.5 border-b border-border-school font-bold font-[family-name:var(--font-noto-devanagari)] ${
                      row.pendingAmount > 20000 ? "text-red-500" : "text-text-700"
                    }`}
                  >
                    {formatCurrency(row.pendingAmount)}
                  </td>
                </tr>
              ))}
              {totalRow && rows.length > 0 && (
                <tr className="bg-cream font-semibold">
                  <td className="text-xs text-text-900 px-4 py-2.5 font-[family-name:var(--font-noto-devanagari)]">
                    एकूण
                  </td>
                  <td className="text-xs text-text-900 px-4 py-2.5 font-[family-name:var(--font-noto-devanagari)]">
                    {totalStudents}
                  </td>
                  <td className="text-xs text-red-500 px-4 py-2.5 font-extrabold font-[family-name:var(--font-noto-devanagari)]">
                    {totalRow.pendingCount}
                  </td>
                  <td className="text-xs text-red-500 px-4 py-2.5 font-extrabold font-[family-name:var(--font-noto-devanagari)]">
                    {formatCurrency(totalPending)}
                  </td>
                </tr>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}
