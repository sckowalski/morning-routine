import type { RoutineStep } from '../../types'
import { formatTime } from '../../lib/time'
import { DeltaBadge } from '../shared/DeltaBadge'

interface SplitRowProps {
  step: RoutineStep
  durationMs: number
  bestMs?: number
  isNewBest?: boolean
  skipped?: boolean
}

export function SplitRow({ step, durationMs, bestMs, isNewBest, skipped }: SplitRowProps) {
  const deltaMs = !skipped && bestMs != null ? durationMs - bestMs : undefined

  return (
    <div className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-colors ${
      skipped
        ? 'card border-white/5 opacity-40'
        : isNewBest
          ? 'bg-pb-gold/5 border-pb-gold/15'
          : 'card border-white/5'
    }`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{step.icon}</span>
        <div>
          <div className="font-medium text-sm">{step.name}</div>
          {skipped && (
            <div className="text-[9px] text-slate-500 mt-0.5">Skipped</div>
          )}
          {!skipped && isNewBest && (
            <div className="font-heading text-[9px] text-pb-gold mt-0.5">
              New Best!
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        {skipped ? (
          <div className="text-sm text-slate-500">Skipped</div>
        ) : (
          <>
            <div className="font-heading text-base font-bold tabular-nums">
              {formatTime(durationMs)}
            </div>
            {deltaMs != null && <DeltaBadge deltaMs={deltaMs} />}
          </>
        )}
      </div>
    </div>
  )
}
