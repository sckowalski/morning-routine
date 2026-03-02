import type { Run } from '../../types'
import { formatTime, formatDate, formatTimeOfDay } from '../../lib/time'
import { DeltaBadge } from '../shared/DeltaBadge'

interface RunCardProps {
  run: Run
  pbTotalTime?: number
  onDelete?: () => void
}

export function RunCard({ run, pbTotalTime, onDelete }: RunCardProps) {
  const delta = run.totalTime != null && pbTotalTime != null
    ? run.totalTime - pbTotalTime
    : undefined

  return (
    <div className="card px-4 py-3 flex items-center justify-between border border-white/5">
      <div>
        <div className="font-heading text-lg font-bold tabular-nums">
          {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
        </div>
        <div className="text-xs text-slate-500 mt-0.5">
          {formatDate(run.startTime)} at {formatTimeOfDay(run.startTime)}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!run.completed && (
          <span className="font-heading text-[9px] bg-behind/10 text-behind/80 px-2 py-0.5 rounded-full border border-behind/15">
            Abandoned
          </span>
        )}
        {run.completed && delta != null && <DeltaBadge deltaMs={delta} />}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-behind hover:bg-behind/10
              transition-all duration-200"
            aria-label="Delete run"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.519.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 01.78.72l.5 6a.75.75 0 01-1.49.12l-.5-6a.75.75 0 01.71-.84zm2.84 0a.75.75 0 01.71.84l-.5 6a.75.75 0 11-1.49-.12l.5-6a.75.75 0 01.78-.72z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
