import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Failed to load content. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-900/30 rounded-2xl bg-red-950/10">
      <div className="w-10 h-10 rounded-full bg-red-900/20 flex items-center justify-center text-red-400 mb-3">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-red-200">{title}</h4>
      <p className="text-xs text-red-300/70 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-900/30 text-red-300 border border-red-800/40 text-xs rounded-lg hover:bg-red-900/50 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  )
}
