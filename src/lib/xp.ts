import type { Run, UserProgress, PersonalBestData } from '../types'

/** XP required to reach a given level (cumulative) */
export function xpForLevel(level: number): number {
  if (level <= 0) return 0
  let total = 0
  for (let n = 1; n <= level; n++) {
    total += Math.floor(500 * n * (1 + n * 0.1))
  }
  return total
}

/** Get current level from total XP */
export function levelFromXP(totalXP: number): number {
  let level = 0
  while (xpForLevel(level + 1) <= totalXP) {
    level++
  }
  return level
}

/** Get XP progress within current level as 0-1 fraction */
export function levelProgress(totalXP: number): number {
  const level = levelFromXP(totalXP)
  const currentLevelXP = xpForLevel(level)
  const nextLevelXP = xpForLevel(level + 1)
  const range = nextLevelXP - currentLevelXP
  if (range === 0) return 0
  return (totalXP - currentLevelXP) / range
}

/** Calculate XP earned for a completed run */
export function calculateXP(
  run: Run,
  previousBest: PersonalBestData | undefined,
  _progress: UserProgress,
): number {
  let xp = 100 // base completion

  if (!previousBest) {
    // First run of this routine
    xp += 200
  } else {
    // Check for total PB
    if (run.totalTime && run.totalTime < previousBest.totalTime) {
      xp += 150
    }
    // Check for individual split PBs
    for (const split of run.splits) {
      if (split.skipped) continue
      const bestSplit = previousBest.splits[split.stepId]
      if (bestSplit && split.duration < bestSplit) {
        xp += 50
      }
    }
  }

  return xp
}
