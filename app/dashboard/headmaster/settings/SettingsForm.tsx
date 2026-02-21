"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

interface School {
  id: string
  name: string
  district: string
  taluka: string
  udise_code: string | null
  type: string
  address: string | null
  phone: string | null
  email: string | null
}

export function SettingsForm({ school }: { school: School }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: school.name,
    district: school.district,
    taluka: school.taluka,
    udise_code: school.udise_code ?? "",
    address: school.address ?? "",
    phone: school.phone ?? "",
    email: school.email ?? "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/school/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: school.id,
          ...form,
        }),
      })
      const data = await res.json()
      if (data.success) {
        toast.success("सेटिंग्ज अपडेट झाल्या")
        router.refresh()
      } else {
        toast.error(data.error || "अपडेट अयशस्वी")
      }
    } catch {
      toast.error("अपडेट अयशस्वी")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
          शाळेचे नाव
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-base"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
            जिल्हा
          </label>
          <input
            type="text"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
            className="input-base"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
            तालुका
          </label>
          <input
            type="text"
            value={form.taluka}
            onChange={(e) => setForm({ ...form, taluka: e.target.value })}
            className="input-base"
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
          U-DISE कोड
        </label>
        <input
          type="text"
          value={form.udise_code}
          onChange={(e) => setForm({ ...form, udise_code: e.target.value })}
          className="input-base"
          placeholder="उदा. 27123456789"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
          पत्ता
        </label>
        <textarea
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="input-base min-h-[80px]"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
            फोन
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-base"
            placeholder="९XXXXXXXXX"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-text-700 mb-1.5 font-body">
            ईमेल
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-base"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary px-6 py-3 text-sm disabled:opacity-70"
      >
        {loading ? "सेव करत आहे..." : "सेव करा"}
      </button>
    </form>
  )
}
