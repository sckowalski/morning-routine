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
      <div className="min-h-dvh bg-[#161210] flex items-center justify-center">
        <div className="text-sm text-slate-500 animate-pulse-glow">Loading...</div>
      </div>
    )
  }

  const isNewPB = pb && run.totalTime != null && run.totalTime <= pb.totalTime
  const totalDelta = pb && run.totalTime != null ? run.totalTime - pb.totalTime : undefined

  const stepMap = new Map(routine.steps.map((s) => [s.id, s]))

  return (
    <div className="min-h-dvh bg-[#161210] text-stone-200 flex flex-col p-4 pb-[env(safe-area-inset-bottom)]">
      <div className="relative flex flex-col flex-1 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <div className="text-5xl mb-3">{isNewPB ? '🏆' : '✅'}</div>
          <h1 className="font-heading text-xl font-bold">
            {isNewPB ? (
              <span className="text-pb-gold">New Personal Best!</span>
            ) : (
              'Run Complete!'
            )}
          </h1>
          {run.xpEarned > 0 && (
            <div className="text-xs text-neutral font-medium mt-2">+{run.xpEarned} XP</div>
          )}
        </div>

        {/* Total time */}
        <div className={`text-center py-5 rounded-2xl mb-5 border ${
          isNewPB ? 'bg-pb-gold/5 border-pb-gold/15' : 'card border-white/5'
        }`}>
          <div className="text-xs text-slate-500 font-medium mb-1">Total Time</div>
          <div className={`font-heading text-4xl font-bold tabular-nums ${
            isNewPB ? 'text-pb-gold' : 'text-slate-100'
          }`}>
            {run.totalTime != null ? formatTime(run.totalTime) : '--:--'}
          </div>
          {totalDelta != null && totalDelta !== 0 && (
            <div className="mt-3">
              <DeltaBadge deltaMs={totalDelta} />
            </div>
          )}
        </div>

        {/* Splits */}
        <div className="flex-1">
          <h2 className="text-xs text-slate-500 font-medium tracking-wide mb-3">Splits</h2>
          <div className="flex flex-col gap-2">
            {run.splits.map((split, i) => {
              const step = stepMap.get(split.stepId)
              if (!step) return null

              const bestSplitMs = pb?.splits[split.stepId]
              const isNewBestSplit = bestSplitMs != null && split.duration <= bestSplitMs

              return (
                <div key={split.stepId} className="animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <SplitRow
                    step={step}
                    durationMs={split.duration}
                    bestMs={bestSplitMs}
                    isNewBest={isNewBestSplit}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6">
          <button
            onClick={() => navigate('/', { replace: true })}
            className="w-full py-4 rounded-2xl font-heading text-lg font-bold tracking-wide
              bg-neutral text-white active:scale-[0.97] transition-all duration-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
