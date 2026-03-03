# Morning Speedrun

**Turn your morning routine into a speedrun.**

Morning Speedrun is a progressive web app that gamifies your daily routine with a split timer, personal bests, XP progression, and detailed analytics. Define your morning steps, race through them each day, and watch your times improve over time.

## Features

- **Speedrun Timer** -- High-precision timer powered by `performance.now()` with live split tracking for each step of your routine. Auto-finishes 1.5s after the last step is completed.
- **Personal Bests** -- Automatically tracks your best total time and best individual split times. Deltas show whether you're ahead or behind your PB in real time.
- **Out-of-Order Steps** -- Complete steps in any order you want. Tap the step sidebar to jump between tasks as your morning demands.
- **Undo** -- Accidentally completed a step? Tap undo within 4 seconds to revert it and keep going.
- **In-Place Step Editing** -- Edit step names and icons directly from the routine editor without removing and re-adding.
- **XP and Leveling** -- Earn XP for completing runs, hitting personal bests, and maintaining streaks. Level up as you build consistency.
- **Analytics Dashboard** -- Trend charts, summary stats, per-step breakdowns, and filterable date ranges (7d / 30d / 90d / all time / custom) powered by Recharts.
- **Run History** -- Browse and manage past runs with detailed split breakdowns and completion status.
- **Custom Emojis** -- Assign an emoji icon to each step for quick visual identification.
- **Import / Export** -- Back up your routines, runs, and progress as JSON. Uses the native share sheet on Android, direct download on desktop.
- **PWA + Android** -- Installable as a PWA on mobile and desktop. Also available as a native Android app via Capacitor with foreground notification support during runs.

## Tech Stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Framework | React 19 + TypeScript               |
| Build     | Vite 7                              |
| Styling   | Tailwind CSS v4 (CSS-based config)  |
| Storage   | IndexedDB via Dexie.js              |
| State     | Zustand v5 (ephemeral run state)    |
| Routing   | React Router v7                     |
| Charts    | Recharts                            |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone https://github.com/your-username/morning-routine.git
cd morning-routine
npm install
```

### Development

```bash
npm run dev
```

Opens the app at [http://localhost:5173](http://localhost:5173).

### Production Build

```bash
npm run build
```

Runs TypeScript type-checking followed by a Vite production build.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

## Project Structure

```
src/
├── types/          # TypeScript interfaces (Routine, Run, Split, etc.)
├── db/             # Dexie database class and CRUD functions
├── stores/         # Zustand stores (run state, app state)
├── hooks/          # Custom hooks (useTimer, useRoutine, useRuns, usePersonalBests, useExportImport)
├── lib/            # Utilities (ID generation, time formatting, XP calculation, analytics)
├── screens/        # Page-level components (Dashboard, ActiveRun, RunSummary, Analytics, History, Settings, RoutineEditor)
└── components/     # Reusable UI organized by feature
    ├── layout/     #   App shell and navigation
    ├── dashboard/  #   Dashboard widgets
    ├── run/        #   Timer display, step sidebar, progress bar, controls
    ├── editor/     #   Routine step editor
    ├── analytics/  #   Charts, summary cards, date range selector
    ├── history/    #   Run history list and details
    └── shared/     #   Common components (empty states, etc.)
```
