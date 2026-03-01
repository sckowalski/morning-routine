import { formatTime } from '../../lib/time'

interface TimerDisplayProps {
  elapsedMs: number
  label?: string
}

export function TimerDisplay({ elapsedMs, label }: TimerDisplayProps) {
  return (
    <div className="text-center">
      {label && <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</div>}
      <div className="text-5xl font-mono font-bold tabular-nums tracking-tight">
        {formatTime(elapsedMs)}
      </div>
    </div>
  )
}
