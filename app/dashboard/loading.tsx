export default function DashboardLoading() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <div className="h-[60px] bg-white border-b border-border-school flex-shrink-0 animate-pulse" />
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-border-school overflow-hidden">
              <div className="h-8 w-8 rounded-lg skeleton-shimmer mb-3" />
              <div className="h-8 w-20 skeleton-shimmer rounded mb-2" />
              <div className="h-3 w-24 skeleton-shimmer rounded mb-2" />
              <div className="h-3 w-16 skeleton-shimmer rounded" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <div className="lg:col-span-2 h-[280px] bg-white rounded-2xl border border-border-school skeleton-shimmer" />
          <div className="h-[280px] bg-white rounded-2xl border border-border-school skeleton-shimmer" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-[240px] bg-white rounded-2xl border border-border-school skeleton-shimmer" />
          <div className="h-[240px] bg-white rounded-2xl border border-border-school skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}
