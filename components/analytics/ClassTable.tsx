"use client"
import { EmptyState } from "@/components/ui/EmptyState"

export interface ClassPerformanceRow {
  grade: number
  division: string
  students: number
  attendance: number
  avgMarks: number
  status: string
}

interface ClassTableProps {
  data: ClassPerformanceRow[]
}

function getStatusChip(status: string) {
  if (status.includes("उत्तम"))
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-pale text-green-mid font-body">
        🏆 उत्तम
      </span>
    )
  if (status.includes("चांगले"))
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-saffron-pale text-saffron font-body">
        ✅ चांगले
      </span>
    )
  if (status.includes("लक्ष द्या"))
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 font-body">
        ⚠️ लक्ष द्या
      </span>
    )
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600 font-body">
      ⚠️ सुधारणा हवी
    </span>
  )
}

function getAttendanceStyle(att: number) {
  if (att >= 90) return "bg-green-pale text-green-mid"
  if (att >= 85) return "bg-saffron-pale text-saffron"
  if (att >= 75) return "bg-amber-100 text-amber-700"
  return "bg-red-50 text-red-500"
}

export function ClassTable({ data }: ClassTableProps) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border-school flex justify-between items-center">
        <span className="font-bold text-text-900 text-sm font-heading">
          📚 वर्गनिहाय कामगिरी
        </span>
        <a
          href="/dashboard/headmaster/students"
          className="text-saffron text-xs font-semibold hover:underline font-body"
        >
          सर्व पहा →
        </a>
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
              हजेरी%
            </th>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
              सरासरी गुण
            </th>
            <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
              स्थिती
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-0">
                <EmptyState
                  icon="📚"
                  title="अजून वर्ग नाहीत"
                  description="वर्ग जोडल्यावर विद्यार्थी आणि हजेरी व्यवस्थापित करता येईल."
                  actionLabel="वर्ग जोडा"
                  actionHref="/dashboard/headmaster/classes/add"
                />
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={`${row.grade}-${row.division}`} className="hover:bg-saffron-pale/50">
                <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                  इ.{row.grade}वी {row.division}
                </td>
                <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                  {row.students}
                </td>
                <td className="text-xs px-4 py-2.5 border-b border-border-school">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${getAttendanceStyle(row.attendance)} font-body`}
                  >
                    {row.attendance}%
                  </span>
                </td>
                <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                  {row.avgMarks}%
                </td>
                <td className="text-xs px-4 py-2.5 border-b border-border-school">
                  {getStatusChip(row.status)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
