const GRADIENTS = {
  saffron: { bar: "from-saffron to-gold", bg: "sc-kpi-gradient-saffron", icon: "bg-saffron/10" },
  green:   { bar: "from-green-mid to-green-bright", bg: "sc-kpi-gradient-green", icon: "bg-green-mid/10" },
  blue:    { bar: "from-sky to-blue-500", bg: "sc-kpi-gradient-blue", icon: "bg-sky/10" },
  purple:  { bar: "from-purple-500 to-pink-500", bg: "sc-kpi-gradient-purple", icon: "bg-purple-500/10" },
  amber:   { bar: "from-amber-400 to-gold", bg: "sc-kpi-gradient-amber", icon: "bg-amber-400/10" },
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
  color?: keyof typeof GRADIENTS
}) {
  const g = GRADIENTS[color]

  return (
    <div className={`rounded-2xl p-5 border border-border-school relative overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-default ${g.bg}`}>
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r ${g.bar}`} />

      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl ${g.icon} flex items-center justify-center text-xl mb-3`}>
        {icon}
      </div>

      {/* Value */}
      <div className="font-extrabold text-text-900 text-[28px] leading-none font-[family-name:var(--font-noto-devanagari)]">
        {value}
      </div>

      {/* Label */}
      <div className="text-[11px] text-text-300 mt-1.5 font-[family-name:var(--font-noto-devanagari)]">
        {label}
      </div>

      {/* Trend */}
      {trend && (
        <div
          className={`flex items-center gap-1 mt-2 text-[11px] font-semibold font-[family-name:var(--font-plus-jakarta)] ${
            trendUp ? "text-green-mid" : "text-red-500"
          }`}
        >
          <span>{trendUp ? "↑" : "↓"}</span>
          <span>{trend}</span>
        </div>
      )}
    </div>
  )
}
