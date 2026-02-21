import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ notifications: [] }, { status: 200 })
    }

    const { data: userData } = await supabase
      .from("users")
      .select("school_id")
      .eq("auth_id", user.id)
      .single()

    if (!userData?.school_id) {
      return NextResponse.json({ notifications: [] }, { status: 200 })
    }

    const admin = createAdminClient()
    const { data, error } = await admin
      .from("notifications")
      .select("id, template, recipient_phone, status, created_at")
      .eq("school_id", userData.school_id)
      .order("created_at", { ascending: false })
      .limit(15)

    if (error) {
      return NextResponse.json({ notifications: [] }, { status: 200 })
    }

    const notifications = (data || []).map((n) => ({
      id: n.id,
      type: n.template,
      to: n.recipient_phone,
      status: n.status,
      time: n.created_at,
    }))

    return NextResponse.json({ notifications })
  } catch {
    return NextResponse.json({ notifications: [] }, { status: 200 })
  }
}
