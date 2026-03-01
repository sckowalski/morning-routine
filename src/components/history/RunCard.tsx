import type { Run } from '../../types'
import { formatTime, formatDate, formatTimeOfDay } from '../../lib/time'
import { DeltaBadge } from '../shared/DeltaBadge'

interface RunCardProps {
  run: Run
  pbTotalTime?: number
}

export function RunCard({ run, pbTotalTime }: RunCardProps) {
  const delta = run.totalTime != null && pbTotalTime != null
    ? run.totalTime - pbTotalTime
    : undefined

  return (
    <div className="bg-surface-raised rounded-xl px-4 py-3 flex items-center justify-between">
      <div>
        <div className="font-mono font-bold tabular-nums text-lg">
          {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
        </div>
        <div className="text-sm text-slate-400">
          {formatDate(run.startTime)} at {formatTimeOfDay(run.startTime)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!run.completed && (
          <span className="text-xs bg-behind/20 text-behind px-2 py-0.5 rounded-full">
            Abandoned
          </span>
        )}
        {run.completed && delta != null && <DeltaBadge deltaMs={delta} />}
      </div>
    </div>
  )
}
