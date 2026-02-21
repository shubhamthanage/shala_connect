"use client"

import { createClient } from "@/lib/supabase/client"

interface LogoutButtonProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function LogoutButton({ className, children, onClick }: LogoutButtonProps) {
  const handleLogout = async () => {
    onClick?.()
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
