import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"

function generateReceiptNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(100000 + Math.random() * 900000)
  return `SC-${year}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json(
        { error: "RAZORPAY_KEY_SECRET सेट करा" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification मध्ये डेटा अपूर्ण आहे" },
        { status: 400 }
      )
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id
    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(sign)
      .digest("hex")

    if (expected !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment signature अवैध आहे" },
        { status: 400 }
      )
    }

    const admin = createAdminClient()

    const orderRes = await fetch(`https://api.razorpay.com/v1/orders/${razorpay_order_id}`, {
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.RAZORPAY_KEY_ID + ":" + keySecret).toString("base64"),
      },
    })

    if (!orderRes.ok) {
      return NextResponse.json({ error: "Order fetch अयशस्वी" }, { status: 500 })
    }

    const orderData = await orderRes.json()
    const notes = orderData.notes || {}
    const studentId = notes.student_id
    const feeStructureId = notes.fee_structure_id

    if (!studentId || !feeStructureId) {
      return NextResponse.json(
        { error: "Order notes मध्ये student_id किंवा fee_structure_id नाही" },
        { status: 400 }
      )
    }

    const amountPaid = (orderData.amount || 0) / 100
    const receiptNumber = generateReceiptNumber()

    const { error: insertErr } = await admin.from("fee_payments").insert({
      student_id: studentId,
      fee_structure_id: feeStructureId,
      amount_paid: amountPaid,
      payment_date: new Date().toISOString().split("T")[0],
      payment_mode: "razorpay",
      razorpay_order_id: razorpay_order_id,
      receipt_number: receiptNumber,
    })

    if (insertErr) {
      return NextResponse.json(
        { error: insertErr.message || "Payment रेकॉर्ड करण्यात अयशस्वी" },
        { status: 500 }
      )
    }

    // TODO: Send WhatsApp confirmation to parent
    // await sendWhatsAppConfirmation(studentId, amountPaid, receiptNumber)

    return NextResponse.json({
      success: true,
      receipt_number: receiptNumber,
      message: "शुल्क यशस्वीरीत्या जमा झाले ✅",
    })
  } catch (err) {
    console.error("Razorpay verify-payment error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Verification अयशस्वी" },
      { status: 500 }
    )
  }
}
