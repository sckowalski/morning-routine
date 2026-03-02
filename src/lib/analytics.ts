import type { Run, RoutineStep, RunSummaryStats, StepStats, TrendPoint } from '../types'

export function filterRunsByDateRange(runs: Run[], startDate: string, endDate: string): Run[] {
  return runs.filter((r) => r.date >= startDate && r.date <= endDate)
}

export function computeSummaryStats(runs: Run[]): RunSummaryStats {
  const completedRuns = runs.filter((r) => r.completed && r.totalTime != null)

  if (runs.length === 0) {
    return { totalRuns: 0, completedRuns: 0, averageTimeMs: 0, bestTimeMs: 0, completionRate: 0 }
  }

  const times = completedRuns.map((r) => r.totalTime!)
  const averageTimeMs = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0
  const bestTimeMs = times.length > 0 ? Math.min(...times) : 0

  return {
    totalRuns: runs.length,
    completedRuns: completedRuns.length,
    averageTimeMs,
    bestTimeMs,
    completionRate: runs.length > 0 ? completedRuns.length / runs.length : 0,
  }
}

export function computeStepStats(runs: Run[], steps: RoutineStep[]): StepStats[] {
  const completedRuns = runs.filter((r) => r.completed)

  return steps.map((step) => {
    const durations: number[] = []
    for (const run of completedRuns) {
      const split = run.splits.find((s) => s.stepId === step.id)
      if (split) durations.push(split.duration)
    }

    return {
      stepId: step.id,
      stepName: step.name,
      stepIcon: step.icon,
      averageMs: durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0,
      bestMs: durations.length > 0 ? Math.min(...durations) : 0,
      worstMs: durations.length > 0 ? Math.max(...durations) : 0,
      sampleCount: durations.length,
    }
  })
}

export function computeTrendData(runs: Run[]): TrendPoint[] {
  const completedRuns = runs
    .filter((r) => r.completed && r.totalTime != null)
    .sort((a, b) => a.date.localeCompare(b.date))

  return completedRuns.map((r) => ({
    date: r.date,
    totalTimeMs: r.totalTime!,
  }))
}

export function getDateRangeFromPreset(preset: '7d' | '30d' | '90d'): { startDate: string; endDate: string } {
  const end = new Date()
  const start = new Date()
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 90
  start.setDate(start.getDate() - days)

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
  }
}
