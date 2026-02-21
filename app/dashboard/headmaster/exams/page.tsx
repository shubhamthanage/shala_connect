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
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            📝 परीक्षा व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">परीक्षा वेळापत्रक व निकाल</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">लवकरच उपलब्ध होईल</h3>
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] text-sm max-w-sm mx-auto">परीक्षा व्यवस्थापन मॉड्यूल तयार होत आहे.</p>
        </div>
      </div>
    </>
  )
}
