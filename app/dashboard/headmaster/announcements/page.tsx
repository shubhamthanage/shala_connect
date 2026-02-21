import { redirect } from "next/navigation"
import { getHeadmasterSchoolId } from "@/app/actions/users"
import { AnnouncementsClient } from "./AnnouncementsClient"

export const dynamic = "force-dynamic"

export default async function AnnouncementsPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📢 घोषणा आणि सूचना
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <AnnouncementsClient schoolId={schoolId} />
      </div>
    </>
  )
}
