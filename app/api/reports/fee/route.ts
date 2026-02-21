import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getFeeOverview } from "@/app/actions/fees"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const data = await getFeeOverview()
  if (!data) return NextResponse.json({ error: "No data" }, { status: 404 })

  const report = {
    totalCollected: data.totalCollected,
    totalPending: data.totalPending,
    classWiseStatus: data.classWiseStatus,
    defaulters: data.defaulters,
    generated: new Date().toISOString(),
  }

  return NextResponse.json(report, {
    headers: {
      "Content-Disposition": `attachment; filename="fee-report-${new Date().toISOString().split("T")[0]}.json"`,
    },
  })
}
