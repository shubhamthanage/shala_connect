import { getHeadmasterDashboard } from "@/app/actions/dashboard"
import { BarChart } from "@/components/analytics/BarChart"
import { DonutChart } from "@/components/analytics/DonutChart"
import { ClassTable } from "@/components/analytics/ClassTable"
import { FeeDefaulters } from "@/components/analytics/FeeDefaulters"
import { KPICard } from "@/components/dashboard/KPICard"

export default async function HeadmasterDashboardPage() {
  const data = await getHeadmasterDashboard()
  if (!data) {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-4',hypothesisId:'H13',location:'app/dashboard/headmaster/page.tsx',message:'headmaster page shows fallback instead of login redirect',data:{},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-text-900 mb-2 font-body">
          👨‍💼 मुख्याध्यापक डॅशबोर्ड
        </h1>
        <p className="text-text-500 font-body">
          तुमच्या खात्याची माहिती सेटअप होत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.
        </p>
      </div>
    )
  }

  const formatCurrency = (n: number) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)}L`
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`
    return `₹${n}`
  }

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]} ${today.getFullYear()}`

  return (
    <>
      {/* Topbar */}
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            📊 Analytics Dashboard
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">
            {dateStr} · शैक्षणिक वर्ष २०२४–२५
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/headmaster/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border-school text-text-700 text-sm font-semibold hover:border-saffron hover:text-saffron transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            📄 अहवाल
          </Link>
          <Link
            href="/dashboard/headmaster/announcements"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            📢 सूचना पाठवा
          </Link>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F4F7FB]">
        {/* 5 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-5 animate-fade-in-up">
          <KPICard
            icon="👨‍🎓"
            value={data.totalStudents.toLocaleString("mr-IN")}
            label="एकूण विद्यार्थी"
            trend={`+${data.newAdmissions} नवीन प्रवेश`}
            trendUp={true}
            color="saffron"
          />
          <KPICard
            icon="📋"
            value={`${data.avgAttendance}%`}
            label="सरासरी हजेरी"
            trend="मागील महिन्यापेक्षा +३%"
            trendUp={true}
            color="green"
          />
          <KPICard
            icon="💰"
            value={formatCurrency(data.feeCollected)}
            label="वार्षिक शुल्क जमा"
            trend={`${formatCurrency(data.feePending)} थकित`}
            trendUp={false}
            color="blue"
          />
          <KPICard
            icon="📊"
            value={`${data.avgMarks}%`}
            label="सरासरी गुण"
            trend="मागील वर्षापेक्षा +२.५%"
            trendUp={true}
            color="purple"
          />
          <KPICard
            icon="👩‍🏫"
            value={data.totalTeachers}
            label="शिक्षक संख्या"
            trend="सर्व active"
            trendUp={true}
            color="amber"
          />
        </div>

        {/* Charts: Bar + Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5 animate-fade-in-up-1">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-in-up-2">
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
