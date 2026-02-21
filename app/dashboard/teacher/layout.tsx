import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import { TeacherSidebar } from "./components/TeacherSidebar"

export const dynamic = "force-dynamic"

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

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
    <div className="flex min-h-screen bg-[#F4F7FB]">
      {/* Mobile nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard/teacher" className="font-bold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
          शाळा<span className="text-saffron-bright">Connect</span>
        </Link>
        <Link href="/dashboard/teacher/attendance" className="px-3 py-1.5 rounded-lg bg-saffron text-white text-xs font-semibold font-[family-name:var(--font-noto-devanagari)]">
          हजेरी
        </Link>
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
