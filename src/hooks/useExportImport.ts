import { useCallback } from 'react'
import { Capacitor } from '@capacitor/core'
import { db } from '../db'
import type { ExportData } from '../types'
import { validateImportData } from '../lib/validate'

export function useExportImport() {
  const exportData = useCallback(async (): Promise<string> => {
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

    // Tier 1: Web Share API (works on Android share sheet)
    console.log('[Export] Tier 1: Trying Web Share API...')
    if (navigator.share && navigator.canShare) {
      const file = new File([jsonString], fileName, { type: 'application/json' })
      const shareData = { files: [file] }
      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
          console.log('[Export] Tier 1: Web Share succeeded')
          return 'shared'
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') {
            console.log('[Export] Tier 1: User cancelled share')
            return 'cancelled'
          }
          console.warn('[Export] Tier 1: Web Share failed:', e)
        }
      } else {
        console.log('[Export] Tier 1: canShare returned false')
      }
    } else {
      console.log('[Export] Tier 1: Web Share API not available')
    }

    // Tier 2: Capacitor Filesystem (native file write to Documents)
    if (Capacitor.isNativePlatform()) {
      console.log('[Export] Tier 2: Trying Capacitor Filesystem...')
      try {
        const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
        await Filesystem.writeFile({
          path: fileName,
          data: jsonString,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        })
        console.log('[Export] Tier 2: Saved to Documents/' + fileName)
        return `Saved to Documents/${fileName}`
      } catch (e) {
        console.warn('[Export] Tier 2: Capacitor Filesystem failed:', e)
      }
    } else {
      console.log('[Export] Tier 2: Not native platform, skipping Filesystem')
    }

    // Tier 3: Blob download (desktop browsers)
    console.log('[Export] Tier 3: Trying blob download...')
    try {
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      console.log('[Export] Tier 3: Blob download triggered')
      return 'downloaded'
    } catch (e) {
      console.warn('[Export] Tier 3: Blob download failed:', e)
    }

    // Tier 4: Clipboard fallback
    console.log('[Export] Tier 4: Trying clipboard fallback...')
    try {
      await navigator.clipboard.writeText(jsonString)
      console.log('[Export] Tier 4: Copied to clipboard')
      return 'Copied to clipboard'
    } catch (e) {
      console.error('[Export] Tier 4: Clipboard failed:', e)
    }

    console.error('[Export] All tiers failed')
    return 'failed'
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
