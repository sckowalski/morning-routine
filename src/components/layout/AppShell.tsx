import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { ConfirmDialog } from '../shared/ConfirmDialog'

export function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col">
      <header className="bg-surface border-b border-slate-700 px-4 py-3">
        <h1 className="text-lg font-bold tracking-tight">Morning Speedrun</h1>
      </header>
      <main className="flex-1 overflow-y-auto pb-20 px-4 py-4">
        <Outlet />
      </main>
      <BottomNav />
      <ConfirmDialog />
    </div>
  )
}
