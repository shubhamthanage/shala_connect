"use client"

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

const MONTH_NAMES = ["जून", "जुलै", "ऑग", "सप्ट", "ऑक्ट", "नोव्ह", "डिसें", "जाने", "फेब्रु"]

export interface MonthlyFeePoint {
  month: string
  amount: number
  monthIndex?: number
  isCurrentMonth?: boolean
}

interface BarChartProps {
  data: MonthlyFeePoint[]
  currentMonthIndex?: number
}

const ACADEMIC_MONTHS = [6, 7, 8, 9, 10, 11, 12, 1, 2]

export function BarChart({ data, currentMonthIndex }: BarChartProps) {
  const jsMonth = currentMonthIndex ?? new Date().getMonth()
  const calendarMonth = jsMonth + 1
  const displayIndex = ACADEMIC_MONTHS.indexOf(calendarMonth)
  const currentBarIndex = displayIndex >= 0 ? displayIndex : 8

  const chartData = data.length
    ? data.map((d, i) => ({
        ...d,
        isCurrentMonth: i === currentBarIndex,
      }))
    : MONTH_NAMES.map((month, i) => ({
        month,
        amount: 0,
        monthIndex: i,
        isCurrentMonth: i === currentBarIndex,
      }))

  const formatLakhs = (v: number) => {
    if (v >= 100000) return `${(v / 100000).toFixed(1)}L`
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K`
    return `${v}`
  }

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 10000)

  return (
    <div className="bg-white rounded-2xl border border-border-school p-5">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-text-900 text-sm font-[family-name:var(--font-noto-devanagari)]">
          📈 मासिक शुल्क संकलन (₹ लाखात)
        </span>
        <span className="text-[11px] font-semibold text-text-300 font-[family-name:var(--font-plus-jakarta)]">
          २०२४–२५
        </span>
      </div>
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EEF6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#4A6380" }}
              fontFamily="var(--font-noto-devanagari)"
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `₹${formatLakhs(v)}`}
              tick={{ fontSize: 10, fill: "#4A6380" }}
              fontFamily="var(--font-plus-jakarta)"
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip
              formatter={(v: number) => [`₹${(v / 100000).toFixed(2)} लाख`, ""]}
              contentStyle={{
                fontFamily: "var(--font-noto-devanagari)",
                borderRadius: "12px",
                border: "1px solid #E5EEF6",
              }}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={28} maxBarSize={36}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isCurrentMonth ? "rgba(244,106,10,0.5)" : "url(#saffronGold)"}
                  stroke={entry.isCurrentMonth ? "#F46A0A" : "none"}
                  strokeWidth={2}
                  strokeDasharray={entry.isCurrentMonth ? "4 4" : "none"}
                />
              ))}
            </Bar>
            <defs>
              <linearGradient id="saffronGold" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#F46A0A" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
