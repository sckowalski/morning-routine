import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRunStore } from '../stores/useRunStore'
import { useRoutine } from '../hooks/useRoutine'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { useTimer } from '../hooks/useTimer'
import { saveRun } from '../db/runs'
import { getProgress, updateProgress } from '../db/progress'
import { calculateXP, levelFromXP } from '../lib/xp'
import { generateId } from '../lib/ids'
import { todayDateString } from '../lib/time'
import { TimerDisplay } from '../components/run/TimerDisplay'
import { CurrentStep } from '../components/run/CurrentStep'
import { NextStepPreview } from '../components/run/NextStepPreview'
import { ProgressBar } from '../components/run/ProgressBar'
import { RunControls } from '../components/run/RunControls'
import type { Run } from '../types'

export function ActiveRun() {
  const navigate = useNavigate()
  const routine = useRoutine()
  const status = useRunStore((s) => s.status)
  const runId = useRunStore((s) => s.runId)
  const steps = useRunStore((s) => s.steps)
  const currentStepIndex = useRunStore((s) => s.currentStepIndex)
  const splits = useRunStore((s) => s.splits)
  const startRun = useRunStore((s) => s.startRun)
  const nextStep = useRunStore((s) => s.nextStep)
  const pause = useRunStore((s) => s.pause)
  const resume = useRunStore((s) => s.resume)
  const abandon = useRunStore((s) => s.abandon)
  const finish = useRunStore((s) => s.finish)
  const reset = useRunStore((s) => s.reset)
  const pb = usePersonalBests(routine?.id)
  const { elapsedMs, stepElapsedMs } = useTimer()

  // Start the run when component mounts (if idle)
  useEffect(() => {
    if (status === 'idle' && routine && routine.steps.length > 0) {
      const id = generateId()
      const sortedSteps = [...routine.steps].sort((a, b) => a.order - b.order)
      startRun(id, routine.id, sortedSteps)
    }
  }, [status, routine, startRun])

  // Redirect if no routine
  useEffect(() => {
    if (routine !== undefined && (!routine || routine.steps.length === 0)) {
      navigate('/editor', { replace: true })
    }
  }, [routine, navigate])

  const handleNext = async () => {
    const isLastStep = currentStepIndex >= steps.length - 1

    if (isLastStep) {
      // Capture the last split then finish
      const lastSplit = nextStep()
      const { splits: allSplits, totalTimeMs } = finish()
      const finalSplits = lastSplit ? [...splits, lastSplit] : allSplits

      // Save the run
      const progress = await getProgress()
      const previousBest = routine ? progress.personalBests[routine.id] : undefined

      // Compute deltas
      const splitsWithDelta = finalSplits.map((s) => ({
        ...s,
        deltaFromBest: previousBest?.splits[s.stepId] != null
          ? s.duration - previousBest.splits[s.stepId]
          : undefined,
      }))

      const run: Run = {
        id: runId!,
        routineId: routine!.id,
        date: todayDateString(),
        startTime: new Date(Date.now() - totalTimeMs).toISOString(),
        endTime: new Date().toISOString(),
        totalTime: totalTimeMs,
        splits: splitsWithDelta,
        completed: true,
        xpEarned: 0,
      }

      const xp = calculateXP(run, previousBest, progress)
      run.xpEarned = xp

      await saveRun(run)

      // Update personal bests
      const newBests = { ...progress.personalBests }
      const routinePB = newBests[routine!.id]

      if (!routinePB || totalTimeMs < routinePB.totalTime) {
        const splitBests: Record<string, number> = routinePB ? { ...routinePB.splits } : {}
        for (const s of finalSplits) {
          if (!splitBests[s.stepId] || s.duration < splitBests[s.stepId]) {
            splitBests[s.stepId] = s.duration
          }
        }
        newBests[routine!.id] = {
          totalTime: totalTimeMs,
          splits: splitBests,
          date: new Date().toISOString(),
        }
      } else {
        // Still update individual split bests
        const splitBests = { ...routinePB.splits }
        for (const s of finalSplits) {
          if (!splitBests[s.stepId] || s.duration < splitBests[s.stepId]) {
            splitBests[s.stepId] = s.duration
          }
        }
        newBests[routine!.id] = { ...routinePB, splits: splitBests }
      }

      const newTotalXP = progress.totalXP + xp
      await updateProgress({
        totalXP: newTotalXP,
        level: levelFromXP(newTotalXP),
        totalRuns: progress.totalRuns + 1,
        totalTimeSpent: progress.totalTimeSpent + totalTimeMs,
        personalBests: newBests,
      })

      reset()
      navigate(`/run/summary/${run.id}`, { replace: true })
    } else {
      nextStep()
    }
  }

  const handleAbandon = async () => {
    abandon()

    const run: Run = {
      id: runId!,
      routineId: routine!.id,
      date: todayDateString(),
      startTime: new Date(Date.now() - elapsedMs).toISOString(),
      endTime: new Date().toISOString(),
      totalTime: elapsedMs,
      splits,
      completed: false,
      xpEarned: 0,
    }
    await saveRun(run)

    reset()
    navigate('/', { replace: true })
  }

  if (routine === undefined || status === 'idle') {
    return (
      <div className="min-h-dvh bg-slate-900 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  const currentStep = steps[currentStepIndex]
  const nextStepData = steps[currentStepIndex + 1]
  const isLastStep = currentStepIndex >= steps.length - 1

  return (
    <div className="min-h-dvh bg-slate-900 text-slate-100 flex flex-col p-4 pb-[env(safe-area-inset-bottom)]">
      {/* Progress */}
      <div className="mb-2">
        <ProgressBar totalSteps={steps.length} completedSteps={currentStepIndex} />
        <div className="text-xs text-slate-400 text-center mt-1">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      {/* Total timer */}
      <div className="mb-4">
        <TimerDisplay elapsedMs={elapsedMs} label="Total" />
      </div>

      {/* Current step */}
      <div className="flex-1 flex flex-col justify-center">
        {currentStep && (
          <CurrentStep
            step={currentStep}
            stepElapsedMs={stepElapsedMs}
            bestSplitMs={pb?.splits[currentStep.id]}
          />
        )}

        {nextStepData && <NextStepPreview step={nextStepData} />}
      </div>

      {/* Controls */}
      <div className="mt-4">
        <RunControls
          status={status}
          isLastStep={isLastStep}
          onNext={handleNext}
          onPause={pause}
          onResume={resume}
          onAbandon={handleAbandon}
        />
      </div>
    </div>
  )
}
