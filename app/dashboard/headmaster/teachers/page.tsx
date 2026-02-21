import { redirect } from "next/navigation"
import { getHeadmasterSchoolId, getSchoolTeachers } from "@/app/actions/users"
import { EmptyState } from "@/components/ui/EmptyState"

export default async function TeachersPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const teachers = await getSchoolTeachers(schoolId)

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            👩‍🏫 शिक्षक व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">शाळेतील सर्व शिक्षक</div>
        </div>
        <Link
          href="/dashboard/headmaster/users/add"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
        >
          + शिक्षक जोडा
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">👩‍🏫</div>
          <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">
            लवकरच उपलब्ध होईल
          </h3>
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] mb-5 text-sm max-w-sm mx-auto">
            शिक्षक व्यवस्थापन मॉड्यूल तयार होत आहे.
          </p>
          <Link
            href="/dashboard/headmaster/users/add"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            + शिक्षक जोडा →
          </Link>
        </div>
      </div>
    </>
  )
}
