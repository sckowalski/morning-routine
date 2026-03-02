export interface RoutineStep {
  id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Routine {
  id: string;
  name: string;
  steps: RoutineStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Split {
  stepId: string;
  startTime: string;
  endTime: string;
  duration: number;
  deltaFromBest?: number;
  skipped?: boolean;
}

export interface Run {
  id: string;
  routineId: string;
  date: string;
  startTime: string;
  endTime?: string;
  totalTime?: number;
  splits: Split[];
  completed: boolean;
  xpEarned: number;
}

export interface PersonalBestData {
  totalTime: number;
  splits: Record<string, number>;
  date: string;
}

export interface UserProgress {
  id: string; // singleton key, always "user"
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  totalRuns: number;
  totalTimeSpent: number;
  personalBests: Record<string, PersonalBestData>;
}

export interface ExportData {
  version: string;
  exportedAt: string;
  routines: Routine[];
  runs: Run[];
  progress: UserProgress;
}

// Analytics types
export type DateRangePreset = '7d' | '30d' | '90d' | 'all' | 'custom'

export interface DateRange {
  preset: DateRangePreset;
  startDate: string;
  endDate: string;
}

export interface RunSummaryStats {
  totalRuns: number;
  completedRuns: number;
  averageTimeMs: number;
  bestTimeMs: number;
  completionRate: number;
}

export interface StepStats {
  stepId: string;
  stepName: string;
  stepIcon: string;
  averageMs: number;
  bestMs: number;
  worstMs: number;
  sampleCount: number;
}

export interface TrendPoint {
  date: string;
  totalTimeMs: number;
}
