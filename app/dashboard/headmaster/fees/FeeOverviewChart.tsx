"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

const formatCurrency = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n}`
}

export function FeeOverviewChart({
  totalCollected,
  totalPending,
}: {
  totalCollected: number
  totalPending: number
}) {
  const barData = [
    { name: "जमा", value: totalCollected, fill: "#16A34A" },
    { name: "थकित", value: totalPending, fill: "#F46A0A" },
  ]

  return (
    <div className="bg-white rounded-2xl border border-border-school p-5">
      <div className="font-bold text-text-900 text-sm mb-4 font-body">
        एकूण शुल्क स्थिती
      </div>
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5EEF6" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(v) => formatCurrency(v)}
              tick={{ fontSize: 11, fill: "#4A6380" }}
              fontFamily="var(--font-noto-devanagari)"
            />
            <YAxis
              type="category"
              dataKey="name"
              width={60}
              tick={{ fontSize: 12, fill: "#243347" }}
              fontFamily="var(--font-noto-devanagari)"
            />
            <Tooltip
              formatter={(v: number) => [formatCurrency(v), ""]}
              contentStyle={{ fontFamily: "var(--font-noto-devanagari)" }}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
              {barData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex gap-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-mid" />
          <span className="text-xs text-text-600 font-body">
            जमा: {formatCurrency(totalCollected)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-saffron" />
          <span className="text-xs text-text-600 font-body">
            थकित: {formatCurrency(totalPending)}
          </span>
        </div>
      </div>
    </div>
  )
}
