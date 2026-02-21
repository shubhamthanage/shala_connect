import { getTeacherAttendanceData } from "@/app/actions/attendance"
import { AttendanceSheet } from "./AttendanceSheet"

export default async function TeacherAttendancePage() {
  const data = await getTeacherAttendanceData()
  if (!data) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
          <p className="text-text-500 font-body">
            हजेरी माहिती सध्या उपलब्ध नाही. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-[60px] bg-white border-b border-border-school flex items-center px-7 flex-shrink-0">
        <div className="font-bold text-text-900 text-[17px] font-heading">
          📋 हजेरी — {data.classLabel}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {data.classId && data.students.length > 0 ? (
          <AttendanceSheet
            classId={data.classId}
            classLabel={data.classLabel}
            students={data.students}
            date={data.today}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
            <p className="text-text-500 font-body">
              {data.classId
                ? "या वर्गात अजून विद्यार्थी नाहीत."
                : "तुम्हाला अजून वर्ग नियुक्त केलेला नाही."}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
