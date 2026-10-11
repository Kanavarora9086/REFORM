import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'glass' | 'solid' | 'glow' | 'subtle'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'glass',
  hover = true,
  padding = 'md',
  className = '',
  ...props
}) => {
  const variantStyles = {
    glass: 'bg-[#111317]/80 backdrop-blur-md border border-white/[0.06] shadow-xl',
    solid: 'bg-[#16191f] border border-white/[0.08]',
    glow: 'bg-[#111317]/90 backdrop-blur-md border border-[#d48c5c]/30 shadow-copper',
    subtle: 'bg-white/[0.02] border border-white/[0.04]',
  }

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  }

  const hoverStyle = hover ? 'transition-all duration-300 hover:border-white/[0.12] hover:shadow-2xl' : ''

  return (
    <div
      className={`rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
