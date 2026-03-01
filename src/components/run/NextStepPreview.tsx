import type { RoutineStep } from '../../types'

interface NextStepPreviewProps {
  step: RoutineStep
}

export function NextStepPreview({ step }: NextStepPreviewProps) {
  return (
    <div className="text-center text-slate-400 py-2">
      <div className="text-xs uppercase tracking-wider mb-1">Up next</div>
      <div className="text-lg">
        {step.icon} {step.name}
      </div>
    </div>
  )
}
