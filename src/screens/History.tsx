import { useRoutine } from '../hooks/useRoutine'
import { useRuns } from '../hooks/useRuns'
import { usePersonalBests } from '../hooks/usePersonalBests'
import { useAppStore } from '../stores/useAppStore'
import { deleteRun } from '../db/runs'
import { RunCard } from '../components/history/RunCard'
import { EmptyState } from '../components/shared/EmptyState'

export function History() {
  const routine = useRoutine()
  const runs = useRuns(routine?.id)
  const pb = usePersonalBests(routine?.id)
  const showConfirm = useAppStore((s) => s.showConfirm)

  if (routine === undefined) {
    return <div className="text-center py-12 text-slate-500 animate-pulse-glow">Loading...</div>
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

  const handleDelete = (runId: string) => {
    showConfirm({
      title: 'Delete Run',
      message: 'Are you sure you want to delete this run? This cannot be undone.',
      onConfirm: () => deleteRun(runId),
    })
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-heading text-xl font-bold mb-4">Run History</h2>
      <div className="flex flex-col gap-2">
        {runs.map((run, i) => (
          <div key={run.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <RunCard
              run={run}
              pbTotalTime={pb?.totalTime}
              onDelete={() => handleDelete(run.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
