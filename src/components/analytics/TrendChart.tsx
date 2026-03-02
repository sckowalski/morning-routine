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
      <div className="card border border-white/5 text-center text-slate-500 py-10 text-sm mb-5">
        Complete at least 2 runs to see trends.
      </div>
    )
  }

  return (
    <div className="mb-5">
      <h3 className="text-xs text-slate-500 font-medium tracking-wide mb-2">Total Time Trend</h3>
      <div className="card border border-white/5 p-3">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              stroke="#3a322c"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(ms: number) => formatTimeShort(ms)}
              stroke="#3a322c"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#211c18',
                border: '1px solid rgba(246, 177, 122, 0.15)',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
                boxShadow: '0 0 20px rgba(246, 177, 122, 0.1)',
              }}
              labelFormatter={(label) => formatDateLabel(String(label))}
              formatter={(value) => [formatTimeShort(Number(value)), 'Time']}
            />
            <Line
              type="monotone"
              dataKey="totalTimeMs"
              stroke="#f6b17a"
              strokeWidth={2}
              dot={{ fill: '#f6b17a', r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#f9c9a0', stroke: '#161210', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
