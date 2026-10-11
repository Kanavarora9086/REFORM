import React from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 5,
  ...props
}) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-[#e6e1d5]/80 tracking-wide">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={`w-full bg-[#070809]/60 border border-white/[0.08] rounded-lg text-sm text-[#f5f2eb] placeholder-[#5a5f69] px-3.5 py-3 transition-all duration-200 focus:outline-none focus:border-[#d48c5c]/60 focus:ring-1 focus:ring-[#d48c5c]/30 resize-y ${
          error ? 'border-red-500/50' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#9498a1]">{helperText}</span>}
    </div>
  )
}
