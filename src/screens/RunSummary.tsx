import { useParams, useNavigate } from 'react-router-dom'
import { useRun } from '../hooks/useRuns'
import { useRoutine } from '../hooks/useRoutine'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { formatTime } from '../lib/time'
import { SplitRow } from '../components/run/SplitRow'
import { DeltaBadge } from '../components/shared/DeltaBadge'

export function RunSummary() {
  const { runId } = useParams<{ runId: string }>()
  const navigate = useNavigate()
  const run = useRun(runId)
  const routine = useRoutine()
  const pb = usePersonalBests(routine?.id)

  if (!run || !routine) {
    return (
      <div className="min-h-dvh bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  const isNewPB = pb && run.totalTime != null && run.totalTime <= pb.totalTime
  const totalDelta = pb && run.totalTime != null ? run.totalTime - pb.totalTime : undefined

  const stepMap = new Map(routine.steps.map((s) => [s.id, s]))

  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100 flex flex-col p-4 pb-[env(safe-area-inset-bottom)]">
      {/* Header */}
      <div className="text-center mb-6">
        {isNewPB ? (
          <div className="text-4xl mb-2">🏆</div>
        ) : (
          <div className="text-4xl mb-2">✅</div>
        )}
        <h1 className="text-2xl font-bold mb-1">
          {isNewPB ? 'New Personal Best!' : 'Run Complete!'}
        </h1>
        {run.xpEarned > 0 && (
          <div className="text-neutral text-sm font-medium">+{run.xpEarned} XP</div>
        )}
      </div>

      {/* Total time */}
      <div className={`text-center py-4 rounded-2xl mb-4 ${isNewPB ? 'bg-pb-gold/10' : 'bg-surface-raised'}`}>
        <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Time</div>
        <div className={`text-4xl font-mono font-bold tabular-nums ${isNewPB ? 'text-pb-gold' : ''}`}>
          {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
        </div>
        {totalDelta != null && totalDelta !== 0 && (
          <div className="mt-2">
            <DeltaBadge deltaMs={totalDelta} />
          </div>
        )}
      </div>

      {/* Splits */}
      <div className="flex-1">
        <h2 className="text-sm text-slate-400 uppercase tracking-wider mb-2">Splits</h2>
        <div className="flex flex-col gap-2">
          {run.splits.map((split) => {
            const step = stepMap.get(split.stepId)
            if (!step) return null

            const bestSplitMs = pb?.splits[split.stepId]
            const isNewBestSplit = bestSplitMs != null && split.duration <= bestSplitMs

            return (
              <SplitRow
                key={split.stepId}
                step={step}
                durationMs={split.duration}
                bestMs={bestSplitMs}
                isNewBest={isNewBestSplit}
              />
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => navigate('/', { replace: true })}
          className="w-full py-4 rounded-2xl bg-neutral text-white text-lg font-bold active:scale-95 transition-transform"
        >
          Done
        </button>
      </div>
    </div>
  )
}
