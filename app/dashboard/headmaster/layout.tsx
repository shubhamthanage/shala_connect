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
    <div className="flex min-h-screen bg-[#F4F7FB]">
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
      <aside className="hidden lg:flex w-[240px] bg-navy-2 flex-shrink-0 flex-col relative overflow-hidden">
        {/* Subtle glow */}
        <div
          className="absolute top-[-50%] right-[-30%] w-[280px] h-[280px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(244,106,10,0.07), transparent 70%)" }}
        />
        {/* Brand */}
        <div className="p-5 border-b border-white/10 relative z-10">
          <Link href="/dashboard/headmaster" className="block">
            <div className="font-extrabold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
              शाळा<span className="text-saffron-bright">Connect</span>
            </div>
            <div className="text-[9px] text-white/30 tracking-[2px] uppercase font-semibold mt-0.5">
              {schoolName}
            </div>
          </Link>
        </div>
        {/* User info */}
        <div className="py-4 px-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-saffron to-gold flex items-center justify-center text-sm flex-shrink-0">
              👨‍💼
            </div>
            <div className="min-w-0">
              <div className="font-bold text-white text-xs font-[family-name:var(--font-noto-devanagari)] truncate">
                मुख्याध्यापक
              </div>
              <div className="text-[9px] text-white/38 font-[family-name:var(--font-noto-devanagari)]">
                Headmaster
              </div>
            </div>
          </div>
        </div>
        <HmSidebarNav />
        <div className="p-3 border-t border-white/10 relative z-10 space-y-1.5">
          <Link
            href="/dashboard/headmaster/classes/add"
            className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl border border-white/15 text-white/65 text-[13px] font-semibold hover:bg-white/8 hover:text-white transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            <span>+</span> वर्ग जोडा
          </Link>
          <Link
            href="/dashboard/headmaster/users/add"
            className="flex items-center gap-2 w-full py-2.5 px-3 rounded-xl bg-saffron/20 border border-saffron/30 text-saffron-bright text-[13px] font-semibold hover:bg-saffron/30 transition-all font-[family-name:var(--font-noto-devanagari)]"
          >
            <span>+</span> वापरकर्ता जोडा
          </Link>
          <LogoutButton className="flex items-center gap-2.5 py-2 px-3 rounded-xl hover:bg-white/6 text-white/50 w-full text-left transition-all text-[13px] font-[family-name:var(--font-noto-devanagari)]">
            <span className="text-base">🚪</span>
            <span>लॉगआउट</span>
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
