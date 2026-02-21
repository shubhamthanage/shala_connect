import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { LogoutButton } from "@/components/auth/LogoutButton"

export const dynamic = "force-dynamic"

export default async function ParentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login?error=no_session")

  const role = user.user_metadata?.role
  if (role !== "parent") redirect(`/login?error=wrong_role&got=${encodeURIComponent(role ?? "null")}`)

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="h-14 bg-white border-b border-border-school flex items-center justify-between px-6">
        <Link href="/dashboard/parent" className="font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
          शाळा<span className="text-saffron-bright">Connect</span> — पालक
        </Link>
        <LogoutButton className="text-sm text-text-500 hover:text-saffron font-[family-name:var(--font-noto-devanagari)]">
          बाहेर पडा
        </LogoutButton>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
