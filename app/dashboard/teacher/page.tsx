import { redirect } from "next/navigation"
import { getTeacherDashboard } from "@/app/actions/teacher"
import { TeacherTopBar } from "@/components/dashboard/TeacherTopBar"
import { KPICard } from "@/components/dashboard/KPICard"
import { AttendanceWidget } from "@/components/attendance/AttendanceWidget"
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { ActivityFeed } from "@/components/dashboard/ActivityFeed"
import { FeeSummaryWidget } from "@/components/dashboard/FeeSummaryWidget"

export default async function TeacherDashboardPage() {
  const data = await getTeacherDashboard()
  if (!data) redirect("/login?error=no_school")

  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const today = new Date()
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`

  const classLabel = data.primaryClass
    ? `इ.${data.primaryClass.grade}वी ${data.primaryClass.division}`
    : "इ.७वी अ"

  const { attendanceToday, homeworkPending, avgMarks, unreadParentMessages } = data.kpis

  return (
    <>
      <TeacherTopBar
        teacherName={data.teacherName}
        schoolName={data.schoolName}
        dateStr={dateStr}
      />
      <div className="flex-1 overflow-y-auto p-6 md:p-7">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          <KPICard
            icon="📋"
            value={attendanceToday.total > 0 ? `${attendanceToday.present + attendanceToday.absent}` : "४२"}
            label={`आजची हजेरी — ${classLabel}`}
            trend={
              attendanceToday.total > 0
                ? `${attendanceToday.present} हजर · ${attendanceToday.absent} गैरहजर`
                : "३७ हजर · ५ गैरहजर"
            }
            trendUp={attendanceToday.present >= (attendanceToday.total || 42) * 0.8}
            color="saffron"
          />
          <KPICard
            icon="📝"
            value={homeworkPending}
            label="गृहपाठ बाकी"
            trend="⚠️ आठवड्याचे"
            trendUp={false}
            color="green"
          />
          <KPICard
            icon="📊"
            value={`${avgMarks}%`}
            label={`${classLabel} सरासरी गुण`}
            trend="↑ मागील महिन्यापेक्षा +४%"
            trendUp={true}
            color="blue"
          />
          <KPICard
            icon="💬"
            value={unreadParentMessages}
            label="अवाचित पालक संदेश"
            trend="⚠️ उत्तर द्या"
            trendUp={false}
            color="purple"
          />
        </div>

        {/* Middle row: Attendance + Upcoming */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2">
            <AttendanceWidget
              students={data.attendanceStudents}
              classLabel={classLabel}
              viewAllHref="/dashboard/teacher/attendance"
            />
          </div>
          <div>
            <UpcomingEvents events={data.upcomingEvents} />
          </div>
        </div>

        {/* Bottom row: Quick Actions, Activity, Fee */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <QuickActions />
          <ActivityFeed activities={data.activities} />
          <FeeSummaryWidget
            classes={[
              { label: "इ.७वी अ", collected: "₹१.२L", pending: "₹३२,०००" },
              { label: "इ.७वी ब", collected: "₹१.१L", pending: "₹२४,०००" },
              { label: "इ.७वी क", collected: "₹१.३L", pending: "₹१८,०००" },
            ]}
            totalCollected="₹३.६L"
          />
        </div>
      </div>
    </>
  )
}
