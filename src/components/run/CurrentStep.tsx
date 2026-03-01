import type { RoutineStep } from '../../types'
import { formatTime } from '../../lib/time'

interface CurrentStepProps {
  step: RoutineStep
  stepElapsedMs: number
  bestSplitMs?: number
}

export function CurrentStep({ step, stepElapsedMs, bestSplitMs }: CurrentStepProps) {
  const isAhead = bestSplitMs != null && stepElapsedMs < bestSplitMs
  const isBehind = bestSplitMs != null && stepElapsedMs >= bestSplitMs

  return (
    <div className="text-center py-4">
      <div className="text-5xl mb-3">{step.icon}</div>
      <h2 className="text-2xl font-bold mb-2">{step.name}</h2>
      <div
        className={`text-3xl font-mono font-bold tabular-nums ${
          isAhead ? 'text-ahead' : isBehind ? 'text-behind' : 'text-slate-100'
        }`}
      >
        {formatTime(stepElapsedMs)}
      </div>
      {bestSplitMs != null && (
        <div className="text-xs text-slate-400 mt-1">
          Best: {formatTime(bestSplitMs)}
        </div>
      )}
    </div>
  )
}
