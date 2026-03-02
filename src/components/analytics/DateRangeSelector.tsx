import type { DateRange, DateRangePreset } from '../../types'
import { getDateRangeFromPreset } from '../../lib/analytics'

interface DateRangeSelectorProps {
  dateRange: DateRange
  onChange: (range: DateRange) => void
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: 'all', label: 'ALL' },
  { value: 'custom', label: 'CUSTOM' },
]

export function DateRangeSelector({ dateRange, onChange }: DateRangeSelectorProps) {
  const handlePreset = (preset: DateRangePreset) => {
    if (preset === 'all') {
      onChange({ preset: 'all', startDate: '', endDate: '' })
    } else if (preset === 'custom') {
      onChange({ preset: 'custom', startDate: dateRange.startDate, endDate: dateRange.endDate })
    } else {
      const { startDate, endDate } = getDateRangeFromPreset(preset)
      onChange({ preset, startDate, endDate })
    }
  }

  return (
    <div className="mb-5">
      <div className="flex gap-1.5 mb-3">
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePreset(p.value)}
            className={`px-3 py-1.5 rounded-lg font-heading text-[10px] font-medium transition-all duration-200 ${
              dateRange.preset === p.value
                ? 'bg-neutral/15 text-neutral border border-neutral/25 shadow-[0_0_10px_rgba(246,177,122,0.1)]'
                : 'bg-white/5 text-slate-500 border border-transparent hover:text-slate-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {dateRange.preset === 'custom' && (
        <div className="flex gap-2 items-center animate-slide-up">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => onChange({ ...dateRange, startDate: e.target.value })}
            className="bg-white/5 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none
              focus:ring-2 focus:ring-neutral/50 border border-white/5 transition-all duration-200"
          />
          <span className="text-slate-600 text-xs">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => onChange({ ...dateRange, endDate: e.target.value })}
            className="bg-white/5 rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none
              focus:ring-2 focus:ring-neutral/50 border border-white/5 transition-all duration-200"
          />
        </div>
      )}
    </div>
  )
}
