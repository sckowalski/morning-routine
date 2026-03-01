import { db } from '.'
import type { Routine, RoutineStep } from '../types'
import { generateId } from '../lib/ids'

export async function getDefaultRoutine(): Promise<Routine | undefined> {
  return db.routines.toCollection().first()
}

export async function createRoutine(name: string): Promise<Routine> {
  const routine: Routine = {
    id: generateId(),
    name,
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  await db.routines.add(routine)
  return routine
}

export async function addStep(
  routineId: string,
  name: string,
  icon: string,
): Promise<void> {
  const routine = await db.routines.get(routineId)
  if (!routine) return

  const step: RoutineStep = {
    id: generateId(),
    name,
    icon,
    order: routine.steps.length,
  }

  await db.routines.update(routineId, {
    steps: [...routine.steps, step],
    updatedAt: new Date().toISOString(),
  })
}

export async function removeStep(
  routineId: string,
  stepId: string,
): Promise<void> {
  const routine = await db.routines.get(routineId)
  if (!routine) return

  const filtered = routine.steps
    .filter((s) => s.id !== stepId)
    .map((s, i) => ({ ...s, order: i }))

  await db.routines.update(routineId, {
    steps: filtered,
    updatedAt: new Date().toISOString(),
  })
}

export async function reorderStep(
  routineId: string,
  stepId: string,
  direction: 'up' | 'down',
): Promise<void> {
  const routine = await db.routines.get(routineId)
  if (!routine) return

  const steps = [...routine.steps].sort((a, b) => a.order - b.order)
  const idx = steps.findIndex((s) => s.id === stepId)
  if (idx === -1) return

  const swapIdx = direction === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= steps.length) return

  ;[steps[idx], steps[swapIdx]] = [steps[swapIdx], steps[idx]]
  const reordered = steps.map((s, i) => ({ ...s, order: i }))

  await db.routines.update(routineId, {
    steps: reordered,
    updatedAt: new Date().toISOString(),
  })
}

export async function updateRoutineName(
  routineId: string,
  name: string,
): Promise<void> {
  await db.routines.update(routineId, {
    name,
    updatedAt: new Date().toISOString(),
  })
}
