import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendBulkFeeReminders } from "@/app/actions/fees"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { school_id } = body

    if (!school_id) {
      return NextResponse.json(
        { success: false, error: "school_id आवश्यक आहे" },
        { status: 400 }
      )
    }

    const { data: userRow } = await supabase
      .from("users")
      .select("school_id")
      .eq("auth_id", user.id)
      .single()

    if (!userRow?.school_id || userRow.school_id !== school_id) {
      return NextResponse.json({ success: false, error: "या शाळेसाठी परवानगी नाही" }, { status: 403 })
    }

    const result = await sendBulkFeeReminders()

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, sent: result.sent ?? 0 })
  } catch (err) {
    console.error("Bulk reminder error:", err)
    return NextResponse.json(
      { success: false, error: "Reminder पाठवण्यात अयशस्वी" },
      { status: 500 }
    )
  }
}
