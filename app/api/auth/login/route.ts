import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { createSupabaseFetch } from "@/lib/supabase/fetch"

const DASHBOARD_PATHS: Record<string, string> = {
  headmaster: "/dashboard/headmaster",
  teacher: "/dashboard/teacher",
  clerk: "/dashboard/clerk",
  student: "/dashboard/student",
  parent: "/dashboard/parent",
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email?.trim() || !password) {
    return NextResponse.redirect(
      new URL("/login?error=invalid", request.url)
    )
  }

  const authCookies: Array<{ name: string; value: string; options?: Record<string, unknown> }> = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: createSupabaseFetch() },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          authCookies.push(...cookiesToSet)
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    const msg =
      error.message?.toLowerCase().includes("fetch failed") ||
      error.message?.toLowerCase().includes("failed to fetch")
        ? "Supabase से कनेक्ट होऊ शकत नाही. इंटरनेट तपासा, Supabase प्रोजेक्ट पॉझ्ड तर नाही ते पहा."
        : error.message
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(msg)}`, request.url)
    )
  }

  const actualRole = (data.user?.user_metadata?.role as string) ?? "headmaster"
  const path = DASHBOARD_PATHS[actualRole] ?? "/dashboard/headmaster"
  const url = new URL(path, request.url)
  url.searchParams.set("login", "success")
  const res = NextResponse.redirect(url)
  authCookies.forEach(({ name, value, options }) => {
    const opts = { ...(options || {}), path: "/" } as Record<string, unknown>
    res.cookies.set(name, value, opts)
  })
  return res
}
