import { db } from '.'
import type { Run } from '../types'

export async function saveRun(run: Run): Promise<void> {
  await db.runs.put(run)
}

export async function getRun(id: string): Promise<Run | undefined> {
  return db.runs.get(id)
}

export async function getRunsByRoutine(routineId: string): Promise<Run[]> {
  return db.runs.where('routineId').equals(routineId).reverse().sortBy('date')
}

export async function getCompletedRunsByRoutine(routineId: string): Promise<Run[]> {
  const runs = await getRunsByRoutine(routineId)
  return runs.filter((r) => r.completed)
}

export async function deleteAllRuns(): Promise<void> {
  await db.runs.clear()
}
