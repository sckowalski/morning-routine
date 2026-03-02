interface ProgressBarProps {
  totalSteps: number
  completedSteps: number
}

export function ProgressBar({ totalSteps, completedSteps }: ProgressBarProps) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
            i < completedSteps
              ? 'bg-ahead shadow-[0_0_6px_rgba(52,211,153,0.4)]'
              : i === completedSteps
                ? 'bg-neutral/60 shadow-[0_0_6px_rgba(246,177,122,0.3)]'
                : 'bg-white/5'
          }`}
        />
      ))}
    </div>
  )
}
