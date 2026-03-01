import Dexie, { type Table } from 'dexie'
import type { Routine, Run, UserProgress } from '../types'

export class MorningSpeedrunDB extends Dexie {
  routines!: Table<Routine, string>
  runs!: Table<Run, string>
  progress!: Table<UserProgress, string>

  constructor() {
    super('MorningSpeedrunDB')
    this.version(1).stores({
      routines: 'id',
      runs: 'id, routineId, date',
      progress: 'id',
    })
  }
}

export const db = new MorningSpeedrunDB()
