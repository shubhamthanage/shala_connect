"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import toast from "react-hot-toast"

export function LoginSuccessToast() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
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
    toast.success("लॉगिन यशस्वी! स्वागत आहे.", { duration: 2500 })
    const url = new URL(pathname, window.location.origin)
    url.searchParams.delete("login")
    router.replace(url.pathname + (url.search || ""))
  }, [pathname, searchParams, router])

  return null
}
