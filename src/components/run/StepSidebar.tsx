import { useState, useRef, useCallback } from 'react'
import type { RoutineStep, Split } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface StepSidebarProps {
  steps: RoutineStep[]
  activeStepId: string | null
  completedStepIds: string[]
  splits: Split[]
  stepElapsedMs: number
  stepAccumulatedMs: Record<string, number>
  onSelectStep: (stepId: string) => void
  onCompleteStep?: () => void
}

const DOUBLE_TAP_DELAY = 300

export function StepSidebar({
  steps,
  activeStepId,
  completedStepIds,
  splits,
  stepElapsedMs,
  stepAccumulatedMs,
  onSelectStep,
  onCompleteStep,
}: StepSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const lastTapRef = useRef<{ stepId: string; time: number } | null>(null)

  const handleStepTap = useCallback((stepId: string) => {
    const isCompleted = completedStepIds.includes(stepId)
    if (isCompleted) return

    const now = Date.now()
    const lastTap = lastTapRef.current

    // Double-tap on active step = complete it
    if (
      lastTap &&
      lastTap.stepId === stepId &&
      now - lastTap.time < DOUBLE_TAP_DELAY &&
      stepId === activeStepId &&
      onCompleteStep
    ) {
      lastTapRef.current = null
      onCompleteStep()
      return
    }

    lastTapRef.current = { stepId, time: now }

    // Single tap on non-active step = select it
    if (stepId !== activeStepId) {
      onSelectStep(stepId)
    }
  }, [activeStepId, completedStepIds, onSelectStep, onCompleteStep])

  const getStepTime = (stepId: string): string | null => {
    // Completed step — show final split duration
    const split = splits.find((s) => s.stepId === stepId)
    if (split) return formatTimeShort(split.duration)

    // Active step — show live elapsed
    if (stepId === activeStepId) return formatTimeShort(stepElapsedMs)

    // Step with accumulated time (visited but switched away)
    const accumulated = stepAccumulatedMs[stepId]
    if (accumulated && accumulated > 0) return formatTimeShort(accumulated)

    return null
  }

  return (
    <>
      {/* Backdrop — only when open */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-250 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Pull tab — always visible on right edge, moves with drawer */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-1/2 -translate-y-1/2 z-50 bg-surface-raised border border-white/8 border-r-0
          rounded-l-xl px-1.5 py-4 flex flex-col items-center gap-1.5 transition-all duration-250 ease-out
          active:bg-surface-overlay"
        style={{
          right: isOpen ? '16rem' : 0,
          boxShadow: '-2px 0 12px rgba(0,0,0,0.25)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`w-4 h-4 text-stone-400 transition-transform duration-250 ${isOpen ? '' : 'rotate-180'}`}
        >
          <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
        <span className="text-[9px] text-stone-500 font-heading [writing-mode:vertical-lr]">Steps</span>
      </button>

      {/* Drawer panel — always in DOM, slides via transform */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-surface border-l border-white/6
          flex flex-col transition-transform duration-250 ease-out"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: isOpen ? '-4px 0 24px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-white/5">
          <h3 className="font-heading text-sm font-semibold text-stone-300">Steps</h3>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-500 hover:text-stone-300 hover:bg-white/5 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Step list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-2 px-3">
          {steps.map((step) => {
            const isCompleted = completedStepIds.includes(step.id)
            const isActive = step.id === activeStepId
            const timeStr = getStepTime(step.id)

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleStepTap(step.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-1.5 transition-all duration-200 text-left ${
                  isCompleted
                    ? 'bg-ahead/5 opacity-50'
                    : isActive
                      ? 'bg-neutral/8 ring-2 ring-neutral/40'
                      : 'hover:bg-white/5 active:bg-white/8'
                }`}
              >
                {/* Icon circle */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted
                    ? 'bg-ahead/15 text-ahead'
                    : isActive
                      ? 'bg-neutral/10 ring-2 ring-neutral/50'
                      : 'bg-white/5'
                }`}>
                  {isCompleted ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}
                </div>

                {/* Step info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate ${
                    isCompleted
                      ? 'text-ahead/60 line-through'
                      : isActive
                        ? 'text-stone-100'
                        : 'text-stone-400'
                  }`}>
                    {step.name}
                  </div>
                  {isActive && (
                    <div className="text-[10px] text-neutral/60 mt-0.5">
                      Double-tap to complete
                    </div>
                  )}
                </div>

                {/* Time */}
                {timeStr && (
                  <span className={`text-xs font-heading tabular-nums flex-shrink-0 ${
                    isCompleted
                      ? 'text-ahead/50'
                      : isActive
                        ? 'text-neutral/80'
                        : 'text-stone-500'
                  }`}>
                    {timeStr}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Drawer footer */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-[10px] text-stone-500 text-center">
            {completedStepIds.length} of {steps.length} completed
          </div>
        </div>
      </div>
    </>
  )
}
