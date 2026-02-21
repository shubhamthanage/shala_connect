"use client"

import toast from "react-hot-toast"

export interface ClassFeeRow {
  grade: number
  division: string
  totalStudents: number
  collected: number
  pending: number
  pendingCount: number
}

export interface DefaulterRow {
  id: string
  name: string
  rollNumber: string | null
  classLabel: string
  pendingAmount: number
  parentPhone: string | null
}

export function FeeTable({
  classWiseStatus,
  defaulters,
}: {
  classWiseStatus: ClassFeeRow[]
  defaulters: DefaulterRow[]
}) {
  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }

  const handleComingSoon = () => {
    toast("लवकरच उपलब्ध", { icon: "🔜" })
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-school">
          <span className="font-bold text-text-900 text-sm font-heading">
            वर्गनिहाय शुल्क स्थिती
          </span>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                वर्ग
              </th>
              <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                विद्यार्थी
              </th>
              <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                जमा
              </th>
              <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                थकित
              </th>
              <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                रक्कम
              </th>
            </tr>
          </thead>
          <tbody>
            {classWiseStatus.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-text-500 text-sm font-body">
                  अजून वर्ग नाहीत
                </td>
              </tr>
            ) : (
              classWiseStatus.map((row) => (
                <tr key={`${row.grade}-${row.division}`} className="hover:bg-saffron-pale/50">
                  <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                    इ.{row.grade}वी {row.division}
                  </td>
                  <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                    {row.totalStudents}
                  </td>
                  <td className="text-xs text-green-mid font-semibold px-4 py-2.5 border-b border-border-school font-body">
                    {formatCurrency(row.collected)}
                  </td>
                  <td
                    className={`text-xs px-4 py-2.5 border-b border-border-school font-bold font-body ${
                      row.pendingCount > 10 ? "text-red-500" : "text-saffron"
                    }`}
                  >
                    {row.pendingCount}
                  </td>
                  <td
                    className={`text-xs px-4 py-2.5 border-b border-border-school font-bold font-body ${
                      row.pending > 20000 ? "text-red-500" : "text-text-700"
                    }`}
                  >
                    {formatCurrency(row.pending)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl border border-border-school overflow-hidden mt-5">
        <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
          <span className="font-bold text-text-900 text-sm font-heading">
            थकित विद्यार्थी
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                  नाव
                </th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                  वर्ग
                </th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                  थकित रक्कम
                </th>
                <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                  क्रिया
                </th>
              </tr>
            </thead>
            <tbody>
              {defaulters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-text-500 text-sm font-body">
                    थकित विद्यार्थी नाहीत
                  </td>
                </tr>
              ) : (
                defaulters.slice(0, 20).map((d) => (
                  <tr key={d.id} className="hover:bg-saffron-pale/50">
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {d.name} {d.rollNumber ? `(${d.rollNumber})` : ""}
                    </td>
                    <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                      {d.classLabel}
                    </td>
                    <td className="text-xs text-red-500 font-bold px-4 py-2.5 border-b border-border-school font-body">
                      ₹{d.pendingAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="text-xs px-4 py-2.5 border-b border-border-school">
                      <div className="flex gap-2">
                        <button
                          onClick={handleComingSoon}
                          className="px-3 py-1.5 rounded-lg bg-saffron text-white text-[11px] font-semibold hover:bg-saffron-bright font-body"
                        >
                          भरा
                        </button>
                        <button
                          onClick={handleComingSoon}
                          className="px-3 py-1.5 rounded-lg border border-border-school text-text-700 text-[11px] font-semibold hover:border-saffron hover:text-saffron font-body"
                        >
                          Reminder पाठवा
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
