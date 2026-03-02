import { useState, useEffect } from 'react'

function formatClock(): string {
  return new Date().toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function CurrentTime() {
  const [time, setTime] = useState(formatClock)

  useEffect(() => {
    const id = setInterval(() => setTime(formatClock()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-center mb-1">
      <div className="font-heading text-lg font-medium tabular-nums text-stone-400">
        {time}
      </div>
    </div>
  )
}
