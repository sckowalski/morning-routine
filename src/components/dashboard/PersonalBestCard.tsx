import type { PersonalBestData } from '../../types'
import { formatTime, formatDate } from '../../lib/time'

interface PersonalBestCardProps {
  pb: PersonalBestData
}

export function PersonalBestCard({ pb }: PersonalBestCardProps) {
  return (
    <div className="bg-surface-raised rounded-2xl p-4">
      <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Personal Best</h3>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-mono font-bold tabular-nums text-pb-gold">
          {formatTime(pb.totalTime)}
        </div>
        <div className="text-sm text-slate-400">
          {formatDate(pb.date)}
        </div>
      </div>
    </div>
  )
}
