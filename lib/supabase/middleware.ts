import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseFetch } from "./fetch"

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: createSupabaseFetch() },
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, {
              ...options,
              path: options?.path ?? "/",
            })
          )
        },
      },
    }
  )

  try {
    await supabase.auth.getSession()
  } catch (e) {
    const msg = (e as Error)?.message ?? ""
    // Database error / invalid session — clear auth and redirect to login so user can retry
    if (msg.includes("Database error") || msg.includes("querying schema")) {
      const loginUrl = new URL("/login?error=db_error", request.url)
      const res = NextResponse.redirect(loginUrl)
      // Clear auth cookies
      request.cookies.getAll().forEach((c) => {
        if (c.name.startsWith("sb-")) res.cookies.set(c.name, "", { maxAge: 0, path: "/" })
      })
      return res
    }
    throw e
  }
  return response
}
