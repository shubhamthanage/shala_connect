import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { HmSidebarNav } from "./components/HmSidebarNav"
import { LogoutButton } from "@/components/auth/LogoutButton"
import { DashboardTopbar } from "@/components/dashboard/DashboardTopbar"
import { WelcomeTour } from "@/components/onboarding/WelcomeTour"

export const dynamic = "force-dynamic"

export default async function HeadmasterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  // Use getSession() - middleware has already refreshed tokens; getUser() can fail on sub-page RSC fetches
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

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
    <div className="flex min-h-screen bg-cream">
      {/* Mobile nav bar - visible only on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-navy-2 border-b border-white/[0.07] px-4 py-3 flex items-center justify-between">
        <a href="/dashboard/headmaster" className="font-bold text-white text-base font-heading">
          शाळा<span className="text-saffron-bright">Connect</span>
        </a>
        <div className="flex gap-2">
          <a href="/dashboard/headmaster/classes/add" className="px-3 py-1.5 rounded-lg border border-white/30 text-white text-xs font-semibold font-body">
            + वर्ग
          </a>
          <a href="/dashboard/headmaster/users/add" className="px-3 py-1.5 rounded-lg bg-gradient-to-br from-saffron to-saffron-bright text-white text-xs font-semibold shadow-saffron-glow font-body">
            + जोडा
          </a>
        </div>
      </div>

      {/* Sidebar — matches home page design: navy-2, saffron accents */}
      <aside className="hidden lg:flex w-[240px] bg-navy-2 flex-shrink-0 flex-col pt-0 relative overflow-hidden border-r border-white/[0.06]">
        <div className="absolute top-[-50%] right-[-30%] w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(244,106,10,0.08),transparent_70%)] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-saffron/5 to-transparent pointer-events-none" />
        <div className="p-5 border-b border-white/[0.08] relative z-10">
          <a href="/dashboard/headmaster" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-lg shadow-saffron-glow shrink-0">
              🏫
            </div>
            <div>
              <div className="font-extrabold text-white text-base font-heading">
                शाळा<span className="text-saffron-bright">Connect</span>
              </div>
              <div className="text-[9px] text-white/35 mt-0.5 font-sora tracking-[2px] uppercase">
                {schoolName}
              </div>
            </div>
          </a>
        </div>
        <HmSidebarNav />
        <div className="p-4 border-t border-white/[0.08] relative z-10">
          <a
            href="/dashboard/headmaster/classes/add"
            className="block w-full py-2.5 text-center rounded-xl border border-white/25 text-white/75 text-xs font-semibold hover:bg-white/[0.08] hover:border-saffron/30 mb-2 font-body transition-all"
          >
            + वर्ग जोडा
          </a>
          <a
            href="/dashboard/headmaster/users/add"
            className="block w-full py-2.5 text-center rounded-xl bg-gradient-to-br from-saffron to-saffron-bright text-white text-xs font-semibold shadow-saffron-glow hover:shadow-saffron-hover font-body transition-all"
          >
            + वापरकर्ता जोडा
          </a>
          <LogoutButton className="block w-full py-2.5 mt-2 text-center text-white/50 text-xs hover:text-white hover:bg-white/[0.06] rounded-lg font-body transition-colors">
            बाहेर पडा
          </LogoutButton>
        </div>
      </aside>

      {/* Main content - add pt for mobile nav */}
      <main className="flex-1 flex flex-col overflow-hidden pt-14 lg:pt-0">
        <DashboardTopbar />
        {children}
        <WelcomeTour />
      </main>
    </div>
  )
}
