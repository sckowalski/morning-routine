interface ProgressBarProps {
  totalSteps: number
  completedSteps: number
}

export function ProgressBar({ totalSteps, completedSteps }: ProgressBarProps) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i < completedSteps
              ? 'bg-neutral'
              : i === completedSteps
                ? 'bg-neutral/50'
                : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}
