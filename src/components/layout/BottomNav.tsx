import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/editor', label: 'Routine', icon: '📝' },
  { to: '/history', label: 'History', icon: '📊' },
  { to: '/analytics', label: 'Stats', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-700 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 min-w-[64px] text-xs transition-colors ${
                isActive ? 'text-neutral' : 'text-slate-400'
              }`
            }
          >
            <span className="text-xl mb-0.5">{tab.icon}</span>
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
