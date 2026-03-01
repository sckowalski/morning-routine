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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={hideConfirm}>
      <div
        className="bg-surface-raised rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold mb-2">{dialog.title}</h3>
        <p className="text-slate-400 text-sm mb-6">{dialog.message}</p>
        <div className="flex gap-3">
          <button
            onClick={hideConfirm}
            className="flex-1 py-3 rounded-xl bg-surface text-slate-300 font-medium active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-xl bg-behind text-white font-medium active:scale-95 transition-transform"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
