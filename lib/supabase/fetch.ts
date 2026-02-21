/**
 * Custom fetch with retry and timeout for Supabase auth.
 * Handles transient "fetch failed" / network errors.
 */
const TIMEOUT_MS = 30_000
const RETRIES = 3
const RETRY_DELAY_MS = 1000

function isRetryableError(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message?.toLowerCase() ?? ""
    return (
      msg.includes("fetch failed") ||
      msg.includes("failed to fetch") ||
      msg.includes("network") ||
      msg.includes("econnreset") ||
      msg.includes("etimedout") ||
      msg.includes("econnrefused")
    )
  }
  return false
}

export function createSupabaseFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit) => {
    let lastError: unknown
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)
      try {
        const res = await fetch(input, {
          ...init,
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        return res
      } catch (e) {
        clearTimeout(timeoutId)
        lastError = e
        if (attempt < RETRIES && isRetryableError(e)) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt))
          continue
        }
        throw e
      }
    }
    throw lastError
  }
}
