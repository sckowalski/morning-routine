import { useState, useEffect } from 'react'

function formatClock(): string {
  return new Date().toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatDate(): string {
  return new Date().toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

interface CurrentTimeProps {
  showDate?: boolean
  size?: 'default' | 'large'
}

export function CurrentTime({ showDate, size = 'default' }: CurrentTimeProps) {
  const [time, setTime] = useState(formatClock)

  useEffect(() => {
    const id = setInterval(() => setTime(formatClock()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center mb-1">
      <div className={`font-heading font-medium tabular-nums ${
        size === 'large'
          ? 'text-4xl font-bold text-stone-100'
          : 'text-lg text-stone-400'
      }`}>
        {time}
      </div>
      {showDate && (
        <div className="text-sm text-slate-500 mt-1">
          {formatDate()}
        </div>
      )}
    </div>
  )
}
