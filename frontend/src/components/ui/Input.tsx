import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-[#e6e1d5]/80 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <span className="absolute left-3.5 text-[#9498a1]">{icon}</span>}
        <input
          id={inputId}
          className={`w-full bg-[#070809]/60 border border-white/[0.08] rounded-lg text-sm text-[#f5f2eb] placeholder-[#5a5f69] ${
            icon ? 'pl-10' : 'px-3.5'
          } py-2.5 transition-all duration-200 focus:outline-none focus:border-[#d48c5c]/60 focus:ring-1 focus:ring-[#d48c5c]/30 ${
            error ? 'border-red-500/50 focus:border-red-500' : ''
          } ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#9498a1]">{helperText}</span>}
    </div>
  )
}
