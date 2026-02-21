import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { ParentSidebar } from "./components/ParentSidebar"

export const dynamic = "force-dynamic"

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) redirect("/login?error=no_session")

  const role = user.user_metadata?.role
  if (role !== "parent") redirect(`/login?error=wrong_role&got=${encodeURIComponent(role ?? "null")}`)

  const { data: userData } = await supabase
    .from("users")
    .select("id, name, school_id")
    .eq("auth_id", user.id)
    .eq("role", "parent")
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

  const parentName = userData?.name || "पालक"

  return (
    <div className="flex min-h-screen bg-[#F4F7FB]">
      {/* Mobile nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard/parent" className="font-bold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
          शाळा<span className="text-saffron-bright">Connect</span>
        </Link>
        <LogoutButton className="px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-semibold font-[family-name:var(--font-noto-devanagari)]">
          बाहेर
        </LogoutButton>
      </div>

      {/* Sidebar - desktop */}
      <ParentSidebar
        parentName={parentName}
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
