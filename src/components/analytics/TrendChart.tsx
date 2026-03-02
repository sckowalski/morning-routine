import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { TrendPoint } from '../../types'
import { formatTimeShort } from '../../lib/time'

interface TrendChartProps {
  data: TrendPoint[]
}

function formatDateLabel(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length < 2) {
    return (
      <div className="text-center text-slate-400 py-8 text-sm">
        Complete at least 2 runs to see trends.
      </div>
    )
  }

  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Total Time Trend</h3>
      <div className="bg-surface-raised rounded-xl p-3">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(ms: number) => formatTimeShort(ms)}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#334155',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
              }}
              labelFormatter={(label) => formatDateLabel(String(label))}
              formatter={(value) => [formatTimeShort(Number(value)), 'Time']}
            />
            <Line
              type="monotone"
              dataKey="totalTimeMs"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
