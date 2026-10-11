import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  position?: 'left' | 'right' | 'bottom'
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const positionStyles = {
    right: 'top-0 right-0 h-full w-full sm:w-96 border-l',
    left: 'top-0 left-0 h-full w-full sm:w-96 border-r',
    bottom: 'bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl border-t',
  }

  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`fixed ${positionStyles[position]} bg-[#111317] border-white/[0.08] shadow-2xl flex flex-col z-10 transition-transform`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          {title && <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">{title}</h3>}
          <button
            onClick={onClose}
            className="text-[#9498a1] hover:text-[#f5f2eb] p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}
