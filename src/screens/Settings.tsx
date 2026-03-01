import { useRef, useState } from 'react'
import { useExportImport } from '../hooks/useExportImport'
import { useAppStore } from '../stores/useAppStore'

export function Settings() {
  const { exportData, importData, clearAllData } = useExportImport()
  const showConfirm = useAppStore((s) => s.showConfirm)
  const fileRef = useRef<HTMLInputElement>(null)
  const [importStatus, setImportStatus] = useState<string | null>(null)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const result = await importData(file)
    if (result.success) {
      setImportStatus('Data imported successfully!')
    } else {
      setImportStatus(`Import failed: ${result.error}`)
    }

    // Reset file input
    if (fileRef.current) fileRef.current.value = ''
    setTimeout(() => setImportStatus(null), 3000)
  }

  const handleClear = () => {
    showConfirm({
      title: 'Clear All Data',
      message: 'This will permanently delete all your routines, runs, and progress. This cannot be undone.',
      onConfirm: async () => {
        await clearAllData()
      },
    })
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Settings</h2>

      <div className="flex flex-col gap-3">
        {/* Export */}
        <button
          onClick={exportData}
          className="w-full text-left bg-surface-raised rounded-xl px-4 py-4 active:scale-[0.98] transition-transform"
        >
          <div className="font-medium">Export Data</div>
          <div className="text-sm text-slate-400">Download all your data as a JSON file</div>
        </button>

        {/* Import */}
        <label className="w-full text-left bg-surface-raised rounded-xl px-4 py-4 cursor-pointer active:scale-[0.98] transition-transform block">
          <div className="font-medium">Import Data</div>
          <div className="text-sm text-slate-400">Restore from a previously exported JSON file</div>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        {importStatus && (
          <div className={`text-sm px-4 py-2 rounded-xl ${
            importStatus.includes('failed') ? 'bg-behind/20 text-behind' : 'bg-ahead/20 text-ahead'
          }`}>
            {importStatus}
          </div>
        )}

        {/* Clear */}
        <button
          onClick={handleClear}
          className="w-full text-left bg-surface-raised rounded-xl px-4 py-4 active:scale-[0.98] transition-transform"
        >
          <div className="font-medium text-behind">Clear All Data</div>
          <div className="text-sm text-slate-400">Delete all routines, runs, and progress</div>
        </button>
      </div>
    </div>
  )
}
