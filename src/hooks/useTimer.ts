import { useEffect, useRef, useState } from 'react'
import { useRunStore } from '../stores/useRunStore'

/** Returns elapsed milliseconds for the active run, updated ~10x/sec */
export function useTimer() {
  const [elapsedMs, setElapsedMs] = useState(0)
  const [stepElapsedMs, setStepElapsedMs] = useState(0)
  const rafRef = useRef<number>(0)
  const lastUpdateRef = useRef<number>(0)

  const status = useRunStore((s) => s.status)
  const runStartTime = useRunStore((s) => s.runStartTime)
  const stepStartTime = useRunStore((s) => s.stepStartTime)
  const totalPausedMs = useRunStore((s) => s.totalPausedMs)
  const stepPausedMs = useRunStore((s) => s.stepPausedMs)

  useEffect(() => {
    if (status !== 'running') {
      cancelAnimationFrame(rafRef.current)
      return
    }

    const tick = (now: number) => {
      // Throttle to ~10 updates/sec
      if (now - lastUpdateRef.current >= 100) {
        lastUpdateRef.current = now

        if (runStartTime != null) {
          setElapsedMs(now - runStartTime - totalPausedMs)
        }
        if (stepStartTime != null) {
          setStepElapsedMs(now - stepStartTime - stepPausedMs)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [status, runStartTime, stepStartTime, totalPausedMs, stepPausedMs])

  return { elapsedMs, stepElapsedMs }
}
