import React from 'react'

interface TabOption {
  id: string
  label: string
  count?: number
}

interface TabsProps {
  tabs: TabOption[]
  activeTab: string
  onChange: (id: string) => void
  variant?: 'pills' | 'underline'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'pills',
}) => {
  if (variant === 'underline') {
    return (
      <div className="flex border-b border-white/[0.08] gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`py-3 text-sm font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'border-[#d48c5c] text-[#f5f2eb]'
                  : 'border-transparent text-[#9498a1] hover:text-[#e6e1d5]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#d48c5c]/20 text-[#d48c5c]' : 'bg-white/[0.06] text-[#9498a1]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="inline-flex p-1 bg-[#070809]/80 border border-white/[0.08] rounded-xl gap-1 overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              isActive
                ? 'bg-[#1e222b] text-[#f5f2eb] shadow-md border border-white/[0.08]'
                : 'text-[#9498a1] hover:text-[#f5f2eb]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-[#d48c5c]/20 text-[#d48c5c]' : 'bg-white/[0.06] text-[#9498a1]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
