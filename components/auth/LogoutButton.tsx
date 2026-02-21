"use client"

import { createClient } from "@/lib/supabase/client"

interface LogoutButtonProps {
  className?: string
  children: React.ReactNode
}

export function LogoutButton({ className, children }: LogoutButtonProps) {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  )
}
