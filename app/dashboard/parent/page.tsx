import { getParentDashboard } from "@/app/actions/parent"

export default async function ParentDashboardPage() {
  const data = await getParentDashboard()
  if (!data) {
    // #region agent log
    fetch('http://127.0.0.1:7494/ingest/d3d650dc-d6d3-45b4-a032-ebf6afd1b805',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cee7fd'},body:JSON.stringify({sessionId:'cee7fd',runId:'post-fix-4',hypothesisId:'H13',location:'app/dashboard/parent/page.tsx',message:'parent page shows fallback instead of login redirect',data:{},timestamp:Date.now()})}).catch(()=>{})
    // #endregion
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-text-900 mb-2 font-body">
          👨‍👩‍👦 पालक डॅशबोर्ड
        </h1>
        <p className="text-text-500 mb-8 font-body">
          तुमच्या खात्याची माहिती सेटअप होत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.
        </p>
      </div>
    )
  }

  const formatCurrency = (n: number) => {
    if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
    return `₹${n}`
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-text-900 mb-2 font-body">
        👨‍👩‍👦 पालक डॅशबोर्ड
      </h1>
      <p className="text-text-500 mb-8 font-body">
        तुमच्या मुलांची प्रगती
      </p>

      {data.children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border-school p-12 text-center">
          <p className="text-text-500 font-body">
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
              <div className="font-bold text-text-900 text-lg mb-4 font-body">
                {c.name}
              </div>
              <div className="text-sm text-text-500 mb-3 font-body">
                {c.classLabel}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-saffron font-body">
                    {c.attendancePct}%
                  </div>
                  <div className="text-[10px] text-text-500 font-body">
                    हजेरी
                  </div>
                </div>
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-text-900 font-heading">
                    {c.avgMarks}
                  </div>
                  <div className="text-[10px] text-text-500 font-body">
                    सरासरी गुण
                  </div>
                </div>
                <div className="bg-cream rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-text-900 font-heading">
                    {formatCurrency(c.feePending)}
                  </div>
                  <div className="text-[10px] text-text-500 font-body">
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
