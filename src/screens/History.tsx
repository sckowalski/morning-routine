import { useRoutine } from '../hooks/useRoutine'
import { useRuns } from '../hooks/useRuns'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { RunCard } from '../components/history/RunCard'
import { EmptyState } from '../components/shared/EmptyState'

export function History() {
  const routine = useRoutine()
  const runs = useRuns(routine?.id)
  const pb = usePersonalBests(routine?.id)

  if (routine === undefined) {
    return <div className="text-center py-8 text-slate-400">Loading...</div>
  }

  if (runs.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No Runs Yet"
        description="Complete your first speedrun to see your history here."
      />
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Run History</h2>
      <div className="flex flex-col gap-2">
        {runs.map((run) => (
          <RunCard key={run.id} run={run} pbTotalTime={pb?.totalTime} />
        ))}
      </div>
    </div>
  )
}
