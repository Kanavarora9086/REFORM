import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'copper-outline'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  loading?: boolean
  fullWidth?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
  
  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#d48c5c] to-[#b87342] text-[#0b0c0e] font-semibold hover:brightness-110 shadow-copper active:scale-[0.98]',
    secondary: 'bg-white/[0.04] text-[#f5f2eb] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] active:scale-[0.98]',
    ghost: 'text-[#9498a1] hover:text-[#f5f2eb] hover:bg-white/[0.04]',
    danger: 'bg-red-900/30 text-red-300 border border-red-800/40 hover:bg-red-900/50',
    'copper-outline': 'bg-transparent text-[#d48c5c] border border-[#d48c5c]/40 hover:bg-[#d48c5c]/10 hover:border-[#d48c5c]',
  }

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  )
}
