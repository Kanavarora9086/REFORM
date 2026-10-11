import React, { useState, useEffect } from 'react'

interface CountdownTimerProps {
  initialSeconds?: number
  onComplete?: () => void
  autoStart?: boolean
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds = 30,
  onComplete,
  autoStart = false,
}) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(autoStart)

  useEffect(() => {
    let interval: any = null
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1)
      }, 1000)
    } else if (seconds === 0 && isActive) {
      setIsActive(false)
      if (onComplete) onComplete()
    }
    return () => clearInterval(interval)
  }, [isActive, seconds, onComplete])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => setIsActive(true)
  const pauseTimer = () => setIsActive(false)
  const resetTimer = (newSecs = initialSeconds) => {
    setIsActive(false)
    setSeconds(newSecs)
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#070809]/60 border border-white/[0.08] rounded-2xl">
      <div className="relative flex items-center justify-center my-4">
        <div className={`w-36 h-36 rounded-full border-2 border-[#d48c5c]/40 flex items-center justify-center ${isActive ? 'animate-pulse-glow' : ''}`}>
          <span className="text-4xl font-mono font-bold text-[#f5f2eb] tracking-wider">
            {formatTime(seconds)}
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        {!isActive ? (
          <button
            onClick={startTimer}
            disabled={seconds === 0}
            className="px-5 py-2 bg-[#d48c5c] text-[#0b0c0e] font-semibold text-sm rounded-lg hover:brightness-110 shadow-copper"
          >
            {seconds === 0 ? 'Completed' : 'Begin Pause'}
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="px-5 py-2 bg-white/[0.08] text-[#f5f2eb] text-sm rounded-lg hover:bg-white/[0.12]"
          >
            Pause Timer
          </button>
        )}
        <button
          onClick={() => resetTimer()}
          className="px-4 py-2 bg-transparent text-[#9498a1] text-sm hover:text-[#f5f2eb]"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
