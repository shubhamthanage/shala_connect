import { redirect } from "next/navigation"
import { getHeadmasterSchoolId } from "@/app/actions/users"
import { getHeadmasterDashboard } from "@/app/actions/dashboard"

export const dynamic = "force-dynamic"

export default async function ReportsPage() {
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) redirect("/login")

  const data = await getHeadmasterDashboard()

  const reports = [
    {
      id: "attendance",
      title: "हजेरी अहवाल",
      desc: "मासिक हजेरी सारांश — वर्गनिहाय",
      icon: "📋",
      href: "/api/reports/attendance",
    },
    {
      id: "udise",
      title: "U-DISE अहवाल",
      desc: "शाळा माहिती आणि आकडेवारी (JSON)",
      icon: "📊",
      href: "/api/reports/udise",
    },
    {
      id: "fee",
      title: "शुल्क अहवाल",
      desc: "फी जमा आणि थकबाकी सारांश",
      icon: "💰",
      href: "/api/reports/fee",
    },
  ]

  return (
    <>
      <div className="h-[58px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📄 अहवाल डाउनलोड
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reports.map((r) => (
            <a
              key={r.id}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card-elevated p-6 hover:shadow-sh-md hover:-translate-y-0.5 transition-all block"
            >
              <div className="text-3xl mb-3">{r.icon}</div>
              <h3 className="font-bold text-text-900 text-base font-body mb-2">{r.title}</h3>
              <p className="text-xs text-text-500 font-body mb-4">{r.desc}</p>
              <span className="text-saffron text-sm font-semibold font-body">
                डाउनलोड →
              </span>
            </a>
          ))}
        </div>
        {data && (
          <div className="mt-6 p-4 bg-cream rounded-xl border border-border-school">
            <p className="text-xs text-text-500 font-body">
              📌 सध्या {data.totalStudents} विद्यार्थी, {data.totalTeachers} शिक्षक. सरासरी हजेरी {data.avgAttendance}%.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
