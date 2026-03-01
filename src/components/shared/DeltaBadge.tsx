import { formatDelta } from '../../lib/time'

interface DeltaBadgeProps {
  deltaMs: number
}

export function DeltaBadge({ deltaMs }: DeltaBadgeProps) {
  const isAhead = deltaMs < 0
  const isBehind = deltaMs > 0

  return (
    <span
      className={`text-sm font-mono font-medium px-2 py-0.5 rounded-full ${
        isAhead
          ? 'bg-ahead/20 text-ahead'
          : isBehind
            ? 'bg-behind/20 text-behind'
            : 'bg-slate-600 text-slate-300'
      }`}
    >
      {formatDelta(deltaMs)}
    </span>
  )
}
