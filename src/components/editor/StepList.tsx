import type { RoutineStep } from '../../types'
import { StepItem } from './StepItem'

interface StepListProps {
  steps: RoutineStep[]
  onMoveUp: (stepId: string) => void
  onMoveDown: (stepId: string) => void
  onRemove: (stepId: string) => void
}

export function StepList({ steps, onMoveUp, onMoveDown, onRemove }: StepListProps) {
  const sorted = [...steps].sort((a, b) => a.order - b.order)

  if (sorted.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <div className="text-4xl mb-3">📝</div>
        <p className="text-sm">No steps yet. Add your first step below!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {sorted.map((step, i) => (
        <div key={step.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
          <StepItem
            step={step}
            index={i}
            total={sorted.length}
            onMoveUp={() => onMoveUp(step.id)}
            onMoveDown={() => onMoveDown(step.id)}
            onRemove={() => onRemove(step.id)}
          />
        </div>
      ))}
    </div>
  )
}
