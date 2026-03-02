import type { DateRange, DateRangePreset } from '../../types'
import { getDateRangeFromPreset } from '../../lib/analytics'

interface DateRangeSelectorProps {
  dateRange: DateRange
  onChange: (range: DateRange) => void
}

const presets: { value: DateRangePreset; label: string }[] = [
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
  { value: '90d', label: '90d' },
  { value: 'all', label: 'All' },
  { value: 'custom', label: 'Custom' },
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
    <div className="mb-4">
      <div className="flex gap-1.5 mb-2">
        {presets.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePreset(p.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              dateRange.preset === p.value
                ? 'bg-neutral text-white'
                : 'bg-surface-raised text-slate-400 hover:text-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {dateRange.preset === 'custom' && (
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => onChange({ ...dateRange, startDate: e.target.value })}
            className="bg-surface-raised rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-neutral"
          />
          <span className="text-slate-400 self-center">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => onChange({ ...dateRange, endDate: e.target.value })}
            className="bg-surface-raised rounded-lg px-3 py-1.5 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-neutral"
          />
        </div>
      )}
    </div>
  )
}
