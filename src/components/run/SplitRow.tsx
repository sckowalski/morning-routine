import type { RoutineStep } from '../../types'
import { formatTime } from '../../lib/time'
import { DeltaBadge } from '../shared/DeltaBadge'

interface SplitRowProps {
  step: RoutineStep
  durationMs: number
  bestMs?: number
  isNewBest?: boolean
}

export function SplitRow({ step, durationMs, bestMs, isNewBest }: SplitRowProps) {
  const deltaMs = bestMs != null ? durationMs - bestMs : undefined

  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-xl ${isNewBest ? 'bg-pb-gold/10' : 'bg-surface-raised'}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{step.icon}</span>
        <div>
          <div className="font-medium">{step.name}</div>
          {isNewBest && <div className="text-xs text-pb-gold font-medium">New Best!</div>}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="font-mono tabular-nums text-lg">{formatTime(durationMs)}</div>
        {deltaMs != null && (
          <DeltaBadge deltaMs={deltaMs} />
        )}
      </div>
    </div>
  )
}
