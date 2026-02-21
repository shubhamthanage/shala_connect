import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { TeacherSidebar } from "./components/TeacherSidebar"

export const dynamic = "force-dynamic"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-2',hypothesisId:'H8',location:'app/dashboard/teacher/layout.tsx:17',message:'teacher layout auth check',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion

  if (!user) redirect("/login?error=no_session")

  const role = user.user_metadata?.role
  if (role !== "teacher") redirect(`/login?error=wrong_role&got=${encodeURIComponent(role ?? "null")}`)

  const { data: userData } = await supabase
    .from("users")
    .select("id, name, school_id")
    .eq("auth_id", user.id)
    .eq("role", "teacher")
    .single()

  let schoolName = "शाळा"
  if (userData?.school_id) {
    const admin = createAdminClient()
    const { data: school } = await admin
      .from("schools")
      .select("name")
      .eq("id", userData.school_id)
      .single()
    if (school?.name) schoolName = school.name
  }

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Mobile nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <a href="/dashboard/teacher" className="font-bold text-white text-base font-heading">
          शाळा<span className="text-saffron-bright">Connect</span>
        </a>
        <a href="/dashboard/teacher/attendance" className="px-3 py-1.5 rounded-lg bg-saffron text-white text-xs font-semibold font-body">
          हजेरी
        </a>
      </div>

      {/* Sidebar - desktop */}
      <TeacherSidebar
        teacherName={userData?.name || "शिक्षक"}
        schoolName={schoolName}
        className="hidden lg:flex"
      />

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
