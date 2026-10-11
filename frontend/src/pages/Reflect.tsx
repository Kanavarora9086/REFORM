import React, { useState } from 'react'
import { Sparkles, Send, Compass, MessageSquare, Lightbulb } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { AIMessage } from '../components/ui/AIMessage'

const SUGGESTED_PROMPTS = [
  "Why do I feel the sudden urge to reach out right now?",
  "How do I forgive myself for time lost in the past?",
  "What is this feeling of emptiness trying to tell me?",
  "How can I break the cycle of overthinking tonight?",
]

export default function Reflect() {
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; time: string }>>([
    {
      role: 'ai',
      text: "Welcome to Reflect. I am your space for emotional clarity. I don't give generic advice or cheerleading—I help you untangle your internal narrative. What is occupying your thoughts?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || prompt
    if (!textToSend.trim()) return

    const userMsg = {
      role: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, userMsg])
    setPrompt('')
    setLoading(true)

    try {
      const res = await apiRequest<any>('post', '/api/ai/reflect', { prompt: textToSend })
      const aiText = res?.reply || "Consider what lies behind this thought. Are you seeking certainty, or are you trying to protect yourself from feeling vulnerable?"
      
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai' as const,
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Editorial AI Companion
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Reflect
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            A quiet dialogue designed to bring clarity, perspective, and self-compassion.
          </p>
        </div>
        <Badge variant="copper">Clarity Engine Active</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Conversation Stream */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-6 min-h-[450px] max-h-[600px] overflow-y-auto pr-2">
            {messages.map((msg, idx) => (
              <div key={idx} className="animate-fade-in">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-[#1e222b] border border-white/[0.08] text-[#f5f2eb] p-4 rounded-2xl max-w-lg shadow-md">
                      <p className="text-xs sm:text-sm font-sans leading-relaxed">{msg.text}</p>
                      <span className="text-[10px] text-[#9498a1] block text-right mt-1.5 font-mono">{msg.time}</span>
                    </div>
                  </div>
                ) : (
                  <AIMessage content={msg.text} title="Voice of Clarity" timestamp={msg.time} />
                )}
              </div>
            ))}
            {loading && (
              <div className="p-4 bg-[#111317] border border-[#d48c5c]/20 rounded-xl text-xs text-[#d48c5c] flex items-center gap-2 animate-pulse">
                <Sparkles className="w-4 h-4" /> Formulating reflective insight...
              </div>
            )}
          </div>

          {/* Input Box */}
          <Card variant="glass" padding="sm" className="flex flex-col gap-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your question or reflection..."
              rows={3}
              className="bg-[#070809]/60 border-white/[0.06] text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <div className="flex justify-between items-center px-1">
              <span className="text-[11px] text-[#9498a1]">Press Shift + Enter for new line</span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSend()}
                loading={loading}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send Reflection
              </Button>
            </div>
          </Card>
        </div>

        {/* Contextual & Suggested Prompts Sidebar */}
        <div className="flex flex-col gap-6">
          <Card variant="glass" className="flex flex-col gap-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#d48c5c] flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Deep Prompts
            </h3>
            <div className="flex flex-col gap-2">
              {SUGGESTED_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p)}
                  className="text-left p-3 rounded-lg bg-[#070809]/40 border border-white/[0.04] text-xs text-[#e6e1d5] hover:border-[#d48c5c]/40 hover:text-[#f5f2eb] transition-all cursor-pointer leading-relaxed"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </Card>

          <Card variant="subtle" className="flex flex-col gap-3">
            <h4 className="text-xs font-mono uppercase text-[#9498a1]">Privacy Guarantee</h4>
            <p className="text-xs text-[#9498a1] leading-relaxed">
              Your conversations are never trained on public AI models. All insights remain strictly yours.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
