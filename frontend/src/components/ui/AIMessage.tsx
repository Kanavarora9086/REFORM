import React from 'react'
import { Sparkles, Copy, Check } from 'lucide-react'

interface AIMessageProps {
  content: string
  title?: string
  timestamp?: string
  onSave?: () => void
}

export const AIMessage: React.FC<AIMessageProps> = ({
  content,
  title = 'AI Perspective',
  timestamp,
  onSave,
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-gradient-to-b from-[#16191f] to-[#111317] border border-[#d48c5c]/30 rounded-xl p-6 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#d48c5c]/20 text-[#d48c5c]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">{title}</h4>
            {timestamp && <span className="text-[10px] text-[#9498a1]">{timestamp}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-[#9498a1] hover:text-[#f5f2eb] hover:bg-white/[0.06] rounded-md transition-colors text-xs flex items-center gap-1"
            title="Copy reflection"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      
      <blockquote className="font-serif text-base sm:text-lg text-[#f5f2eb]/90 leading-relaxed italic border-l-2 border-[#d48c5c]/40 pl-4 py-1">
        "{content}"
      </blockquote>
    </div>
  )
}
