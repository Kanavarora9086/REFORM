import React from 'react'

interface SliderProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  leftLabel?: string
  rightLabel?: string
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
  label,
  leftLabel,
  rightLabel,
}) => {
  const percentage = ((value - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex items-center justify-between text-xs font-medium text-[#e6e1d5]/80">
          <span>{label}</span>
          <span className="text-[#d48c5c] font-semibold text-sm">{value} / {max}</span>
        </div>
      )}
      <div className="relative flex items-center py-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-[#070809] border border-white/[0.08] rounded-lg appearance-none cursor-pointer accent-[#d48c5c] focus:outline-none"
          style={{
            background: `linear-gradient(to right, #d48c5c 0%, #d48c5c ${percentage}%, #070809 ${percentage}%, #070809 100%)`
          }}
        />
      </div>
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-[11px] text-[#9498a1]">
          <span>{leftLabel}</span>
          <span>{rightLabel}</span>
        </div>
      )}
    </div>
  )
}
