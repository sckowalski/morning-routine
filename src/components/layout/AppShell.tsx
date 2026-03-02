import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { ConfirmDialog } from '../shared/ConfirmDialog'

export function AppShell() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#161210]">
      <header className="relative bg-surface/80 backdrop-blur-md border-b border-white/5 px-5 pt-[calc(env(safe-area-inset-top,0px)+0.875rem)] pb-3.5">
        <h1 className="font-heading text-base font-bold tracking-wide text-neutral">
          Morning Speedrun
        </h1>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral/20 to-transparent" />
      </header>
      <main className="flex-1 overflow-y-auto pb-24 px-4 py-5">
        <Outlet />
      </main>
      <BottomNav />
      <ConfirmDialog />
    </div>
  )
}
