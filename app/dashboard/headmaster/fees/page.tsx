import { getFeeOverview } from "@/app/actions/fees"
import { FeesClient } from "./FeesClient"
import { FeeOverviewChart } from "./FeeOverviewChart"

export const dynamic = "force-dynamic"

export default async function FeesPage() {
  const data = await getFeeOverview()

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            💰 शुल्क व्यवस्थापन
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">शुल्क संकलन अहवाल</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        {!data ? (
          <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
            <p className="text-text-500 font-body">
              डेटा लोड करण्यात अयशस्वी
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <FeeOverviewChart totalCollected={data.totalCollected} totalPending={data.totalPending} />
            <FeesClient data={data} />
          </div>
        )}
      </div>
    </>
  )
}
