import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRunStore } from '../stores/useRunStore'
import { useAppStore } from '../stores/useAppStore'
import { useRoutine } from '../hooks/useRoutine'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { useTimer } from '../hooks/useTimer'
import { saveRun } from '../db/runs'
import { getProgress, updateProgress } from '../db/progress'
import { calculateXP, levelFromXP } from '../lib/xp'
import { generateId } from '../lib/ids'
import { todayDateString } from '../lib/time'
import { startRunNotification, updateRunNotification, stopRunNotification } from '../lib/notification'
import { CurrentTime } from '../components/run/CurrentTime'
import { TimerDisplay } from '../components/run/TimerDisplay'
import { CurrentStep } from '../components/run/CurrentStep'
import { StepSidebar } from '../components/run/StepSidebar'
import { ProgressBar } from '../components/run/ProgressBar'
import { RunControls } from '../components/run/RunControls'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import type { Run } from '../types'

export function ActiveRun() {
  const navigate = useNavigate()
  const routine = useRoutine()
  const status = useRunStore((s) => s.status)
  const runId = useRunStore((s) => s.runId)
  const steps = useRunStore((s) => s.steps)
  const activeStepId = useRunStore((s) => s.activeStepId)
  const completedStepIds = useRunStore((s) => s.completedStepIds)
  const splits = useRunStore((s) => s.splits)
  const stepAccumulatedMs = useRunStore((s) => s.stepAccumulatedMs)
  const startRun = useRunStore((s) => s.startRun)
  const completeStep = useRunStore((s) => s.completeStep)
  const skipStep = useRunStore((s) => s.skipStep)
  const selectStep = useRunStore((s) => s.selectStep)
  const pause = useRunStore((s) => s.pause)
  const resume = useRunStore((s) => s.resume)
  const abandon = useRunStore((s) => s.abandon)
  const finish = useRunStore((s) => s.finish)
  const reset = useRunStore((s) => s.reset)
  const pb = usePersonalBests(routine?.id)
  const showConfirm = useAppStore((s) => s.showConfirm)
  const { elapsedMs, stepElapsedMs } = useTimer()

  // Start the run when component mounts (if idle)
  useEffect(() => {
    if (status === 'idle' && routine && routine.steps.length > 0) {
      const id = generateId()
      const sortedSteps = [...routine.steps].sort((a, b) => a.order - b.order)
      startRun(id, routine.id, sortedSteps)
    }
  }, [status, routine, startRun])

  // Update notification when active step changes (also handles initial start)
  useEffect(() => {
    if (status !== 'running' || !activeStepId || !routine) return
    const step = steps.find((s) => s.id === activeStepId)
    if (!step) return

    if (completedStepIds.length === 0) {
      startRunNotification(routine.name, step.icon)
    } else {
      updateRunNotification(step.name, step.icon, completedStepIds.length, steps.length)
    }
  }, [activeStepId, status, steps, completedStepIds.length, routine])

  // Redirect if no routine
  useEffect(() => {
    if (routine !== undefined && (!routine || routine.steps.length === 0)) {
      navigate('/editor', { replace: true })
    }
  }, [routine, navigate])

  const allStepsCompleted = activeStepId === null && completedStepIds.length === steps.length && steps.length > 0

  const handleComplete = () => {
    completeStep()
  }

  const handleSkip = () => {
    skipStep()
  }

  const handleFinish = async () => {
    stopRunNotification()
    const { splits: allSplits, totalTimeMs } = finish()

    // Save the run
    const progress = await getProgress()
    const previousBest = routine ? progress.personalBests[routine.id] : undefined

    // Compute deltas
    const splitsWithDelta = allSplits.map((s) => ({
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
      for (const s of allSplits) {
        if (s.skipped) continue
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
      for (const s of allSplits) {
        if (s.skipped) continue
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
  }

  const doAbandon = async () => {
    stopRunNotification()
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

  const handleAbandon = () => {
    showConfirm({
      title: 'Abandon Run?',
      message: 'Your progress will be saved as an incomplete run. Are you sure?',
      onConfirm: doAbandon,
    })
  }

  if (routine === undefined || status === 'idle') {
    return (
      <div className="min-h-dvh bg-[#161210] flex items-center justify-center">
        <div className="text-sm text-slate-500 animate-pulse-glow">Loading...</div>
      </div>
    )
  }

  const activeStep = steps.find((s) => s.id === activeStepId)

  return (
    <div className="min-h-dvh bg-[#161210] text-stone-200 flex flex-col px-4 pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-[env(safe-area-inset-bottom)]">

      <div className="relative flex flex-col flex-1">
        {/* Progress */}
        <div className="mb-3">
          <ProgressBar totalSteps={steps.length} completedSteps={completedStepIds.length} />
          <div className="text-xs text-slate-500 text-center mt-1.5">
            {completedStepIds.length} of {steps.length} completed
          </div>
        </div>

        {/* Step Drawer (fixed overlay) */}
        <StepSidebar
          steps={steps}
          activeStepId={activeStepId}
          completedStepIds={completedStepIds}
          splits={splits}
          stepElapsedMs={stepElapsedMs}
          stepAccumulatedMs={stepAccumulatedMs}
          onSelectStep={selectStep}
          onCompleteStep={handleComplete}
        />

        {/* Current time + Total timer */}
        <div className="mb-4">
          <CurrentTime showDate size="large" />
          <TimerDisplay elapsedMs={elapsedMs} label="Total" size="small" />
        </div>

        {/* Current step */}
        <div className="flex-1 flex flex-col justify-center">
          {activeStep && (
            <CurrentStep
              step={activeStep}
              stepElapsedMs={stepElapsedMs}
              bestSplitMs={pb?.splits[activeStep.id]}
              onComplete={handleComplete}
            />
          )}

          {allStepsCompleted && (
            <div className="text-center py-8 animate-scale-in">
              <div className="text-6xl mb-4">🏁</div>
              <h2 className="font-heading text-2xl font-bold text-pb-gold">
                All Steps Done!
              </h2>
              <p className="text-slate-500 mt-2 text-sm">Tap below to finish your run</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mt-4">
          <RunControls
            status={status}
            allStepsCompleted={allStepsCompleted}
            onComplete={handleComplete}
            onSkip={handleSkip}
            onFinish={handleFinish}
            onPause={pause}
            onResume={resume}
            onAbandon={handleAbandon}
          />
        </div>
      </div>
      <ConfirmDialog />
    </div>
  )
}
