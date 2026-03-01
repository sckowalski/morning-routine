# Morning Speedrun — Design Specification

## Overview

**Morning Speedrun** is a single-user Progressive Web App (PWA) that gamifies your morning routine by turning it into a timed speedrun. You define your routine steps, then race through them each morning — tracking split times, total times, personal bests, and earning XP as you level up.

---

## Core Concept

Think of it like a speedrun timer for your morning. Each routine step has a split timer (like checkpoints in a race). You tap to advance through steps, and the app tracks whether you're ahead or behind your personal best. Over time, you earn XP and level up based on consistency and speed.

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | React + TypeScript | Type safety, component model, huge ecosystem |
| **Build Tool** | Vite | Fast dev server, optimized builds |
| **Styling** | Tailwind CSS | Rapid UI development, responsive by default |
| **Storage** | IndexedDB (via Dexie.js) | Structured local storage, no backend needed |
| **PWA** | Vite PWA Plugin | Service worker, offline support, installable |
| **Charts** | Recharts or Chart.js | Historical trend visualization |
| **Hosting** | Vercel, Netlify, or GitHub Pages | Free static hosting, zero server maintenance |
| **State** | Zustand or React Context | Lightweight, no boilerplate |

### Why No Backend?
- Single user = no auth needed
- Local storage = no server costs, no data breaches, no latency
- File export/import = manual backup strategy
- PWA = installable, works offline

---

## Data Model

### Routine
```typescript
interface Routine {
  id: string;                  // UUID
  name: string;                // e.g., "Weekday Morning"
  steps: RoutineStep[];
  createdAt: string;           // ISO timestamp
  updatedAt: string;
}

interface RoutineStep {
  id: string;                  // UUID
  name: string;                // e.g., "Shower"
  icon: string;                // Emoji or icon identifier
  order: number;               // Position in routine
  parTime?: number;            // Optional target time in seconds
  description?: string;        // Optional notes/reminders
}
```

### Run (a single execution of a routine)
```typescript
interface Run {
  id: string;                  // UUID
  routineId: string;           // FK to Routine
  date: string;                // ISO date (YYYY-MM-DD)
  startTime: string;           // ISO timestamp
  endTime?: string;            // ISO timestamp (null if abandoned)
  totalTime?: number;          // Total seconds
  splits: Split[];
  completed: boolean;
  xpEarned: number;
}

interface Split {
  stepId: string;              // FK to RoutineStep
  startTime: string;           // ISO timestamp
  endTime: string;             // ISO timestamp
  duration: number;            // Seconds for this step
  deltaFromBest?: number;      // +/- seconds vs personal best split
}
```

### User Progress
```typescript
interface UserProgress {
  totalXP: number;
  level: number;
  currentStreak: number;       // Consecutive days with a completed run
  longestStreak: number;
  totalRuns: number;
  totalTimeSpent: number;      // Lifetime seconds in routines
  personalBests: {
    [routineId: string]: {
      totalTime: number;       // Best total time
      splits: {                // Best individual split per step
        [stepId: string]: number;
      };
      date: string;            // When the PB was set
    };
  };
  achievements: string[];      // Achievement IDs unlocked
}
```

---

## Screens & Navigation

### 1. Dashboard (Home)
- **Today's status**: Has the routine been run today? Show result or "Start" button
- **Quick stats**: Current level, XP bar to next level, current streak
- **Personal best**: Best total time for active routine
- **Recent runs**: Last 5 runs with times and delta from PB
- **Quick action**: Big, prominent "Start Routine" button

### 2. Active Run Screen (The Core Experience)
- **Current step**: Large, prominent display of what you're doing now
- **Live timer**: Running clock for current step + total elapsed
- **Split comparison**: Real-time "+2.3s" or "-1.1s" vs your best split (green/red)
- **Progress bar**: Visual indicator of steps completed
- **Next step preview**: What's coming up next
- **Controls**: "Next Step" button (large, tap-friendly), "Pause", "Abandon Run"
- **Finish screen**: Summary with total time, each split vs PB, XP earned, level-up animation if applicable

### 3. Routine Editor
- **Add/remove/reorder steps**: Drag-and-drop or up/down arrows
- **Step details**: Name, icon (emoji picker), optional par time, optional description
- **Multiple routines**: Support for weekday vs weekend, etc.
- **Import/export routine templates**: JSON format

### 4. History & Stats
- **Run history**: Scrollable list of past runs with date, total time, completion status
- **Trend chart**: Line graph of total routine time over the last 30/90/all days
- **Split breakdown**: Per-step average times, best times, worst times
- **Calendar heatmap**: Visual streak/consistency tracker

### 5. Profile & XP
- **Level display**: Current level with visual badge/emblem
- **XP breakdown**: How XP is earned (completion, speed, streaks)
- **Achievement gallery**: Locked/unlocked achievements with descriptions
- **Lifetime stats**: Total runs, total time, average time, improvement %

### 6. Settings
- **Data management**: Export all data (JSON), import data, clear data
- **Theme**: Light/dark mode
- **Sound**: Toggle sound effects (countdown beep, PB celebration, level-up)
- **Notifications**: Optional morning reminder via push notification (PWA)

