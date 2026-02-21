"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import type { DefaulterRow } from "./FeeTable"

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance {
  open: () => void
}

export function PaymentModal({
  student,
  onClose,
  onSuccess,
}: {
  student: DefaulterRow
  onClose: () => void
  onSuccess: () => void
}) {
  const [loading, setLoading] = useState(false)
  const scriptLoaded = useRef(false)

  const loadRazorpayScript = (): Promise<void> => {
    if (scriptLoaded.current) return Promise.resolve()
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.async = true
      script.onload = () => {
        scriptLoaded.current = true
        resolve()
      }
      script.onerror = () => resolve()
      document.body.appendChild(script)
    })
  }

  const initiatePayment = useCallback(async () => {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    if (!keyId) {
      toast.error("Razorpay कॉन्फिगर नाही")
      return
    }

    setLoading(true)
    try {
      await loadRazorpayScript()

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: student.id,
          amount: student.pendingAmount,
          fee_type: "वार्षिक शुल्क",
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || "Order तयार करण्यात अयशस्वी")
        return
      }

      const { order_id, amount } = data
      const Razorpay = window.Razorpay
      if (!Razorpay) {
        toast.error("Razorpay लोड नाही")
        return
      }

      const rzp = new Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        order_id,
        name: "ShalaConnect",
        description: `${student.name} - वार्षिक शुल्क`,
        handler: async (response) => {
          setLoading(true)
          try {
            const verifyRes = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()
            if (verifyRes.ok && verifyData.success) {
              toast.success(verifyData.message || "शुल्क यशस्वीरीत्या जमा झाले ✅")
              onSuccess()
              onClose()
            } else {
              toast.error(verifyData.error || "Payment verification अयशस्वी")
            }
          } catch {
            toast.error("Payment verification अयशस्वी")
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.open()
    } catch (err) {
      toast.error("Payment सुरू करण्यात अयशस्वी")
    } finally {
      setLoading(false)
    }
  }, [student.id, student.name, student.pendingAmount, onClose, onSuccess])

  useEffect(() => {
    initiatePayment()
  }, [initiatePayment])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl border border-border-school shadow-xl p-6 max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="font-bold text-text-900 text-base mb-2 font-[family-name:var(--font-noto-devanagari)]">
            शुल्क भरणा
          </div>
          <p className="text-sm text-text-600 mb-4 font-[family-name:var(--font-noto-devanagari)]">
            {student.name} — ₹{student.pendingAmount.toLocaleString("en-IN")}
          </p>
          {loading ? (
            <div className="flex items-center justify-center gap-2 text-saffron py-4">
              <div className="w-5 h-5 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-[family-name:var(--font-noto-devanagari)]">
                Razorpay उघडत आहे...
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-text-500 font-[family-name:var(--font-noto-devanagari)]">
                Razorpay विंडो बंद झाल असल्यास
              </p>
              <button
                onClick={initiatePayment}
                className="px-4 py-2 rounded-lg bg-saffron text-white text-sm font-semibold hover:bg-saffron-bright font-[family-name:var(--font-noto-devanagari)]"
              >
                पुन्हा प्रयत्न करा
              </button>
            </div>
          )}
          <button
            onClick={onClose}
            className="mt-4 w-full py-2 rounded-lg border border-border-school text-text-700 text-sm font-semibold hover:bg-saffron-pale font-[family-name:var(--font-noto-devanagari)]"
          >
            रद्द करा
          </button>
        </div>
      </div>
    </div>
  )
}
