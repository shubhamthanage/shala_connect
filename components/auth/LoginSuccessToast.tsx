"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function LoginSuccessToast() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H1',location:'components/auth/LoginSuccessToast.tsx:12',message:'login toast effect evaluated',data:{pathname,isDashboard:!!pathname?.startsWith('/dashboard'),loginParam:searchParams?.get('login')},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    const isDashboard = !!pathname?.startsWith("/dashboard")
    const loginParam = searchParams?.get("login")
    const toastLockKey = "sc-login-toast-lock"
    if (!isDashboard) return
    if (loginParam !== "success") {
      sessionStorage.removeItem(toastLockKey)
      return
    }
    if (sessionStorage.getItem(toastLockKey) === "1") return
    sessionStorage.setItem(toastLockKey, "1")
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H1',location:'components/auth/LoginSuccessToast.tsx:16',message:'login toast shown',data:{pathname,loginParam:searchParams?.get('login')},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    toast.success("लॉगिन यशस्वी! स्वागत आहे.", { duration: 2500 })
    const url = new URL(pathname, window.location.origin)
    url.searchParams.delete("login")
    router.replace(url.pathname + (url.search || ""))
  }, [pathname, searchParams, router])

  return null
}
