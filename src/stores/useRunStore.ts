import { create } from 'zustand'
import type { RoutineStep, Split } from '../types'

export type RunStatus = 'idle' | 'running' | 'paused' | 'finished' | 'abandoned'

interface RunState {
  status: RunStatus
  runId: string | null
  routineId: string | null
  steps: RoutineStep[]
  currentStepIndex: number
  splits: Split[]

  // Timing (performance.now based)
  runStartTime: number | null      // performance.now() when run started
  stepStartTime: number | null     // performance.now() when current step started
  pauseStartTime: number | null    // performance.now() when pause began
  totalPausedMs: number            // accumulated pause time
  stepPausedMs: number             // accumulated pause time for current step

  // Actions
  startRun: (runId: string, routineId: string, steps: RoutineStep[]) => void
  nextStep: () => Split | null
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
  currentStepIndex: 0,
  splits: [] as Split[],
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
      currentStepIndex: 0,
      splits: [],
      runStartTime: now,
      stepStartTime: now,
      pauseStartTime: null,
      totalPausedMs: 0,
      stepPausedMs: 0,
    })
  },

  nextStep: () => {
    const state = get()
    if (state.status !== 'running' || !state.stepStartTime) return null

    const now = performance.now()
    const stepDurationMs = now - state.stepStartTime - state.stepPausedMs
    const step = state.steps[state.currentStepIndex]

    const split: Split = {
      stepId: step.id,
      startTime: new Date(Date.now() - stepDurationMs).toISOString(),
      endTime: new Date().toISOString(),
      duration: stepDurationMs,
    }

    const nextIndex = state.currentStepIndex + 1
    const isLastStep = nextIndex >= state.steps.length

    set({
      splits: [...state.splits, split],
      currentStepIndex: nextIndex,
      stepStartTime: isLastStep ? null : now,
      stepPausedMs: 0,
    })

    return split
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
