interface UndoToastProps {
  stepIcon: string
  stepName: string
  onUndo: () => void
}

export function UndoToast({ stepIcon, stepName, onUndo }: UndoToastProps) {
  return (
    <div className="flex items-center justify-between gap-3 bg-surface-raised border border-white/10 rounded-xl px-4 py-3 shadow-lg animate-slide-up">
      <span className="text-sm text-slate-300 truncate">
        {stepIcon} {stepName} completed
      </span>
      <button
        onClick={onUndo}
        className="shrink-0 text-sm font-bold text-neutral active:scale-95 transition-transform"
      >
        Undo
      </button>
    </div>
  )
}
