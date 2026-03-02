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
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-neutral/8 border-2 border-neutral/25 flex items-center justify-center">
        <span className="text-5xl">{step.icon}</span>
      </div>
      <h2 className="font-heading text-xl font-bold text-slate-200 mb-3">
        {step.name}
      </h2>
      <div
        className={`font-heading text-4xl font-bold tabular-nums ${
          isAhead ? 'text-ahead' : isBehind ? 'text-behind' : 'text-slate-100'
        }`}
      >
        {formatTime(stepElapsedMs)}
      </div>
      {bestSplitMs != null && (
        <div className="text-xs text-slate-500 mt-2">
          Best: {formatTime(bestSplitMs)}
        </div>
      )}
    </div>
  )
}
