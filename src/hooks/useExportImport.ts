import { useCallback } from 'react'
import { db } from '../db'
import type { ExportData } from '../types'
import { validateImportData } from '../lib/validate'

export function useExportImport() {
  const exportData = useCallback(async () => {
    const routines = await db.routines.toArray()
    const runs = await db.runs.toArray()
    const progress = await db.progress.get('user')

    const data: ExportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      routines,
      runs,
      progress: progress ?? {
        id: 'user',
        totalXP: 0,
        level: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalRuns: 0,
        totalTimeSpent: 0,
        personalBests: {},
      },
    }

    const jsonString = JSON.stringify(data, null, 2)
    const fileName = `morning-speedrun-${new Date().toISOString().split('T')[0]}.json`

    // Try Web Share API first (works on Android)
    if (navigator.share && navigator.canShare) {
      const file = new File([jsonString], fileName, { type: 'application/json' })
      const shareData = { files: [file] }
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
          return
        } catch (e) {
          // User cancelled — return silently
          if (e instanceof Error && e.name === 'AbortError') return
          // Fall through to blob download
        }
      }
    }

    // Fallback: blob download (desktop)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const importData = useCallback(async (file: File): Promise<{ success: boolean; error?: string }> => {
    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!validateImportData(data)) {
        return { success: false, error: 'Invalid file format' }
      }

      await db.transaction('rw', db.routines, db.runs, db.progress, async () => {
        await db.routines.clear()
        await db.runs.clear()
        await db.progress.clear()

        await db.routines.bulkAdd(data.routines)
        await db.runs.bulkAdd(data.runs)
        await db.progress.add(data.progress)
      })

      return { success: true }
    } catch {
      return { success: false, error: 'Failed to parse file' }
    }
  }, [])

  const clearAllData = useCallback(async () => {
    await db.transaction('rw', db.routines, db.runs, db.progress, async () => {
      await db.routines.clear()
      await db.runs.clear()
      await db.progress.clear()
    })
  }, [])

  return { exportData, importData, clearAllData }
}
