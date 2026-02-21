const BORDER_COLORS = {
  saffron: "from-saffron to-gold",
  green: "from-green-mid to-green-bright",
  blue: "from-sky to-sky",
  purple: "from-purple-500 to-pink-500",
} as const

export function KPICard({
  icon,
  value,
  label,
  trend,
  trendUp,
  color = "saffron",
}: {
  icon: string
  value: string | number
  label: string
  trend?: string
  trendUp?: boolean
  color?: keyof typeof BORDER_COLORS
}) {
  return (
    <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${BORDER_COLORS[color]}`}
      />
      <span className="text-2xl block mb-2">{icon}</span>
      <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
        {value}
      </div>
      <div className="text-[11px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
        {label}
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 mt-1.5 text-[11px] font-semibold font-[family-name:var(--font-plus-jakarta)] ${
            trendUp ? "text-green-mid" : "text-red-500"
          }`}
        >
          {trendUp ? "↑" : "↓"} {trend}
        </div>
      )}
    </div>
  )
}
