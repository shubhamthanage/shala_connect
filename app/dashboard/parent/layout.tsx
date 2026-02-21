import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { LogoutButton } from "@/components/auth/LogoutButton"

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

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="h-14 bg-white border-b border-border-school flex items-center justify-between px-6">
        <a href="/dashboard/parent" className="font-bold text-text-900 font-heading">
          शाळा<span className="text-saffron-bright">Connect</span> — पालक
        </a>
        <LogoutButton className="text-sm text-text-500 hover:text-saffron font-body">
          बाहेर पडा
        </LogoutButton>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
