import { db } from '.'
import type { UserProgress } from '../types'

const DEFAULT_PROGRESS: UserProgress = {
  id: 'user',
  totalXP: 0,
  level: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalRuns: 0,
  totalTimeSpent: 0,
  personalBests: {},
}

export async function getProgress(): Promise<UserProgress> {
  const progress = await db.progress.get('user')
  if (!progress) {
    await db.progress.add(DEFAULT_PROGRESS)
    return DEFAULT_PROGRESS
  }
  return progress
}

export async function updateProgress(
  updates: Partial<Omit<UserProgress, 'id'>>,
): Promise<void> {
  const existing = await db.progress.get('user')
  if (!existing) {
    await db.progress.add({ ...DEFAULT_PROGRESS, ...updates })
  } else {
    await db.progress.update('user', updates)
  }
}

export async function resetProgress(): Promise<void> {
  await db.progress.put(DEFAULT_PROGRESS)
}
