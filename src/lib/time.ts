/** Format milliseconds as M:SS.d (e.g., 2:05.3) */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const tenths = Math.floor((ms % 1000) / 100)
  return `${minutes}:${seconds.toString().padStart(2, '0')}.${tenths}`
}

/** Format milliseconds as M:SS (no tenths) */
export function formatTimeShort(ms: number): string {
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

/** Format a delta in ms as +X.Xs or -X.Xs */
export function formatDelta(deltaMs: number): string {
  const sign = deltaMs >= 0 ? '+' : '-'
  const abs = Math.abs(deltaMs)
  const seconds = Math.floor(abs / 1000)
  const tenths = Math.floor((abs % 1000) / 100)
  return `${sign}${seconds}.${tenths}s`
}

/** Format an ISO date string as a short date */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

/** Format an ISO date string as time of day */
export function formatTimeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Get today's date as YYYY-MM-DD */
export function todayDateString(): string {
  return new Date().toISOString().split('T')[0]
}
