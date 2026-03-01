import type { RoutineStep } from '../../types'

interface StepItemProps {
  step: RoutineStep
  index: number
  total: number
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function StepItem({ step, index, total, onMoveUp, onMoveDown, onRemove }: StepItemProps) {
  return (
    <div className="flex items-center gap-3 bg-surface-raised rounded-xl px-4 py-3">
      <span className="text-2xl">{step.icon}</span>
      <span className="flex-1 font-medium">{step.name}</span>

      <div className="flex items-center gap-1">
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-8 h-8 rounded-lg bg-surface text-slate-400 text-sm disabled:opacity-20 hover:bg-surface-overlay active:scale-95 transition"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="w-8 h-8 rounded-lg bg-surface text-slate-400 text-sm disabled:opacity-20 hover:bg-surface-overlay active:scale-95 transition"
          aria-label="Move down"
        >
          ▼
        </button>
        <button
          onClick={onRemove}
          className="w-8 h-8 rounded-lg bg-behind/20 text-behind text-sm hover:bg-behind/30 active:scale-95 transition"
          aria-label="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
