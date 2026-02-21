"use client"

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
}

export function EmptyState({
  icon = "📋",
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-cream border border-border-school flex items-center justify-center text-4xl mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-text-900 text-lg font-body mb-2">{title}</h3>
      {description && (
        <p className="text-text-500 text-sm font-body max-w-sm mb-6">{description}</p>
      )}
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <a
            href={actionHref}
            className="btn-primary px-6 py-3 text-sm"
          >
            {actionLabel}
          </a>
        ) : (
          <button onClick={onAction} className="btn-primary px-6 py-3 text-sm">
            {actionLabel}
          </button>
        )
      )}
    </div>
  )
}
