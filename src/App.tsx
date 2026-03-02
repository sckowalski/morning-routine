import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { Dashboard } from './screens/Dashboard'
import { RoutineEditor } from './screens/RoutineEditor'
import { History } from './screens/History'
import { Settings } from './screens/Settings'
import { Analytics } from './screens/Analytics'
import { ActiveRun } from './screens/ActiveRun'
import { RunSummary } from './screens/RunSummary'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'editor', element: <RoutineEditor /> },
      { path: 'history', element: <History /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
  { path: '/run', element: <ActiveRun /> },
  { path: '/run/summary/:runId', element: <RunSummary /> },
])
