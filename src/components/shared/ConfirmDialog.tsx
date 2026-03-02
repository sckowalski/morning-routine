import { useAppStore } from '../../stores/useAppStore'

export function ConfirmDialog() {
  const dialog = useAppStore((s) => s.confirmDialog)
  const hideConfirm = useAppStore((s) => s.hideConfirm)

  if (!dialog) return null

  const handleConfirm = () => {
    dialog.onConfirm()
    hideConfirm()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={hideConfirm}>
      <div
        className="card-glow p-6 max-w-sm w-full animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-heading text-base font-bold mb-2">{dialog.title}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{dialog.message}</p>
        <div className="flex gap-3">
          <button
            onClick={hideConfirm}
            className="flex-1 py-3 rounded-xl border border-white/5 bg-surface text-slate-300 font-medium
              active:scale-95 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-behind text-white font-bold
              active:scale-95 transition-all duration-200"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
