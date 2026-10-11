import React, { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type?: 'success' | 'error' | 'info'
  title: string
  message?: string
}

interface ToastProps {
  toast: ToastMessage | null
  onClose: () => void
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(onClose, 4000)
      return () => clearTimeout(timer)
    }
  }, [toast, onClose])

  if (!toast) return null

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#d48c5c]" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-amber-300" />,
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#16191f] border border-[#d48c5c]/30 text-[#f5f2eb] px-4 py-3 rounded-xl shadow-2xl animate-fade-in max-w-sm">
      <span>{icons[toast.type || 'info']}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight">{toast.title}</p>
        {toast.message && <p className="text-xs text-[#9498a1] mt-0.5">{toast.message}</p>}
      </div>
      <button onClick={onClose} className="text-[#9498a1] hover:text-[#f5f2eb] p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
