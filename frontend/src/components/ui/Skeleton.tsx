import React from 'react'

interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  circle?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  circle = false,
}) => {
  const style: React.CSSProperties = {
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  }

  return (
    <div
      style={style}
      className={`bg-white/[0.05] animate-pulse ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
    />
  )
}
