import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: userData } = await supabase
    .from("users")
    .select("school_id")
    .eq("auth_id", user.id)
    .eq("role", "headmaster")
    .single()

  if (!userData?.school_id) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const admin = createAdminClient()
  const { data: school } = await admin
    .from("schools")
    .select("*")
    .eq("id", userData.school_id)
    .single()

  const { count: students } = await admin
    .from("students")
    .select("id", { count: "exact", head: true })
    .eq("school_id", userData.school_id)

  const { count: teachers } = await admin
    .from("users")
    .select("id", { count: "exact", head: true })
    .eq("school_id", userData.school_id)
    .eq("role", "teacher")

  const { count: classes } = await admin
    .from("classes")
    .select("id", { count: "exact", head: true })
    .eq("school_id", userData.school_id)

  const report = {
    school: school?.name ?? "—",
    udise: school?.udise_code ?? "—",
    district: school?.district ?? "—",
    taluka: school?.taluka ?? "—",
    type: school?.type ?? "—",
    students: students ?? 0,
    teachers: teachers ?? 0,
    classes: classes ?? 0,
    generated: new Date().toISOString(),
  }

  return NextResponse.json(report, {
    headers: {
      "Content-Disposition": `attachment; filename="udise-${report.udise || "report"}.json"`,
    },
  })
}
