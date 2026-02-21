/**
 * Runs when the Next.js server starts.
 * Forces IPv4-first DNS to avoid "fetch failed" with Supabase on networks
 * that don't support IPv6 properly (e.g. some VPNs, Docker, Railway).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const dns = await import("dns")
    dns.setDefaultResultOrder?.("ipv4first")
  }
}
