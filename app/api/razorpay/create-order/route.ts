import { NextRequest, NextResponse } from "next/server"
import Razorpay from "razorpay"
import { createAdminClient } from "@/lib/supabase/admin"

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay कॉन्फिगर नाही. RAZORPAY_KEY_ID आणि RAZORPAY_KEY_SECRET सेट करा." },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { student_id, amount, fee_type = "वार्षिक शुल्क" } = body

    if (!student_id || !amount || amount <= 0) {
      return NextResponse.json(
        { error: "student_id आणि amount आवश्यक आहेत" },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const { data: student, error: studentError } = await admin
      .from("students")
      .select("id, name, class_id, school_id")
      .eq("id", student_id)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: "विद्यार्थी आढळला नाही" }, { status: 404 })
    }

    let feeStructureId: string

    const { data: existing } = await admin
      .from("fee_structures")
      .select("id")
      .eq("school_id", student.school_id)
      .eq("class_id", student.class_id)
      .eq("fee_type", fee_type)
      .eq("academic_year", "2024-25")
      .limit(1)
      .single()

    if (existing) {
      feeStructureId = existing.id
    } else {
      const { data: inserted, error: insertErr } = await admin
        .from("fee_structures")
        .insert({
          school_id: student.school_id,
          class_id: student.class_id,
          fee_type,
          amount: Number(amount),
          academic_year: "2024-25",
        })
        .select("id")
        .single()

      if (insertErr || !inserted) {
        return NextResponse.json(
          { error: "Fee structure तयार करण्यात अयशस्वी" },
          { status: 500 }
        )
      }
      feeStructureId = inserted.id
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    const amountPaise = Math.round(Number(amount) * 100)

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: `SC-${student_id.slice(0, 8)}`,
      notes: {
        student_id,
        fee_structure_id: feeStructureId,
        fee_type,
      },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: amountPaise,
      currency: order.currency,
      fee_structure_id: feeStructureId,
    })
  } catch (err) {
    console.error("Razorpay create-order error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Order तयार करण्यात अयशस्वी" },
      { status: 500 }
    )
  }
}
