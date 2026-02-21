import { NextRequest, NextResponse } from "next/server"
import { sendFeeReminder } from "@/app/actions/fees"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { student_id } = body

    if (!student_id) {
      return NextResponse.json(
        { success: false, error: "student_id आवश्यक आहे" },
        { status: 400 }
      )
    }

    const result = await sendFeeReminder(student_id)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Send reminder error:", err)
    return NextResponse.json(
      { success: false, error: "Reminder पाठवण्यात अयशस्वी" },
      { status: 500 }
    )
  }
}