---

## Gamification System

### XP Rewards

| Action | XP Earned |
|--------|-----------|
| Complete a routine | 100 XP base |
| Beat personal best (total) | +150 XP bonus |
| Beat personal best (any split) | +50 XP per split |
| Under par time (per step) | +25 XP per step |
| Streak bonus (3+ days) | +10 XP × streak length |
| First run of a new routine | +200 XP |

### Leveling Formula
```
XP required for level N = 500 × N × (1 + N × 0.1)

Level 1:  550 XP
Level 2:  1,200 XP cumulative
Level 5:  3,750 XP cumulative
Level 10: 10,500 XP cumulative
Level 20: 42,000 XP cumulative
```
Leveling should feel achievable early on (first few levels in the first week) and slow down gradually.

### Achievements (Examples)

| Achievement | Description |
|-------------|-------------|
| 🌅 Early Bird | Complete your first run |
| ⚡ Speed Demon | Beat your PB 3 times in one week |
| 🔥 On Fire | 7-day streak |
| 🏔️ Mountaineer | 30-day streak |
| 🎯 Precision | Every split within 5s of par time |
| 🚀 Sub-[X] | Complete routine under a milestone time |
| 📈 Level 10 | Reach level 10 |
| 🏗️ Architect | Create 3 different routines |
| 💯 Century | Complete 100 total runs |

---

## Key UX Principles

### Mobile-First
- Large touch targets (minimum 48px)
- One-handed operation during the active run
- Minimal cognitive load — the active run screen should be glanceable

### Speed of Interaction
- "Next step" should be a single tap (or swipe)
- No confirmation dialogs during an active run
- Instant visual feedback on every action

### Motivating, Not Punishing
- Missed a day? No penalty, just encouragement
- Abandoned a run? That's OK, no XP lost
- Slow day? Still earn base XP for completion
- The tone should be encouraging and energizing, not guilt-inducing

### Visual Language
- **Green**: Ahead of PB / under par
- **Red**: Behind PB / over par
- **Gold**: New personal best
- **Blue**: Neutral / informational
- Animations for: PB celebrations, level-ups, achievement unlocks

---

## File Export/Import Format

All data exports as a single JSON file:

```json
{
  "version": "1.0.0",
  "exportedAt": "2026-03-01T10:00:00Z",
  "routines": [...],
  "runs": [...],
  "progress": {...}
}
```

Import should validate the schema, warn about conflicts (e.g., duplicate run dates), and let the user choose to merge or replace.

---

## PWA Configuration

- **Manifest**: App name, icons (192px, 512px), theme color, display: standalone
- **Service Worker**: Cache app shell + assets for offline use
- **Install prompt**: Show custom "Add to Home Screen" banner on first few visits
- **Push notifications**: Optional morning reminder ("Time for your speedrun!")

---

## Development Phases

### Phase 1 — MVP (Core Loop)
- [ ] Project setup (Vite + React + TypeScript + Tailwind)
- [ ] Single routine with step editor (add, remove, reorder)
- [ ] Active run screen with step-by-step timer
- [ ] Split time tracking and total time
- [ ] Personal best tracking (total + per-split)
- [ ] Run history list
- [ ] Basic dashboard with start button and last run summary
- [ ] IndexedDB storage via Dexie.js
- [ ] JSON export/import

### Phase 2 — Gamification
- [ ] XP system and leveling
- [ ] Level-up animations and visual feedback
- [ ] Achievement system (unlock conditions + gallery)
- [ ] Streak tracking
- [ ] PB celebration animations
- [ ] Split delta display (green/red) during active run

### Phase 3 — Polish & Analytics
- [ ] Trend charts (total time over time)
- [ ] Per-step analytics (averages, bests, worsts)
- [ ] Calendar heatmap for streaks
- [ ] Dark/light mode
- [ ] Sound effects (optional)
- [ ] PWA manifest + service worker
- [ ] Push notification reminders

### Phase 4 — Nice-to-Haves
- [ ] Multiple routines (weekday/weekend)
- [ ] Par times with under-par bonuses
- [ ] Step description/notes
- [ ] Swipe gesture to advance steps
- [ ] Confetti/particle effects for milestones
- [ ] Keyboard shortcuts for desktop use

---

## Claude Code Instructions

When building this project with Claude Code, start with Phase 1 and get the core loop working before adding gamification. Suggested approach:

1. **Scaffold the project**: `npm create vite@latest morning-speedrun -- --template react-ts`, then add Tailwind and Dexie.js
2. **Build the data layer first**: Define TypeScript interfaces, set up Dexie.js database, write CRUD functions for routines and runs
3. **Build the active run screen**: This is the heart of the app — get the timer, step progression, and split tracking working
4. **Add the routine editor**: Simple form to add/edit/reorder steps
5. **Build the dashboard**: Wire up the start button, show last run, PB
6. **Add export/import**: JSON file download/upload
7. **Then layer in gamification**: XP, levels, achievements, visual feedback

Test on mobile throughout — this app will primarily be used on a phone first thing in the morning.