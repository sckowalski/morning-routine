import { useMemo, useState } from 'react'
import { useRoutine } from '../hooks/useRoutine'
import { useFilteredRuns } from '../hooks/useFilteredRuns'
import { computeSummaryStats, computeStepStats, computeTrendData, getDateRangeFromPreset } from '../lib/analytics'
import { DateRangeSelector } from '../components/analytics/DateRangeSelector'
import { SummaryCards } from '../components/analytics/SummaryCards'
import { StepBreakdownTable } from '../components/analytics/StepBreakdownTable'
import { TrendChart } from '../components/analytics/TrendChart'
import { EmptyState } from '../components/shared/EmptyState'
import type { DateRange } from '../types'

const defaultRange = getDateRangeFromPreset('30d')

export function Analytics() {
  const routine = useRoutine()
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: '30d',
    ...defaultRange,
  })
  const filteredRuns = useFilteredRuns(routine?.id, dateRange)

  const summaryStats = useMemo(() => computeSummaryStats(filteredRuns), [filteredRuns])
  const stepStats = useMemo(
    () => (routine ? computeStepStats(filteredRuns, routine.steps) : []),
    [filteredRuns, routine],
  )
  const trendData = useMemo(() => computeTrendData(filteredRuns), [filteredRuns])

  if (routine === undefined) {
    return <div className="text-center py-12 text-slate-500 animate-pulse-glow">Loading...</div>
  }

  if (!routine) {
    return (
      <EmptyState
        icon="📈"
        title="No Routine"
        description="Create a routine first to see analytics."
      />
    )
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-xl font-bold mb-4">Analytics</h2>
      <DateRangeSelector dateRange={dateRange} onChange={setDateRange} />
      <SummaryCards stats={summaryStats} />
      <TrendChart data={trendData} />
      <StepBreakdownTable stepStats={stepStats} />
    </div>
  )
}
