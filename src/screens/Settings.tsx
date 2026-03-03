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
    <div className="animate-fade-in">
      <h2 className="font-heading text-xl font-bold mb-4">Settings</h2>

      <div className="flex flex-col gap-3">
        {/* Export */}
        <button
          onClick={exportData}
          className="w-full text-left card border border-white/5 px-4 py-4 active:scale-[0.98] transition-all duration-200
            hover:border-neutral/15"
        >
          <div className="font-medium text-sm">Export Data</div>
          <div className="text-xs text-slate-500 mt-0.5">Download all your data as a JSON file</div>
        </button>

        {/* Import */}
        <label className="w-full text-left card border border-white/5 px-4 py-4 cursor-pointer active:scale-[0.98]
          transition-all duration-200 hover:border-neutral/15 block">
          <div className="font-medium text-sm">Import Data</div>
          <div className="text-xs text-slate-500 mt-0.5">Restore from a previously exported JSON file</div>
          <input
            ref={fileRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImport}
            className="hidden"
          />
        </label>

        {importStatus && (
          <div className={`text-xs px-4 py-2.5 rounded-xl border animate-scale-in ${
            importStatus.includes('failed')
              ? 'bg-behind/10 text-behind border-behind/15'
              : 'bg-ahead/10 text-ahead border-ahead/15'
          }`}>
            {importStatus}
          </div>
        )}

        {/* Clear */}
        <button
          onClick={handleClear}
          className="w-full text-left card border border-behind/10 px-4 py-4 active:scale-[0.98]
            transition-all duration-200 hover:border-behind/25"
        >
          <div className="font-medium text-sm text-behind">Clear All Data</div>
          <div className="text-xs text-slate-500 mt-0.5">Delete all routines, runs, and progress</div>
        </button>
      </div>
    </div>
  )
}
