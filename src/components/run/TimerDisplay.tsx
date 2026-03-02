import { formatTime } from '../../lib/time'

interface TimerDisplayProps {
  elapsedMs: number
  label?: string
}

export function TimerDisplay({ elapsedMs, label }: TimerDisplayProps) {
  return (
    <div className="text-center">
      {label && (
        <div className="text-xs text-slate-500 font-medium tracking-wide mb-1">
          {label}
        </div>
      )}
      <div className="font-heading text-5xl font-bold tabular-nums text-slate-100">
        {formatTime(elapsedMs)}
      </div>
    </div>
  )
}
