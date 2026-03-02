import type { RunSummaryStats } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface SummaryCardsProps {
  stats: RunSummaryStats
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    { label: 'Total Runs', value: stats.totalRuns.toString() },
    { label: 'Avg Time', value: stats.completedRuns > 0 ? formatTimeShort(stats.averageTimeMs) : '--' },
    { label: 'Best Time', value: stats.completedRuns > 0 ? formatTimeShort(stats.bestTimeMs) : '--', highlight: true },
    { label: 'Completion', value: stats.totalRuns > 0 ? `${Math.round(stats.completionRate * 100)}%` : '--' },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 mb-5">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className={`card border px-3 py-3.5 text-center animate-slide-up ${
            card.highlight ? 'border-pb-gold/10' : 'border-white/5'
          }`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <div className="text-[10px] text-slate-500 font-medium tracking-wide mb-1.5">
            {card.label}
          </div>
          <div className={`font-heading text-xl font-bold tabular-nums ${
            card.highlight && stats.completedRuns > 0 ? 'text-pb-gold' : ''
          }`}>
            {card.value}
          </div>
        </div>
      ))}
    </div>
  )
}
