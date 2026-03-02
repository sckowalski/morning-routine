import { useMemo } from 'react'
import { useRuns } from './useRuns'
import { filterRunsByDateRange } from '../lib/analytics'
import type { DateRange } from '../types'

export function useFilteredRuns(routineId: string | undefined, dateRange: DateRange) {
  const runs = useRuns(routineId)

  return useMemo(() => {
    if (dateRange.preset === 'all') return runs
    return filterRunsByDateRange(runs, dateRange.startDate, dateRange.endDate)
  }, [runs, dateRange])
}
