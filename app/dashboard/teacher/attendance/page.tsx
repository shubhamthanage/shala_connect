import { getTeacherAttendanceData } from "@/app/actions/attendance"
import { AttendanceSheet } from "./AttendanceSheet"

export default async function TeacherAttendancePage() {
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H21',location:'app/dashboard/teacher/attendance/page.tsx',message:'teacher attendance page entered',data:{},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
  const data = await getTeacherAttendanceData()
  if (!data) {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-5',hypothesisId:'H16',location:'app/dashboard/teacher/attendance/page.tsx',message:'attendance page fallback rendered instead of login redirect',data:{},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
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
