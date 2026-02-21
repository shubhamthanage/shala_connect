export interface UpcomingEvent {
  day: number
  month: string
  title: string
  subtitle: string
}

export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-4 py-4 border-b border-border-school">
        <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
          📅 आगामी कार्यक्रम
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {events.map((e, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-10 h-11 rounded-lg bg-saffron-pale border border-saffron/20 flex flex-col items-center justify-center flex-shrink-0">
                <span className="font-extrabold text-saffron text-base leading-none font-[family-name:var(--font-plus-jakarta)]">
                  {e.day}
                </span>
                <span className="text-[8px] font-bold text-saffron uppercase tracking-wider font-[family-name:var(--font-plus-jakarta)]">
                  {e.month}
                </span>
              </div>
              <div>
                <div className="font-semibold text-text-900 text-[13px] font-[family-name:var(--font-noto-devanagari)]">
                  {e.title}
                </div>
                <div className="text-[11px] text-text-300 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">
                  {e.subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
