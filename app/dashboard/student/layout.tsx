import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/auth/LogoutButton"

export const dynamic = "force-dynamic"

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H5',location:'app/dashboard/student/layout.tsx:15',message:'student layout auth check',data:{hasSession:!!session,hasUser:!!user,role:(user?.user_metadata?.role as string|undefined)??null},timestamp:Date.now()})}).catch(()=>{})
  // #endregion

  if (!user) redirect("/login?error=no_session")

  const role = user.user_metadata?.role
  if (role !== "student") redirect(`/login?error=wrong_role&got=${encodeURIComponent(role ?? "null")}`)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="h-14 bg-white border-b border-border-school flex items-center justify-between px-6">
        <a href="/dashboard/student" className="font-bold text-text-900 font-heading">
          शाळा<span className="text-saffron-bright">Connect</span> — विद्यार्थी
        </a>
        <LogoutButton className="text-sm text-text-500 hover:text-saffron font-body">
          बाहेर पडा
        </LogoutButton>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
