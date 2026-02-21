import { getHeadmasterDashboard } from "@/app/actions/dashboard"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BarChart } from "@/components/analytics/BarChart"
import { DonutChart } from "@/components/analytics/DonutChart"
import { ClassTable } from "@/components/analytics/ClassTable"
import { FeeDefaulters } from "@/components/analytics/FeeDefaulters"

export default async function HeadmasterDashboardPage() {
  const data = await getHeadmasterDashboard()
  if (!data) redirect("/login?error=no_school")

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
    return `₹${n}`
  }

  const formatNum = (n: number) => {
    if (n >= 1000) return n.toLocaleString("mr-IN")
    return String(n)
  }

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()} | शैक्षणिक वर्ष २०२४–२५`

  return (
    <>
      {/* Topbar */}
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            📊 शाळा Analytics Dashboard
          </div>
        </div>
        <div className="text-[12px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">
          {dateStr}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/headmaster/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border-school text-text-700 text-sm font-semibold hover:border-saffron hover:text-saffron font-[family-name:var(--font-noto-devanagari)]"
          >
            📄 अहवाल डाउनलोड
          </Link>
          <Link
            href="/dashboard/headmaster/announcements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-lg shadow-saffron/30 hover:shadow-xl font-[family-name:var(--font-noto-devanagari)]"
          >
            📢 सूचना पाठवा
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 5 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5">
          <div className="bg-white rounded-2xl p-4 border border-border-school hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <span className="text-2xl block mb-1.5">👨‍🎓</span>
            <div className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {formatNum(data.totalStudents)}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              एकूण विद्यार्थी
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-[family-name:var(--font-plus-jakarta)]">
              ↑ +{data.newAdmissions} नवीन प्रवेश
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border-school hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <span className="text-2xl block mb-1.5">📋</span>
            <div className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {data.avgAttendance}%
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              सरासरी हजेरी
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-[family-name:var(--font-plus-jakarta)]">
              ↑ मागील महिन्यापेक्षा +३%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border-school hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <span className="text-2xl block mb-1.5">💰</span>
            <div className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {formatCurrency(data.feeCollected)}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              वार्षिक शुल्क जमा
            </div>
            <div className="text-[10px] font-bold text-red-500 mt-1 font-[family-name:var(--font-plus-jakarta)]">
              ↓ {formatCurrency(data.feePending)} थकित अजून
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border-school hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <span className="text-2xl block mb-1.5">📊</span>
            <div className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {data.avgMarks}%
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              सरासरी गुण
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-[family-name:var(--font-plus-jakarta)]">
              ↑ मागील वर्षापेक्षा +२.५%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-border-school hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
            <span className="text-2xl block mb-1.5">👩‍🏫</span>
            <div className="text-2xl font-extrabold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
              {data.totalTeachers}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-[family-name:var(--font-noto-devanagari)]">
              शिक्षक संख्या
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-[family-name:var(--font-plus-jakarta)]">
              ↑ सर्व active
            </div>
          </div>
        </div>

        {/* Charts: Bar + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <BarChart
              data={data.monthlyFeeData}
              currentMonthIndex={new Date().getMonth()}
            />
          </div>
          <div>
            <DonutChart data={data.attendanceDistribution} />
          </div>
        </div>

        {/* Tables: Class + Fee Defaulters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <ClassTable data={data.classPerformance} />
          <FeeDefaulters
            data={data.feePendingByClass}
            totalStudents={data.totalStudents}
            totalPending={data.feePending}
            schoolId={data.schoolId}
          />
        </div>
      </div>
    </>
  )
}
