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
          className="w-full py-4 rounded-2xl font-heading text-lg font-bold tracking-wide
            bg-neutral text-white active:scale-[0.97] transition-all duration-200"
        >
          Resume
        </button>
        <button
          onClick={onAbandon}
          className="w-full py-3 rounded-2xl border border-white/5 bg-surface-raised text-slate-400
            text-sm font-medium active:scale-[0.97] transition-all duration-200"
        >
          Abandon Run
        </button>
      </div>
    )
  }

  if (allStepsCompleted) {
    return (
      <div className="flex flex-col gap-3 animate-scale-in">
        <button
          onClick={onFinish}
          className="w-full py-5 rounded-2xl font-heading text-xl font-bold tracking-wide
            bg-pb-gold text-slate-900 active:scale-[0.97] transition-all duration-200"
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
        className="w-full py-5 rounded-2xl font-heading text-lg font-bold tracking-wide
          bg-neutral text-white active:scale-[0.97] transition-all duration-200"
      >
        Complete Step
      </button>
      <button
        onClick={onPause}
        className="w-full py-3 rounded-2xl border border-white/5 bg-surface-raised text-slate-400
          text-sm font-medium active:scale-[0.97] transition-all duration-200"
      >
        Pause
      </button>
    </div>
  )
}
