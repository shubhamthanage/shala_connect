import { redirect } from "next/navigation"
import { getParentDashboard } from "@/app/actions/parent"
import Link from "next/link"

export default async function ParentDashboardPage() {
  const data = await getParentDashboard()
  if (!data) redirect("/login?error=no_school")

  const formatCurrency = (n: number) => {
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }

  const today = new Date()
  const dayNames = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"]
  const monthNames = ["जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`

  return (
    <div className="flex flex-col h-full">
      {/* Topbar */}
      <div className="h-[60px] bg-white border-b border-border-school flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
        <div>
          <div className="font-bold text-text-900 text-[17px] font-[family-name:var(--font-noto-devanagari)]">
            👨‍👩‍👦 पालक डॅशबोर्ड
          </div>
          <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">{dateStr} · तुमच्या मुलांची प्रगती</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-base">
            👨‍👩‍👦
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {data.children.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-school p-16 text-center shadow-sm">
            <div className="text-5xl mb-4">👶</div>
            <h3 className="font-bold text-text-900 text-lg mb-2 font-[family-name:var(--font-noto-devanagari)]">
              मुलांची माहिती जोडलेली नाही
            </h3>
            <p className="text-text-500 font-[family-name:var(--font-noto-devanagari)] max-w-sm mx-auto">
              अजून मुलांची माहिती जोडली गेली नाही. शाळेशी संपर्क करा.
            </p>
          </div>
        ) : (
          <>
            {/* Summary bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 animate-fade-in-up">
              <div className="bg-white rounded-2xl p-4 border border-border-school shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-violet-500 to-purple-600" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-xl">👦</div>
                  <div>
                    <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">{data.children.length}</div>
                    <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">मुले नोंदणीकृत</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-border-school shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-saffron to-gold" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-saffron/10 flex items-center justify-center text-xl">📋</div>
                  <div>
                    <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
                      {data.children.length > 0
                        ? `${Math.round(data.children.reduce((sum, c) => sum + c.attendancePct, 0) / data.children.length)}%`
                        : "—"}
                    </div>
                    <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">सरासरी हजेरी</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-border-school shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl bg-gradient-to-r from-red-400 to-red-500" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-xl">💰</div>
                  <div>
                    <div className="font-extrabold text-text-900 text-2xl font-[family-name:var(--font-noto-devanagari)]">
                      {formatCurrency(data.children.reduce((sum, c) => sum + c.feePending, 0))}
                    </div>
                    <div className="text-[11px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">एकूण शुल्क बाकी</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Children cards */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-purple-600" />
              <h2 className="font-bold text-text-900 text-base font-[family-name:var(--font-noto-devanagari)]">माझी मुले</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.children.map((c) => {
                const attendanceColor = c.attendancePct >= 75 ? "text-green-mid" : "text-red-500"
                const attendanceBg = c.attendancePct >= 75 ? "bg-green-pale" : "bg-red-50"
                const attendanceBarColor = c.attendancePct >= 75 ? "bg-gradient-to-r from-green-mid to-green-bright" : "bg-gradient-to-r from-red-400 to-red-500"

                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-2xl border border-border-school shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    {/* Card header */}
                    <div className="bg-gradient-to-br from-navy to-navy-3 p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-2xl">
                          👦
                        </div>
                        <div>
                          <div className="font-bold text-white text-base font-[family-name:var(--font-noto-devanagari)]">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-white/55 font-[family-name:var(--font-noto-devanagari)]">
                            {c.classLabel}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      {/* Attendance */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[12px] font-semibold text-text-700 font-[family-name:var(--font-noto-devanagari)]">हजेरी</span>
                          <span className={`text-[12px] font-bold ${attendanceColor} font-[family-name:var(--font-noto-devanagari)]`}>{c.attendancePct}%</span>
                        </div>
                        <div className="h-2 bg-border-school rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${attendanceBarColor}`}
                            style={{ width: `${Math.min(c.attendancePct, 100)}%` }}
                          />
                        </div>
                        {c.attendancePct < 75 && (
                          <p className="text-[10px] text-red-500 mt-1 font-[family-name:var(--font-noto-devanagari)]">
                            ⚠️ ७५% पेक्षा कमी हजेरी
                          </p>
                        )}
                      </div>

                      {/* Stats row */}
                      <div className="grid grid-cols-2 gap-2.5 mb-4">
                        <div className="bg-[#F4F7FB] rounded-xl p-3 text-center">
                          <div className="font-extrabold text-text-900 text-xl font-[family-name:var(--font-noto-devanagari)]">
                            {c.avgMarks}
                          </div>
                          <div className="text-[10px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">सरासरी गुण</div>
                        </div>
                        <div className="bg-[#F4F7FB] rounded-xl p-3 text-center">
                          <div className={`font-extrabold text-xl font-[family-name:var(--font-noto-devanagari)] ${c.feePending > 0 ? "text-red-500" : "text-green-mid"}`}>
                            {c.feePending > 0 ? formatCurrency(c.feePending) : "✓ भरले"}
                          </div>
                          <div className="text-[10px] text-text-300 font-[family-name:var(--font-noto-devanagari)]">शुल्क बाकी</div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      {c.feePending > 0 && (
                        <Link
                          href="/dashboard/parent"
                          className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-br from-saffron to-saffron-bright text-white text-sm font-semibold shadow-md shadow-saffron/25 hover:shadow-lg hover:-translate-y-0.5 transition-all font-[family-name:var(--font-noto-devanagari)]"
                        >
                          💰 शुल्क भरा
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Info banner */}
            <div className="mt-6 bg-gradient-to-br from-navy to-navy-3 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-base mb-1 font-[family-name:var(--font-noto-devanagari)]">
                  WhatsApp अलर्ट्स सक्रिय आहेत
                </div>
                <p className="text-sm text-white/55 font-[family-name:var(--font-noto-devanagari)]">
                  हजेरी, परीक्षा, शुल्क — सर्व माहिती WhatsApp वर मिळेल
                </p>
              </div>
              <div className="text-4xl">📱</div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
