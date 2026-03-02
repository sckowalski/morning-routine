import { formatTime } from '../../lib/time'

interface TimerDisplayProps {
  elapsedMs: number
  label?: string
  size?: 'default' | 'small'
}

export function TimerDisplay({ elapsedMs, label, size = 'default' }: TimerDisplayProps) {
  return (
    <div className="text-center">
      {label && (
        <div className="text-xs text-slate-500 font-medium tracking-wide mb-1">
          {label}
        </div>
      )}
      <div className={`font-heading font-bold tabular-nums ${
        size === 'small'
          ? 'text-xl text-slate-300'
          : 'text-5xl text-slate-100'
      }`}>
        {formatTime(elapsedMs)}
      </div>
    </div>
  )
}
