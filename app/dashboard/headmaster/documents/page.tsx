import { EmptyState } from "@/components/ui/EmptyState"

export default function DocumentsPage() {
  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📁 दस्तऐवज व्यवस्थापन
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <EmptyState
          icon="📁"
          title="दस्तऐवज व्यवस्थापन लवकरच"
          description="TC, बोनाफाईड, जन्म दाखला आणि U-DISE एक्सपोर्ट लवकरच उपलब्ध होईल."
          actionLabel="अहवाल डाउनलोड"
          actionHref="/dashboard/headmaster/reports"
        />
      </div>
    </>
  )
}
