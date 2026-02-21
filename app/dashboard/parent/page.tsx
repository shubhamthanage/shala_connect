import { redirect } from "next/navigation"
import { getParentDashboard } from "@/app/actions/parent"

export default async function ParentDashboardPage() {
  const data = await getParentDashboard()
  if (!data) redirect("/login?error=no_school")

  const formatCurrency = (n: number) => {
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-900 mb-2 font-[family-name:var(--font-noto-devanagari)]">
        👨‍👩‍👦 पालक डॅशबोर्ड
      </h1>
      <p className="text-text-500 mb-8 font-[family-name:var(--font-noto-devanagari)]">
        तुमच्या मुलांची प्रगती
      </p>

      {data.children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
          <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)]">
            अजून मुलांची माहिती जोडली गेली नाही. शाळेशी संपर्क करा.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.children.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl border border-border-school p-6 hover:shadow-lg transition-all"
            >
              <div className="font-bold text-text-900 text-lg mb-4 font-[family-name:var(--font-noto-devanagari)]">
                {c.name}
              </div>
              <div className="text-sm text-text-500 mb-3 font-[family-name:var(--font-noto-devanagari)]">
                {c.classLabel}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-saffron font-[family-name:var(--font-noto-devanagari)]">
                    {c.attendancePct}%
                  </div>
                  <div className="text-[10px] text-text-500 font-[family-name:var(--font-noto-devanagari)]">
                    हजेरी
                  </div>
                </div>
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
                    {c.avgMarks}
                  </div>
                  <div className="text-[10px] text-text-500 font-[family-name:var(--font-noto-devanagari)]">
                    सरासरी गुण
                  </div>
                </div>
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-text-900 font-[family-name:var(--font-noto-devanagari)]">
                    {formatCurrency(c.feePending)}
                  </div>
                  <div className="text-[10px] text-text-500 font-[family-name:var(--font-noto-devanagari)]">
                    शुल्क बाकी
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
