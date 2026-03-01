import type { RunStatus } from '../../stores/useRunStore'

interface RunControlsProps {
  status: RunStatus
  isLastStep: boolean
  onNext: () => void
  onPause: () => void
  onResume: () => void
  onAbandon: () => void
}

export function RunControls({
  status,
  isLastStep,
  onNext,
  onPause,
  onResume,
  onAbandon,
}: RunControlsProps) {
  if (status === 'paused') {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onResume}
          className="w-full py-4 rounded-2xl bg-neutral text-white text-xl font-bold active:scale-95 transition-transform"
        >
          Resume
        </button>
        <button
          onClick={onAbandon}
          className="w-full py-3 rounded-2xl bg-surface-raised text-slate-300 text-base active:scale-95 transition-transform"
        >
          Abandon Run
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onNext}
        className="w-full py-5 rounded-2xl bg-neutral text-white text-xl font-bold active:scale-95 transition-transform"
      >
        {isLastStep ? 'Finish!' : 'Next Step'}
      </button>
      <button
        onClick={onPause}
        className="w-full py-3 rounded-2xl bg-surface-raised text-slate-300 text-base active:scale-95 transition-transform"
      >
        Pause
      </button>
    </div>
  )
}
