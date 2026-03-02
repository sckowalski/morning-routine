import type { RoutineStep } from '../../types'

interface StepSidebarProps {
  steps: RoutineStep[]
  activeStepId: string | null
  completedStepIds: string[]
  onSelectStep: (stepId: string) => void
}

export function StepSidebar({ steps, activeStepId, completedStepIds, onSelectStep }: StepSidebarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step) => {
        const isCompleted = completedStepIds.includes(step.id)
        const isActive = step.id === activeStepId
        const canSelect = !isCompleted && !isActive

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => canSelect && onSelectStep(step.id)}
            disabled={isCompleted}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isCompleted
                ? 'bg-ahead/20 text-ahead'
                : isActive
                  ? 'bg-neutral/20 ring-2 ring-neutral text-neutral'
                  : 'bg-surface-raised text-slate-400 active:bg-surface-overlay'
            }`}
          >
            {isCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clipRule="evenodd" />
              </svg>
            ) : (
              <span>{step.icon}</span>
            )}
            <span className="whitespace-nowrap">{step.name}</span>
          </button>
        )
      })}
    </div>
  )
}
