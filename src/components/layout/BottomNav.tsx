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
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/80 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)]">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neutral/20 to-transparent" />
      <div className="flex justify-around">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center py-2.5 px-2 min-w-[56px] text-[10px] font-medium tracking-wide transition-all duration-200 ${
                isActive
                  ? 'text-neutral'
                  : 'text-slate-500 hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-neutral rounded-full shadow-[0_0_8px_rgba(246,177,122,0.5)]" />
                )}
                <span className={`text-lg mb-0.5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {tab.icon}
                </span>
                <span className="uppercase tracking-wider">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
