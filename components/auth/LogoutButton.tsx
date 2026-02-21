"use client"

import { createClient } from "@/lib/supabase/client"

interface LogoutButtonProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export function LogoutButton({ className, children, onClick }: LogoutButtonProps) {
  const handleLogout = async () => {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H17',location:'components/auth/LogoutButton.tsx:handleLogout',message:'logout button clicked',data:{pathname:typeof window!=="undefined"?window.location.pathname:null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    onClick?.()
    const supabase = createClient()
    await supabase.auth.signOut()
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-7',hypothesisId:'H17',location:'components/auth/LogoutButton.tsx:handleLogout',message:'logout signOut completed',data:{pathname:typeof window!=="undefined"?window.location.pathname:null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    window.location.href = "/login"
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  )
}
