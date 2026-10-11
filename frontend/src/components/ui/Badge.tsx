import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'copper' | 'neutral' | 'success' | 'outline' | 'released'
  size?: 'sm' | 'md'
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
}) => {
  const variantStyles = {
    copper: 'bg-[#d48c5c]/15 text-[#d48c5c] border border-[#d48c5c]/30',
    neutral: 'bg-white/[0.06] text-[#e6e1d5] border border-white/[0.08]',
    success: 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40',
    outline: 'bg-transparent text-[#9498a1] border border-white/[0.12]',
    released: 'bg-stone-900/60 text-stone-400 border border-stone-800/60',
  }

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full font-medium tracking-wide',
    md: 'text-xs px-3 py-1 rounded-full font-medium tracking-wide',
  }

  return (
    <span className={`inline-flex items-center gap-1 ${variantStyles[variant]} ${sizeStyles[size]}`}>
      {children}
    </span>
  )
}
