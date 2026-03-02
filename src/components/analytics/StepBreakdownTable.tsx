import type { StepStats } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface StepBreakdownTableProps {
  stepStats: StepStats[]
}

export function StepBreakdownTable({ stepStats }: StepBreakdownTableProps) {
  const hasData = stepStats.some((s) => s.sampleCount > 0)

  if (!hasData) {
    return (
      <div className="card border border-white/5 text-center text-slate-500 py-8 text-sm">
        Complete a run to see step breakdown.
      </div>
    )
  }

  return (
    <div className="mb-4">
      <h3 className="text-xs text-slate-500 font-medium tracking-wide mb-2">Step Breakdown</h3>
      <div className="card border border-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] text-slate-500 font-medium tracking-wide">
              <th className="text-left px-3 py-2.5">Step</th>
              <th className="text-right px-3 py-2.5">Avg</th>
              <th className="text-right px-3 py-2.5">Best</th>
              <th className="text-right px-3 py-2.5">Worst</th>
            </tr>
          </thead>
          <tbody>
            {stepStats.filter((s) => s.sampleCount > 0).map((step) => (
              <tr key={step.stepId} className="border-t border-white/5">
                <td className="px-3 py-2.5 text-sm">
                  <span className="mr-1.5">{step.stepIcon}</span>
                  {step.stepName}
                </td>
                <td className="text-right px-3 py-2.5 font-heading text-xs font-medium tabular-nums">
                  {formatTimeShort(step.averageMs)}
                </td>
                <td className="text-right px-3 py-2.5 font-heading text-xs font-medium tabular-nums text-ahead">
                  {formatTimeShort(step.bestMs)}
                </td>
                <td className="text-right px-3 py-2.5 font-heading text-xs font-medium tabular-nums text-behind">
                  {formatTimeShort(step.worstMs)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
