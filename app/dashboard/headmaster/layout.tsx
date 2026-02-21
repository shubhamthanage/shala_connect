import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { createAdminClient } from "@/lib/supabase/admin"
import { HmSidebarNav } from "./components/HmSidebarNav"
import { LogoutButton } from "@/components/auth/LogoutButton"

export const dynamic = "force-dynamic"

export default async function HeadmasterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?error=no_session")

  const role = user.user_metadata?.role
  if (role !== "headmaster") redirect(`/login?error=wrong_role&got=${encodeURIComponent(role ?? "null")}`)

  const { data: userData } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "headmaster")
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
    <div className="flex min-h-screen bg-cream-2">
      {/* Mobile nav bar - visible only on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard/headmaster" className="font-bold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
          शाळा<span className="text-saffron-bright">Connect</span>
        </Link>
        <div className="flex gap-2">
          <Link href="/dashboard/headmaster/classes/add" className="px-3 py-1.5 rounded-lg border border-white/30 text-white text-xs font-semibold font-[family-name:var(--font-noto-devanagari)]">
            + वर्ग
          </Link>
          <Link href="/dashboard/headmaster/users/add" className="px-3 py-1.5 rounded-lg bg-saffron text-white text-xs font-semibold font-[family-name:var(--font-noto-devanagari)]">
            + जोडा
          </Link>
        </div>
      </div>

      {/* Sidebar - hidden on mobile */}
      <aside className="hidden lg:flex w-[220px] bg-navy flex-shrink-0 flex-col pt-0">
        <div className="p-4 border-b border-white/10">
          <div className="font-extrabold text-white text-[15px] font-[family-name:var(--font-noto-devanagari)]">
            शाळा<span className="text-saffron-bright">Connect</span>
          </div>
          <div className="text-[10px] text-white/35 mt-0.5 font-[family-name:var(--font-noto-devanagari)]">
            {schoolName}
          </div>
        </div>
        <HmSidebarNav />
        <div className="p-4 border-t border-white/10">
          <Link
            href="/dashboard/headmaster/classes/add"
            className="block w-full py-2 text-center rounded-lg border border-white/20 text-white/70 text-xs font-semibold hover:bg-white/10 mb-2 font-[family-name:var(--font-noto-devanagari)]"
          >
            + वर्ग जोडा
          </Link>
          <Link
            href="/dashboard/headmaster/users/add"
            className="block w-full py-2 text-center rounded-lg bg-saffron text-white text-xs font-semibold hover:bg-saffron-bright font-[family-name:var(--font-noto-devanagari)]"
          >
            + वापरकर्ता जोडा
          </Link>
          <LogoutButton className="block w-full py-2 mt-2 text-center text-white/50 text-xs hover:text-white font-[family-name:var(--font-noto-devanagari)]">
            बाहेर पडा
          </LogoutButton>
        </div>
      </aside>

      {/* Main content - add pt for mobile nav */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  )
}
