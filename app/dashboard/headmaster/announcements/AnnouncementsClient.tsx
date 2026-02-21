"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

export function AnnouncementsClient({ schoolId }: { schoolId: string }) {
  const [sending, setSending] = useState(false)
  const [notifications, setNotifications] = useState<Array<{
    id: string
    type: string
    to: string
    status: string
    time: string
  }>>([])

  useEffect(() => {
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotifications(d.notifications || []))
      .catch(() => {})
  }, [])

  const handleFeeReminder = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/fees/send-bulk-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ school_id: schoolId }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`${data.sent ?? 0} पालकांना फी रिमाइंडर पाठवला`)
        fetch("/api/notifications")
          .then((r) => r.json())
          .then((d) => setNotifications(d.notifications || []))
          .catch(() => {})
      } else {
        toast.error(data.error || "अयशस्वी")
      }
    } catch {
      toast.error("अयशस्वी")
    } finally {
      setSending(false)
    }
  }

  const statusLabel = (s: string) => {
    if (s === "sent") return "पाठवले"
    if (s === "failed") return "अयशस्वी"
    return "प्रलंबित"
  }

  return (
    <div className="space-y-6">
      <div className="card-elevated p-6">
        <h3 className="font-bold text-text-900 text-base font-body mb-2">
          त्वरित सूचना पाठवा
        </h3>
        <p className="text-sm text-text-500 font-body mb-4">
          थकित फी असलेल्या सर्व पालकांना WhatsApp रिमाइंडर पाठवा.
        </p>
        <button
          type="button"
          onClick={handleFeeReminder}
          disabled={sending}
          className="btn-primary px-6 py-3 text-sm disabled:opacity-70"
        >
          {sending ? "पाठवत आहे..." : "💰 फी रिमाइंडर पाठवा"}
        </button>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border-school">
          <span className="font-bold text-text-900 text-sm font-heading">
            अलीकडील सूचना
          </span>
        </div>
        {notifications.length === 0 ? (
          <div className="px-5 py-8 text-center text-text-500 text-sm font-body">
            अजून सूचना पाठवल्या नाहीत
          </div>
        ) : (
          <div className="divide-y divide-border-school">
            {notifications.slice(0, 15).map((n) => (
              <div
                key={n.id}
                className="px-5 py-3 flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-text-700 font-body">
                    {n.type}
                  </span>
                  <span className="text-xs text-text-500 font-body ml-2">
                    → {n.to}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    n.status === "sent"
                      ? "bg-green-pale text-green-mid"
                      : n.status === "failed"
                        ? "bg-red-50 text-red-500"
                        : "bg-amber-100 text-amber-700"
                  } font-body`}
                >
                  {statusLabel(n.status)}
                </span>
                <span className="text-[10px] text-text-300 font-body shrink-0">
                  {new Date(n.time).toLocaleDateString("mr-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
