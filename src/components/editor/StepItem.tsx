import type { RoutineStep } from '../../types'

interface StepItemProps {
  step: RoutineStep
  index: number
  total: number
  onEdit: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onRemove: () => void
}

export function StepItem({ step, index, total, onEdit, onMoveUp, onMoveDown, onRemove }: StepItemProps) {
  return (
    <div className="flex items-center gap-3 card border border-white/5 px-4 py-3">
      <span className="text-2xl">{step.icon}</span>
      <span className="flex-1 font-medium text-sm">{step.name}</span>

      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 text-xs
            hover:bg-white/10 active:scale-90 transition-all duration-150"
          aria-label="Edit"
        >
          ✏️
        </button>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 text-xs disabled:opacity-15
            hover:bg-white/10 active:scale-90 transition-all duration-150"
          aria-label="Move up"
        >
          ▲
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          className="w-7 h-7 rounded-lg bg-white/5 text-slate-400 text-xs disabled:opacity-15
            hover:bg-white/10 active:scale-90 transition-all duration-150"
          aria-label="Move down"
        >
          ▼
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-lg bg-behind/10 text-behind/70 text-xs
            hover:bg-behind/20 hover:text-behind active:scale-90 transition-all duration-150"
          aria-label="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
