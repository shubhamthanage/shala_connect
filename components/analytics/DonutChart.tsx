"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export interface AttendanceDistribution {
  present: number
  late: number
  absent: number
}

interface DonutChartProps {
  data: AttendanceDistribution
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.present + data.late + data.absent
  const presentPct = total ? Math.round((data.present / total) * 100) : 87
  const latePct = total ? Math.round((data.late / total) * 100) : 9
  const absentPct = total ? Math.round((data.absent / total) * 100) : 4

  const chartData = [
    { name: "हजर", value: data.present, color: "#16A34A" },
    { name: "उशीर", value: data.late, color: "#F59E0B" },
    { name: "गैरहजर", value: data.absent, color: "#EF4444" },
  ].filter((d) => d.value > 0)

  if (chartData.length === 0) {
    chartData.push(
      { name: "हजर", value: 1, color: "#16A34A" },
      { name: "उशीर", value: 0, color: "#F59E0B" },
      { name: "गैरहजर", value: 0, color: "#EF4444" }
    )
  }

  return (
    <div className="card-elevated p-5">
      <div className="font-bold text-text-900 text-sm mb-4 font-body">
        📊 हजेरी वितरण
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="w-[140px] h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, name: string) => [v, name]}
                contentStyle={{
                  fontFamily: "var(--font-noto-devanagari)",
                  borderRadius: "12px",
                  border: "1px solid #E5EEF6",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-text-900 font-heading">
              {presentPct}%
            </span>
            <span className="text-[9px] text-text-300 uppercase tracking-wider font-body">
              हजेरी
            </span>
          </div>
        </div>
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-green-mid shrink-0" />
              <span className="text-[11px] text-text-700 font-body">
                हजर
              </span>
            </div>
            <span className="text-[11px] font-bold text-text-900 font-body">
              {data.present}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gold shrink-0" />
              <span className="text-[11px] text-text-700 font-body">
                उशीर
              </span>
            </div>
            <span className="text-[11px] font-bold text-text-900 font-body">
              {data.late}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-[11px] text-text-700 font-body">
                गैरहजर
              </span>
            </div>
            <span className="text-[11px] font-bold text-text-900 font-body">
              {data.absent}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
