"use client"

export function TeacherTopBar({
  teacherName,
  schoolName,
  dateStr,
}: {
  teacherName: string
  schoolName: string
  dateStr: string
}) {
  return (
    <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-7 flex-shrink-0 shadow-sm">
      <div>
        <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
          नमस्कार, {teacherName} 👋
        </div>
        <div className="text-[11px] text-text-300 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">
          {dateStr} · {schoolName}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-cream border border-border-school rounded-full pl-4 pr-4 py-2 w-[220px]">
          <span className="text-text-300">🔍</span>
          <input
            type="text"
            placeholder="शोधा..."
            className="bg-transparent border-none outline-none text-[13px] text-text-900 w-full font-[family-name:var(--font-noto-devanagari)] placeholder:text-text-300"
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-cream border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors">
          📅
        </button>
        <button className="relative w-9 h-9 rounded-full bg-cream border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors">
          🔔
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-saffron rounded-full border border-white" />
        </button>
        <button className="w-9 h-9 rounded-full bg-cream border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors">
          👩
        </button>
      </div>
    </div>
  )
}
