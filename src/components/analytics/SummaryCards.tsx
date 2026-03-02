import type { RunSummaryStats } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface SummaryCardsProps {
  stats: RunSummaryStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    { label: 'Total Runs', value: stats.totalRuns.toString() },
    { label: 'Avg Time', value: stats.completedRuns > 0 ? formatTimeShort(stats.averageTimeMs) : '--' },
    { label: 'Best Time', value: stats.completedRuns > 0 ? formatTimeShort(stats.bestTimeMs) : '--' },
    { label: 'Completion', value: stats.totalRuns > 0 ? `${Math.round(stats.completionRate * 100)}%` : '--' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-surface-raised rounded-xl px-3 py-3 text-center">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">{card.label}</div>
          <div className="text-xl font-bold font-mono tabular-nums">{card.value}</div>
        </div>
      ))}
    </div>
  )
}
