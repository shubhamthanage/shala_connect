export function FeeSummaryWidget({
  classes,
  totalCollected,
}: {
  classes: Array<{ label: string; collected: string; pending: string }>
  totalCollected: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-4 py-4 border-b border-border-school">
        <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
          💰 शुल्क स्थिती
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-2.5">
          {classes.map((c, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-2.5 px-3 bg-cream rounded-lg border border-border-school"
            >
              <span className="font-semibold text-text-900 text-xs font-[family-name:var(--font-noto-devanagari)]">
                {c.label}
              </span>
              <div>
                <span className="font-bold text-green-mid text-xs font-[family-name:var(--font-plus-jakarta)]">
                  {c.collected}
                </span>
                <div className="text-[11px] text-red-500 font-[family-name:var(--font-noto-devanagari)]">
                  बाकी: {c.pending}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 p-3 bg-navy-3 rounded-xl flex justify-between items-center">
          <span className="text-xs text-white/60 font-[family-name:var(--font-noto-devanagari)]">
            एकूण जमा
          </span>
          <span className="font-extrabold text-white text-lg font-[family-name:var(--font-plus-jakarta)]">
            {totalCollected}
          </span>
        </div>
      </div>
    </div>
  )
}
