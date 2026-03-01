import type { ExportData } from '../types'

export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false
  const d = data as Record<string, unknown>

  if (typeof d.version !== 'string') return false
  if (typeof d.exportedAt !== 'string') return false
  if (!Array.isArray(d.routines)) return false
  if (!Array.isArray(d.runs)) return false
  if (!d.progress || typeof d.progress !== 'object') return false

  // Validate routines have required fields
  for (const r of d.routines) {
    if (!r || typeof r !== 'object') return false
    const routine = r as Record<string, unknown>
    if (typeof routine.id !== 'string') return false
    if (typeof routine.name !== 'string') return false
    if (!Array.isArray(routine.steps)) return false
  }

  // Validate runs have required fields
  for (const r of d.runs) {
    if (!r || typeof r !== 'object') return false
    const run = r as Record<string, unknown>
    if (typeof run.id !== 'string') return false
    if (typeof run.routineId !== 'string') return false
    if (typeof run.completed !== 'boolean') return false
  }

  return true
}
