import { useEffect } from 'react'
import { useRoutine } from '../hooks/useRoutine'
import { createRoutine, addStep, removeStep, reorderStep } from '../db/routines'
import { StepList } from '../components/editor/StepList'
import { AddStepForm } from '../components/editor/AddStepForm'

export function RoutineEditor() {
  const routine = useRoutine()

  // Auto-create a default routine if none exists
  useEffect(() => {
    if (routine === undefined) return // still loading
    if (routine === null) {
      createRoutine('My Morning Routine')
    }
  }, [routine])

  if (!routine) {
    return <div className="text-center py-8 text-slate-400">Loading...</div>
  }

  const handleAddStep = async (name: string, icon: string) => {
    await addStep(routine.id, name, icon)
  }

  const handleRemoveStep = async (stepId: string) => {
    await removeStep(routine.id, stepId)
  }

  const handleMoveUp = async (stepId: string) => {
    await reorderStep(routine.id, stepId, 'up')
  }

  const handleMoveDown = async (stepId: string) => {
    await reorderStep(routine.id, stepId, 'down')
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold">{routine.name}</h2>
        <p className="text-sm text-slate-400">
          {routine.steps.length} step{routine.steps.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="mb-4">
        <StepList
          steps={routine.steps}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemove={handleRemoveStep}
        />
      </div>

      <AddStepForm onAdd={handleAddStep} />
    </div>
  )
}
