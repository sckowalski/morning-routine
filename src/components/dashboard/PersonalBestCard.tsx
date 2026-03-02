import type { PersonalBestData } from '../../types'
import { formatTime, formatDate } from '../../lib/time'

interface PersonalBestCardProps {
  pb: PersonalBestData
}

export function PersonalBestCard({ pb }: PersonalBestCardProps) {
  return (
    <div className="card relative overflow-hidden px-4 py-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-pb-gold/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <h3 className="text-xs text-pb-gold/60 font-medium tracking-wide mb-2">Personal Best</h3>
      <div className="flex items-center justify-between">
        <div className="font-heading text-3xl font-bold tabular-nums text-pb-gold">
          {formatTime(pb.totalTime)}
        </div>
        <div className="text-xs text-slate-500">
          {formatDate(pb.date)}
        </div>
      </div>
    </div>
  )
}
