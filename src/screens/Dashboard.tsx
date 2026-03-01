import { useRoutine } from '../hooks/useRoutine'
import { useRuns } from '../hooks/useRuns'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { StartButton } from '../components/dashboard/StartButton'
import { LastRunCard } from '../components/dashboard/LastRunCard'
import { PersonalBestCard } from '../components/dashboard/PersonalBestCard'
import { EmptyState } from '../components/shared/EmptyState'

export function Dashboard() {
  const routine = useRoutine()
  const runs = useRuns(routine?.id)
  const pb = usePersonalBests(routine?.id)

  if (routine === undefined) {
    return <div className="text-center py-8 text-slate-400">Loading...</div>
  }

  if (!routine || routine.steps.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="Set Up Your Routine"
        description="Head to the Routine tab to add your morning steps, then come back to start your first speedrun!"
      />
    )
  }

  const lastRun = runs.length > 0 ? runs[0] : null

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold mb-1">{routine.name}</h2>
        <p className="text-sm text-slate-400">
          {routine.steps.length} step{routine.steps.length !== 1 ? 's' : ''}
        </p>
      </div>

      <StartButton />

      {pb && <PersonalBestCard pb={pb} />}

      {lastRun && (
        <LastRunCard run={lastRun} pbTotalTime={pb?.totalTime} />
      )}

      {!lastRun && (
        <div className="text-center py-4 text-slate-500 text-sm">
          No runs yet — hit the button to start your first speedrun!
        </div>
      )}
    </div>
  )
}
