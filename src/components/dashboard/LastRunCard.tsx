import type { Run } from '../../types'
import { formatTime, formatDate, formatTimeOfDay } from '../../lib/time'
import { DeltaBadge } from '../shared/DeltaBadge'

interface LastRunCardProps {
  run: Run
  pbTotalTime?: number
}

export function LastRunCard({ run, pbTotalTime }: LastRunCardProps) {
  const delta = run.totalTime != null && pbTotalTime != null
    ? run.totalTime - pbTotalTime
    : undefined

  return (
    <div className="card px-4 py-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <h3 className="text-xs text-slate-500 font-medium tracking-wide mb-2">Last Run</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-heading text-2xl font-bold tabular-nums text-slate-200">
            {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {formatDate(run.startTime)} at {formatTimeOfDay(run.startTime)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {!run.completed && (
            <span className="text-[10px] font-medium text-behind/80">Abandoned</span>
          )}
          {delta != null && <DeltaBadge deltaMs={delta} />}
        </div>
      </div>
    </div>
  )
}
