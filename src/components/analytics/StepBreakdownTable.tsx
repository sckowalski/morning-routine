import type { StepStats } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface StepBreakdownTableProps {
  stepStats: StepStats[]
}

export function StepBreakdownTable({ stepStats }: StepBreakdownTableProps) {
  const hasData = stepStats.some((s) => s.sampleCount > 0)

  if (!hasData) {
    return (
      <div className="text-center text-slate-400 py-4 text-sm">
        Complete a run to see step breakdown.
      </div>
    )
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Step Breakdown</h3>
      <div className="bg-surface-raised rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-slate-400 uppercase tracking-wider">
              <th className="text-left px-3 py-2">Step</th>
              <th className="text-right px-3 py-2">Avg</th>
              <th className="text-right px-3 py-2">Best</th>
              <th className="text-right px-3 py-2">Worst</th>
            </tr>
          </thead>
          <tbody>
            {stepStats.filter((s) => s.sampleCount > 0).map((step) => (
              <tr key={step.stepId} className="border-t border-slate-700/50">
                <td className="px-3 py-2">
                  <span className="mr-1.5">{step.stepIcon}</span>
                  {step.stepName}
                </td>
                <td className="text-right px-3 py-2 font-mono tabular-nums">{formatTimeShort(step.averageMs)}</td>
                <td className="text-right px-3 py-2 font-mono tabular-nums text-ahead">{formatTimeShort(step.bestMs)}</td>
                <td className="text-right px-3 py-2 font-mono tabular-nums text-behind">{formatTimeShort(step.worstMs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
