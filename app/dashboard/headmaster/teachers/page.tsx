import Link from "next/link"

export default function TeachersPage() {
  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
          👩‍🏫 शिक्षक व्यवस्थापन
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] mb-4">
            लवकरच उपलब्ध...
          </p>
          <Link
            href="/dashboard/headmaster/users/add"
            className="text-saffron font-semibold hover:underline font-[family-name:var(--font-noto-devanagari)]"
          >
            शिक्षक जोडण्यासाठी वापरकर्ता जोडा →
          </Link>
        </div>
      </div>
    </>
  )
}
