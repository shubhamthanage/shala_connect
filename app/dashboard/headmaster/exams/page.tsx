import { redirect } from "next/navigation"
import { getHeadmasterSchoolId } from "@/app/actions/users"
import { createAdminClient } from "@/lib/supabase/admin"
import { EmptyState } from "@/components/ui/EmptyState"

export const dynamic = "force-dynamic"

export default async function ExamsPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const admin = createAdminClient()
  const { data: exams } = await admin
    .from("exams")
    .select("id, exam_name, subject, date, class_id, classes(grade, division)")
    .eq("school_id", schoolId)
    .order("date", { ascending: false })
    .limit(20)

  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📝 परीक्षा व्यवस्थापन
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="card-elevated overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border-school">
            <span className="font-bold text-text-900 text-sm font-heading">
              परीक्षा यादी
            </span>
          </div>
          {!exams || exams.length === 0 ? (
            <EmptyState
              icon="📝"
              title="अजून परीक्षा नाहीत"
              description="परीक्षा व्यवस्थापन लवकरच उपलब्ध होईल. आत्तासाठी विद्यार्थी आणि शुल्क व्यवस्थापित करा."
              actionLabel="विद्यार्थी पहा"
              actionHref="/dashboard/headmaster/students"
            />
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    परीक्षा
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    विषय
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    वर्ग
                  </th>
                  <th className="text-[10px] font-bold uppercase tracking-wider text-text-300 px-4 py-2 text-left border-b border-border-school bg-cream font-body">
                    तारीख
                  </th>
                </tr>
              </thead>
              <tbody>
                {exams.map((e) => {
                  const cls = e.classes as { grade?: number; division?: string } | null
                  return (
                    <tr key={e.id} className="hover:bg-saffron-pale/50">
                      <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                        {e.exam_name}
                      </td>
                      <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                        {e.subject ?? "—"}
                      </td>
                      <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                        {cls ? `इ.${cls.grade}वी ${cls.division}` : "—"}
                      </td>
                      <td className="text-xs text-text-700 px-4 py-2.5 border-b border-border-school font-body">
                        {e.date ? new Date(e.date).toLocaleDateString("mr-IN") : "—"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
