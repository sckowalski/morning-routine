import type { RunStatus } from '../../stores/useRunStore'

interface RunControlsProps {
  status: RunStatus
  allStepsCompleted: boolean
  onComplete: () => void
  onFinish: () => void
  onPause: () => void
  onResume: () => void
  onAbandon: () => void
}

export function RunControls({
  status,
  allStepsCompleted,
  onComplete,
  onFinish,
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

  if (allStepsCompleted) {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={onFinish}
          className="w-full py-5 rounded-2xl bg-pb-gold text-slate-900 text-xl font-bold active:scale-95 transition-transform"
        >
          Finish Run!
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onComplete}
        className="w-full py-5 rounded-2xl bg-neutral text-white text-xl font-bold active:scale-95 transition-transform"
      >
        Complete Step
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
