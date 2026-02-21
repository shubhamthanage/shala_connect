import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { createSupabaseFetch } from "./fetch"

export async function updateSession(request: NextRequest) {
  // #region agent log
  fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H2',location:'lib/supabase/middleware.ts:6',message:'middleware start',data:{pathname:request.nextUrl.pathname,isRsc:request.headers.get('rsc')==='1',sbCookieCount:request.cookies.getAll().filter(c=>c.name.startsWith('sb-')).length},timestamp:Date.now()})}).catch(()=>{})
  // #endregion
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
    const { data, error } = await supabase.auth.getSession()
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H2',location:'lib/supabase/middleware.ts:35',message:'middleware session result',data:{pathname:request.nextUrl.pathname,hasSession:!!data?.session,hasUser:!!data?.session?.user,error:error?.message??null},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
  } catch (e) {
    const msg = (e as Error)?.message ?? ""
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'repro-1',hypothesisId:'H2',location:'lib/supabase/middleware.ts:40',message:'middleware exception',data:{pathname:request.nextUrl.pathname,errorMessage:msg},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
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
