export default function ClerkDocumentsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">📄 दाखले व दस्तऐवज</div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">TC, बोनाफाईड, जन्म दाखला</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">लवकरच उपलब्ध होईल</h3>
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] text-sm max-w-sm mx-auto">
            TC, बोनाफाईड, जन्म दाखला आणि इतर दस्तऐवज येथे मिळतील.
          </p>
        </div>
      </div>
    </div>
  )
}
