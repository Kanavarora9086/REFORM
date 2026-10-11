import React from 'react'

export interface EmotionOption {
  id: string
  label: string
  subtitle?: string
  intensityGradient?: string
}

export const PRIMARY_EMOTIONS: EmotionOption[] = [
  { id: 'sadness', label: 'Sadness', subtitle: 'Heavy, quiet ache' },
  { id: 'loneliness', label: 'Loneliness', subtitle: 'Isolation, disconnected' },
  { id: 'overthinking', label: 'Overthinking', subtitle: 'Racing, repeating loops' },
  { id: 'anger', label: 'Anger', subtitle: 'Frustration, resentment' },
  { id: 'nostalgia', label: 'Nostalgia', subtitle: 'Longing for what was' },
  { id: 'hope', label: 'Hope', subtitle: 'Faint forward pulse' },
  { id: 'fear', label: 'Fear', subtitle: 'Uncertainty of tomorrow' },
  { id: 'peace', label: 'Peace', subtitle: 'Calm, grounded presence' },
]

interface EmotionSelectorProps {
  selected: string
  onSelect: (emotion: string) => void
}

export const EmotionSelector: React.FC<EmotionSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {PRIMARY_EMOTIONS.map((emo) => {
        const isSelected = selected.toLowerCase() === emo.id.toLowerCase()
        return (
          <button
            key={emo.id}
            type="button"
            onClick={() => onSelect(emo.id)}
            className={`flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-[#d48c5c]/10 border-[#d48c5c] shadow-copper'
                : 'bg-[#070809]/40 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
            }`}
          >
            <span className={`text-sm font-semibold ${isSelected ? 'text-[#d48c5c]' : 'text-[#f5f2eb]'}`}>
              {emo.label}
            </span>
            {emo.subtitle && (
              <span className="text-[11px] text-[#9498a1] mt-1 leading-tight">{emo.subtitle}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
