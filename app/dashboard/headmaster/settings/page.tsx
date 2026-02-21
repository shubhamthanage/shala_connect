import { redirect } from "next/navigation"
import { getHeadmasterSchool } from "@/app/actions/headmaster"
import { SettingsForm } from "./SettingsForm"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const school = await getHeadmasterSchool()
  if (!school) redirect("/login")

  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          ⚙️ सेटिंग्ज
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          <div className="card-elevated p-6">
            <h3 className="font-bold text-text-900 text-base font-body mb-4">
              शाळा माहिती
            </h3>
            <SettingsForm school={school} />
          </div>
        </div>
      </div>
    </>
  )
}
