import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { PersonalBestData } from '../types'

export function usePersonalBests(routineId: string | undefined): PersonalBestData | undefined {
  const progress = useLiveQuery(() => db.progress.get('user'))

  if (!routineId || !progress?.personalBests[routineId]) return undefined
  return progress.personalBests[routineId]
}
