import { create } from 'zustand'
import type { RoutineStep, Split } from '../types'

export type RunStatus = 'idle' | 'running' | 'paused' | 'finished' | 'abandoned'

interface RunState {
  status: RunStatus
  runId: string | null
  routineId: string | null
  steps: RoutineStep[]
  activeStepId: string | null
  completedStepIds: string[]
  skippedStepIds: string[]
  splits: Split[]
  stepAccumulatedMs: Record<string, number>

  // Timing (performance.now based)
  runStartTime: number | null      // performance.now() when run started
  stepStartTime: number | null     // performance.now() when current step started
  pauseStartTime: number | null    // performance.now() when pause began
  totalPausedMs: number            // accumulated pause time
  stepPausedMs: number             // accumulated pause time for current step

  // Actions
  startRun: (runId: string, routineId: string, steps: RoutineStep[]) => void
  completeStep: () => Split | null
  skipStep: () => Split | null
  uncompleteStep: (stepId: string) => void
  selectStep: (stepId: string) => void
  pause: () => void
  resume: () => void
  abandon: () => void
  finish: () => { splits: Split[]; totalTimeMs: number }
  reset: () => void
}

const initialState = {
  status: 'idle' as RunStatus,
  runId: null as string | null,
  routineId: null as string | null,
  steps: [] as RoutineStep[],
  activeStepId: null as string | null,
  completedStepIds: [] as string[],
  skippedStepIds: [] as string[],
  splits: [] as Split[],
  stepAccumulatedMs: {} as Record<string, number>,
  runStartTime: null as number | null,
  stepStartTime: null as number | null,
  pauseStartTime: null as number | null,
  totalPausedMs: 0,
  stepPausedMs: 0,
}

export const useRunStore = create<RunState>((set, get) => ({
  ...initialState,

  startRun: (runId, routineId, steps) => {
    const now = performance.now()
    set({
      status: 'running',
      runId,
      routineId,
      steps,
      activeStepId: steps.length > 0 ? steps[0].id : null,
      completedStepIds: [],
      skippedStepIds: [],
      splits: [],
      stepAccumulatedMs: {},
      runStartTime: now,
      stepStartTime: now,
      pauseStartTime: null,
      totalPausedMs: 0,
      stepPausedMs: 0,
    })
  },

  selectStep: (stepId) => {
    const state = get()
    if (state.status !== 'running' || !state.activeStepId || state.activeStepId === stepId) return
    if (state.completedStepIds.includes(stepId)) return

    const now = performance.now()
    const currentElapsed = state.stepStartTime != null
      ? now - state.stepStartTime - state.stepPausedMs
      : 0
    const currentId = state.activeStepId
    const prevAccumulated = state.stepAccumulatedMs[currentId] || 0

    set({
      activeStepId: stepId,
      stepStartTime: now,
      stepPausedMs: 0,
      stepAccumulatedMs: {
        ...state.stepAccumulatedMs,
        [currentId]: prevAccumulated + currentElapsed,
      },
    })
  },

  completeStep: () => {
    const state = get()
    if (state.status !== 'running' || !state.activeStepId || !state.stepStartTime) return null

    const now = performance.now()
    const currentElapsed = now - state.stepStartTime - state.stepPausedMs
    const accumulated = state.stepAccumulatedMs[state.activeStepId] || 0
    const totalDuration = accumulated + currentElapsed

    const split: Split = {
      stepId: state.activeStepId,
      startTime: new Date(Date.now() - totalDuration).toISOString(),
      endTime: new Date().toISOString(),
      duration: totalDuration,
    }

    const newCompleted = [...state.completedStepIds, state.activeStepId]

    // Find next uncompleted step
    const nextStep = state.steps.find(
      (s) => !newCompleted.includes(s.id)
    )

    set({
      splits: [...state.splits, split],
      completedStepIds: newCompleted,
      activeStepId: nextStep?.id ?? null,
      stepStartTime: nextStep ? now : null,
      stepPausedMs: 0,
      stepAccumulatedMs: {
        ...state.stepAccumulatedMs,
        [state.activeStepId]: 0, // reset for completed step
      },
    })

    return split
  },

  skipStep: () => {
    const state = get()
    if (state.status !== 'running' || !state.activeStepId) return null

    const now = performance.now()

    const split: Split = {
      stepId: state.activeStepId,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      duration: 0,
      skipped: true,
    }

    const newCompleted = [...state.completedStepIds, state.activeStepId]
    const newSkipped = [...state.skippedStepIds, state.activeStepId]

    // Find next uncompleted step
    const nextStep = state.steps.find(
      (s) => !newCompleted.includes(s.id)
    )

    set({
      splits: [...state.splits, split],
      completedStepIds: newCompleted,
      skippedStepIds: newSkipped,
      activeStepId: nextStep?.id ?? null,
      stepStartTime: nextStep ? now : null,
      stepPausedMs: 0,
      stepAccumulatedMs: {
        ...state.stepAccumulatedMs,
        [state.activeStepId]: 0,
      },
    })

    return split
  },

  uncompleteStep: (stepId) => {
    const state = get()
    const now = performance.now()

    set({
      status: 'running',
      completedStepIds: state.completedStepIds.filter((id) => id !== stepId),
      skippedStepIds: state.skippedStepIds.filter((id) => id !== stepId),
      splits: state.splits.filter((s) => s.stepId !== stepId),
      activeStepId: stepId,
      stepStartTime: now,
      stepPausedMs: 0,
      stepAccumulatedMs: {
        ...state.stepAccumulatedMs,
        [stepId]: 0,
      },
    })
  },

  pause: () => {
    const state = get()
    if (state.status !== 'running') return
    set({
      status: 'paused',
      pauseStartTime: performance.now(),
    })
  },

  resume: () => {
    const state = get()
    if (state.status !== 'paused' || !state.pauseStartTime) return

    const pauseDuration = performance.now() - state.pauseStartTime
    set({
      status: 'running',
      pauseStartTime: null,
      totalPausedMs: state.totalPausedMs + pauseDuration,
      stepPausedMs: state.stepPausedMs + pauseDuration,
    })
  },

  abandon: () => {
    set({ status: 'abandoned' })
  },

  finish: () => {
    const state = get()
    const now = performance.now()
    const totalTimeMs = state.runStartTime
      ? now - state.runStartTime - state.totalPausedMs
      : 0

    set({ status: 'finished' })
    return { splits: state.splits, totalTimeMs }
  },

  reset: () => {
    set(initialState)
  },
}))
