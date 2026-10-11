import React from 'react'
import { Sparkles } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-white/[0.08] rounded-2xl bg-[#070809]/30">
      <div className="w-12 h-12 rounded-2xl bg-[#1e222b] border border-white/[0.08] flex items-center justify-center text-[#d48c5c] mb-4 shadow-lg">
        {icon || <Sparkles className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-serif font-semibold text-[#f5f2eb]">{title}</h4>
      {description && <p className="text-xs text-[#9498a1] max-w-sm mt-1.5 leading-relaxed">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 bg-[#d48c5c]/15 text-[#d48c5c] border border-[#d48c5c]/30 text-xs font-semibold rounded-lg hover:bg-[#d48c5c]/25 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
