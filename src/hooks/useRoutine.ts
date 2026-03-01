import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { Routine } from '../types'

/**
 * Returns the default routine.
 * - `undefined` while loading
 * - `null` when no routine exists
 * - `Routine` when found
 */
export function useRoutine(): Routine | null | undefined {
  return useLiveQuery(
    async () => {
      const routine = await db.routines.toCollection().first()
      return routine ?? null
    },
  )
}
