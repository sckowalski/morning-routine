# Morning Speedrun

A PWA that gamifies morning routines as a speedrun timer. The user defines routine steps, races through them each morning, and tracks split times and personal bests.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS v4 (configured in CSS via `@tailwindcss/vite`, no JS config file)
- **Storage**: IndexedDB via Dexie.js (persistent data)
- **State**: Zustand (ephemeral run state only — never duplicate Dexie data in Zustand)
- **Routing**: React Router v7 (`createBrowserRouter`)

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Type-check + production build
- `npm run preview` — Preview production build

## Architecture

- **Dexie = persistent data, Zustand = ephemeral state.** Components read persisted data via `useLiveQuery` hooks from Dexie.
- **Timer**: `performance.now()` for elapsed time, ISO strings for storage. rAF loop throttled to 10 renders/sec.
- **Active run routes** live outside `AppShell` (no bottom nav during run).
- **Single routine** assumed in Phase 1 UI, but data model supports multiple via `routineId` FKs.
- **Tailwind v4**: All theming via `@theme` in `src/index.css`. No `tailwind.config` file.
- **Zustand v5**: Always use individual selectors or `useShallow`. Returning object literals from selectors causes infinite re-render loops.

## File Structure

- `src/types/index.ts` — All TypeScript interfaces
- `src/db/` — Dexie DB class + CRUD functions (routines, runs, progress)
- `src/stores/` — Zustand stores (useRunStore, useAppStore)
- `src/hooks/` — Custom hooks (useTimer, useRoutine, useRuns, usePersonalBests, useExportImport)
- `src/lib/` — Utility functions (ids, time formatting, xp calc, validation)
- `src/screens/` — Page-level components
- `src/components/` — Reusable components organized by feature (layout, dashboard, run, editor, history, shared)

## Color Semantics

- `ahead` (green) — Ahead of PB / under par
- `behind` (red) — Behind PB / over par
- `pb-gold` (gold) — New personal best
- `neutral` (blue) — Informational
