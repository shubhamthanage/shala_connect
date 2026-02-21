import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendWhatsApp } from "@/lib/whatsapp"
import type { TemplateName, TemplateParams } from "@/lib/templates"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { to, template, params, school_id, target_user_id } = body as {
      to: string
      template: TemplateName
      params: TemplateParams[TemplateName]
      school_id: string
      target_user_id?: string | null
    }

    if (!to || !template || !params || !school_id) {
      return NextResponse.json(
        { success: false, error: "to, template, params आणि school_id आवश्यक आहेत" },
        { status: 400 }
      )
    }

    const validTemplates: TemplateName[] = [
      "ATTENDANCE_ABSENT",
      "FEE_REMINDER",
      "EXAM_REMINDER",
      "RESULT_PUBLISHED",
    ]
    if (!validTemplates.includes(template)) {
      return NextResponse.json(
        { success: false, error: `अवैध template: ${template}` },
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

    const result = await sendWhatsApp(to, template, params, {
      schoolId: school_id,
      targetUserId: target_user_id ?? null,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message_id: result.messageId,
    })
  } catch (err) {
    console.error("Notify API error:", err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "अयशस्वी" },
      { status: 500 }
    )
  }
}
