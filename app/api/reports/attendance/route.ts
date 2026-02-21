import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getHeadmasterSchoolId } from "@/app/actions/users"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const schoolId = await getHeadmasterSchoolId()
  if (!schoolId) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const admin = createAdminClient()
  const { data: classes } = await admin
    .from("classes")
    .select("id, grade, division")
    .eq("school_id", schoolId)
    .order("grade")
    .order("division")

  const today = new Date().toISOString().split("T")[0]
  const lines: string[] = ["वर्ग,विद्यार्थी,हजर,गैरहजर,तारीख"]

  for (const c of classes || []) {
    const { data: students } = await admin
      .from("students")
      .select("id")
      .eq("class_id", c.id)
    const total = students?.length ?? 0
    const { data: att } = await admin
      .from("attendance")
      .select("student_id, status")
      .eq("class_id", c.id)
      .eq("date", today)
    const present = (att || []).filter((a) => a.status === "present" || a.status === "late").length
    const absent = total - present
    lines.push(`इ.${c.grade}वी ${c.division},${total},${present},${absent},${today}`)
  }

  const csv = lines.join("\n")
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="hajeri-ahval-${today}.csv"`,
    },
  })
}
