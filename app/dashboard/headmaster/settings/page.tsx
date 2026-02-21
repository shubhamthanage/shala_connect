import { redirect } from "next/navigation"
import { getHeadmasterSchool } from "@/app/actions/headmaster"
import { SettingsForm } from "./SettingsForm"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const school = await getHeadmasterSchool()
  if (!school) redirect("/login")

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            ⚙️ सेटिंग्ज
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">शाळेची माहिती व प्राधान्ये</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">⚙️</div>
          <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">लवकरच उपलब्ध होईल</h3>
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] text-sm max-w-sm mx-auto">शाळेची माहिती, WhatsApp सेटिंग्ज, आणि अधिक पर्याय येथे मिळतील.</p>
        </div>
      </div>
    </>
  )
}
