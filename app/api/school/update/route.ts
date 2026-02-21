import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })

    const { data: userData } = await supabase
      .from("users")
      .select("school_id")
      .eq("auth_id", user.id)
      .eq("role", "headmaster")
      .single()

    const body = await request.json()
    const { school_id, name, district, taluka, udise_code, address, phone, email } = body

    if (!school_id || userData?.school_id !== school_id) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const admin = createAdminClient()
    const { error } = await admin
      .from("schools")
      .update({
        name: name?.trim(),
        district: district?.trim(),
        taluka: taluka?.trim(),
        udise_code: udise_code?.trim() || null,
        address: address?.trim() || null,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", school_id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "अयशस्वी" },
      { status: 500 }
    )
  }
}
