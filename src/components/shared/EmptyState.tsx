interface EmptyStateProps {
  icon: string
  title: string
  description: string
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="text-6xl mb-4 drop-shadow-lg">{icon}</div>
      <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">{description}</p>
    </div>
  )
}
