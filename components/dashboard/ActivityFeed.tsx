export interface Activity {
  icon: string
  iconBg: string
  title: string
  time: string
}

export function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border-school overflow-hidden">
      <div className="px-4 py-4 border-b border-border-school">
        <span className="font-bold text-text-900 text-sm font-heading">
          🕐 अलीकडील कार्ये
        </span>
      </div>
      <div className="p-4">
        <div className="flex flex-col gap-3">
          {activities.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                style={{ background: a.iconBg }}
              >
                {a.icon}
              </div>
              <div>
                <div className="font-semibold text-text-900 text-xs font-body">
                  {a.title}
                </div>
                <div className="text-[10px] text-text-300 mt-0.5 font-body">
                  {a.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
