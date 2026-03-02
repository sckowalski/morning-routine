import { formatDelta } from '../../lib/time'

interface DeltaBadgeProps {
  deltaMs: number
}

export function DeltaBadge({ deltaMs }: DeltaBadgeProps) {
  const isAhead = deltaMs < 0
  const isBehind = deltaMs > 0

  return (
    <span
      className={`font-heading text-xs font-medium px-2 py-0.5 rounded-full tabular-nums ${
        isAhead
          ? 'bg-ahead/15 text-ahead border border-ahead/20'
          : isBehind
            ? 'bg-behind/15 text-behind border border-behind/20'
            : 'bg-white/5 text-slate-400 border border-white/10'
      }`}
    >
      {formatDelta(deltaMs)}
    </span>
  )
}
