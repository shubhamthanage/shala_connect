import { getHeadmasterDashboard } from "@/app/actions/dashboard"
import { BarChart } from "@/components/analytics/BarChart"
import { DonutChart } from "@/components/analytics/DonutChart"
import { ClassTable } from "@/components/analytics/ClassTable"
import { FeeDefaulters } from "@/components/analytics/FeeDefaulters"

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

  const formatNum = (n: number) => {
    if (n >= 1000) return n.toLocaleString("mr-IN")
    return String(n)
  }

  return (
    <>
      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* 5 KPI Cards — design.html kpi with top accent bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden hover:shadow-sh-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-saffron to-gold rounded-t-2xl" />
            <span className="text-2xl block mb-1.5">👨‍🎓</span>
            <div className="text-2xl font-extrabold text-text-900 font-heading">
              {formatNum(data.totalStudents)}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-body">
              एकूण विद्यार्थी
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-body">
              ↑ +{data.newAdmissions} नवीन प्रवेश
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden hover:shadow-sh-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-green-mid to-green-bright rounded-t-2xl" />
            <span className="text-2xl block mb-1.5">📋</span>
            <div className="text-2xl font-extrabold text-text-900 font-heading">
              {data.avgAttendance}%
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-body">
              सरासरी हजेरी
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-body">
              ↑ मागील महिन्यापेक्षा +३%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden hover:shadow-sh-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky to-sky/80 rounded-t-2xl" />
            <span className="text-2xl block mb-1.5">💰</span>
            <div className="text-2xl font-extrabold text-text-900 font-heading">
              {formatCurrency(data.feeCollected)}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-body">
              वार्षिक शुल्क जमा
            </div>
            <div className="text-[10px] font-bold text-red-500 mt-1 font-body">
              ↓ {formatCurrency(data.feePending)} थकित अजून
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden hover:shadow-sh-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-2xl" />
            <span className="text-2xl block mb-1.5">📊</span>
            <div className="text-2xl font-extrabold text-text-900 font-heading">
              {data.avgMarks}%
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-body">
              सरासरी गुण
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-body">
              ↑ मागील वर्षापेक्षा +२.५%
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-border-school relative overflow-hidden hover:shadow-sh-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-saffron to-gold rounded-t-2xl" />
            <span className="text-2xl block mb-1.5">👩‍🏫</span>
            <div className="text-2xl font-extrabold text-text-900 font-heading">
              {data.totalTeachers}
            </div>
            <div className="text-[10px] text-text-300 mt-1 font-body">
              शिक्षक संख्या
            </div>
            <div className="text-[10px] font-bold text-green-mid mt-1 font-body">
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
