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
    <div className="bg-surface-raised rounded-2xl p-4">
      <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Last Run</h3>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-mono font-bold tabular-nums">
            {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
          </div>
          <div className="text-sm text-slate-400">
            {formatDate(run.startTime)} at {formatTimeOfDay(run.startTime)}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!run.completed && (
            <span className="text-xs text-behind font-medium">Abandoned</span>
          )}
          {delta != null && <DeltaBadge deltaMs={delta} />}
        </div>
      </div>
    </div>
  )
}
