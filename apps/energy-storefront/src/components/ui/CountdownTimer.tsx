import { useState, useEffect } from 'react'
import { getTimeRemaining } from '@/lib/utils'

interface CountdownTimerProps {
  endDate: string | Date
  onComplete?: () => void
}

export function CountdownTimer({ endDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(new Date(endDate)))

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = getTimeRemaining(new Date(endDate))
      setTimeLeft(remaining)

      if (remaining.total <= 0) {
        clearInterval(timer)
        onComplete?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate, onComplete])

  if (timeLeft.total <= 0) {
    return <span className="text-red-500 font-semibold">Deal Expired</span>
  }

  return (
    <div className="flex items-center gap-2">
      <TimeBlock value={timeLeft.days} label="Days" />
      <span className="text-2xl font-bold text-secondary">:</span>
      <TimeBlock value={timeLeft.hours} label="Hrs" />
      <span className="text-2xl font-bold text-secondary">:</span>
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <span className="text-2xl font-bold text-secondary">:</span>
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  )
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-navy text-white px-3 py-2 rounded-lg min-w-[50px]">
        <span className="font-mono font-bold text-xl">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-navy/60 mt-1">{label}</span>
    </div>
  )
}
