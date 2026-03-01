import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export function useRuns(routineId: string | undefined) {
  return useLiveQuery(
    () => {
      if (!routineId) return []
      return db.runs.where('routineId').equals(routineId).reverse().sortBy('date')
    },
    [routineId],
    [],
  )
}

export function useRun(runId: string | undefined) {
  return useLiveQuery(
    () => {
      if (!runId) return undefined
      return db.runs.get(runId)
    },
    [runId],
  )
}
