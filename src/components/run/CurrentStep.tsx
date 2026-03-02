import { useRef, useState, useCallback } from 'react'
import type { RoutineStep } from '../../types'
import { formatTime } from '../../lib/time'

interface CurrentStepProps {
  step: RoutineStep
  stepElapsedMs: number
  bestSplitMs?: number
  onComplete?: () => void
}

export function CurrentStep({ step, stepElapsedMs, bestSplitMs, onComplete }: CurrentStepProps) {
  const isAhead = bestSplitMs != null && stepElapsedMs < bestSplitMs
  const isBehind = bestSplitMs != null && stepElapsedMs >= bestSplitMs

  const lastTapRef = useRef(0)
  const [tapFeedback, setTapFeedback] = useState(false)
  const [completionFlash, setCompletionFlash] = useState(false)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const elapsed = now - lastTapRef.current
    lastTapRef.current = now

    if (elapsed < 300 && onComplete) {
      // Double tap — gold flash then complete
      setTapFeedback(false)
      setCompletionFlash(true)
      setTimeout(() => {
        setCompletionFlash(false)
        onComplete()
      }, 300)
    } else {
      // Single tap — pulse feedback
      setTapFeedback(true)
      setTimeout(() => setTapFeedback(false), 200)
    }
  }, [onComplete])

  return (
    <div className="text-center py-4">
      <button
        type="button"
        onClick={handleTap}
        className={`relative w-24 h-24 mx-auto mb-4 rounded-full bg-neutral/8 border-2 flex items-center justify-center touch-action-manipulation transition-all duration-200 ${
          completionFlash
            ? 'border-pb-gold glow-gold scale-105'
            : 'border-neutral/40'
        } ${tapFeedback ? 'scale-105' : ''}`}
      >
        <span className="text-5xl">{step.icon}</span>
        {tapFeedback && (
          <span className="absolute inset-0 rounded-full border-2 border-neutral/30 animate-ping-once" />
        )}
      </button>
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
