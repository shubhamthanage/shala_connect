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
    <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
      <div>
        <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
          नमस्कार, {teacherName} 🙏
        </div>
        <div className="text-[11px] text-text-300 mt-0.5 font-body">
          {dateStr} · {schoolName}
        </div>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden md:flex items-center gap-2 bg-[#F4F7FB] border border-border-school rounded-full pl-4 pr-4 py-2 w-[200px]">
          <span className="text-text-300 text-sm">🔍</span>
          <input
            type="text"
            placeholder="शोधा..."
            className="bg-transparent border-none outline-none text-[13px] text-text-900 w-full font-body placeholder:text-text-300"
          />
        </div>
        <button className="w-9 h-9 rounded-full bg-[#F4F7FB] border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors">
          📅
        </button>
        <button className="relative w-9 h-9 rounded-full bg-[#F4F7FB] border border-border-school flex items-center justify-center text-base hover:border-saffron transition-colors">
          🔔
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-saffron rounded-full border-2 border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-base">
          👩‍🏫
        </div>
      </div>
    </div>
  )
}
