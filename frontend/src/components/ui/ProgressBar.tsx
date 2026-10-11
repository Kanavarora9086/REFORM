import React from 'react'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  height?: 'sm' | 'md' | 'lg'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercentage = true,
  height = 'md',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)))

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs text-[#9498a1]">
          {label && <span>{label}</span>}
          {showPercentage && <span className="font-mono text-[#d48c5c]">{percentage}%</span>}
        </div>
      )}
      <div className={`w-full bg-[#070809] border border-white/[0.08] rounded-full overflow-hidden ${heights[height]}`}>
        <div
          className="h-full bg-gradient-to-r from-[#d48c5c] to-[#e59a68] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
