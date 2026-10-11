import React, { useState, useEffect } from 'react'
import { Clock, Lock, Unlock, Plus, Calendar, Sparkles } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'

export default function FutureYou() {
  const [msg, setMsg] = useState('')
  const [days, setDays] = useState(30)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const data = await apiRequest<any[]>('get', '/api/future-messages', null, 'reform_future_messages')
    setMessages(data || [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!msg.trim()) return
    setLoading(true)
    try {
      const unlockDate = new Date(Date.now() + days * 24 * 3600 * 1000).toISOString()
      const payload = {
        content: msg,
        days,
        unlock_date: unlockDate,
        sealed: true,
      }
      const saved = await apiRequest<any>('post', '/api/future-messages', payload)
      const newMsg = saved || { id: Date.now(), ...payload }
      const updated = [newMsg, ...messages]
      setMessages(updated)
      localStorage.setItem('reform_future_messages', JSON.stringify(updated))
      setMsg('')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (item: any) => {
    return new Date(item.unlock_date).getTime() <= Date.now() || !item.sealed
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Time Capsule Messages
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            "Leave something for the person you're becoming."
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Write a letter to yourself 30, 60, or 90 days in the future. Locked until the reveal date.
          </p>
        </div>
        <Badge variant="copper">Time Lock Active</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Write Future Capsule */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card variant="glass" className="flex flex-col gap-4">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <Textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Dear Future Me, when you read this, I hope..."
                rows={8}
                className="font-serif text-base leading-relaxed bg-[#070809]/40 border-white/[0.06] p-4"
              />

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9498a1]">Lock Duration:</span>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="bg-[#070809] border border-white/[0.08] text-xs text-[#d48c5c] font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d48c5c]"
                  >
                    <option value={30}>30 Days</option>
                    <option value={60}>60 Days</option>
                    <option value={90}>90 Days</option>
                  </select>
                </div>

                <Button variant="primary" loading={loading} icon={<Lock className="w-4 h-4" />}>
                  Seal Capsule
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Saved Capsules List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9498a1] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Sealed Capsules ({messages.length})
          </h3>

          {messages.length === 0 ? (
            <Card variant="subtle" className="text-center py-8">
              <p className="text-xs text-[#9498a1]">No future capsules sealed yet.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3 max-h-[550px] overflow-y-auto pr-1">
              {messages.map((m) => {
                const unlocked = isUnlocked(m)
                return (
                  <Card key={m.id} variant="glass" padding="sm" className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={unlocked ? 'copper' : 'neutral'}>
                        {unlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                        {unlocked ? 'Unlocked' : `${m.days} Days Lock`}
                      </Badge>
                      <span className="text-[10px] font-mono text-[#9498a1]">
                        {new Date(m.unlock_date).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs font-serif text-[#e6e1d5] line-clamp-2 italic leading-relaxed mt-1">
                      {unlocked ? `"${m.content}"` : '••••••••••••••••••••••••••••••••••••••••'}
                    </p>

                    <div className="flex justify-end pt-2 border-t border-white/[0.04]">
                      <button
                        onClick={() => setSelectedMessage(m)}
                        className="text-xs text-[#d48c5c] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {unlocked ? 'Read Message →' : 'Inspect Countdown'}
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Detail / Reveal Modal */}
      {selectedMessage && (
        <Modal
          isOpen={selectedMessage !== null}
          onClose={() => setSelectedMessage(null)}
          title={isUnlocked(selectedMessage) ? "Future You Capsule Unlocked" : "Capsule Still Sealed"}
          subtitle={`Unlock Date: ${new Date(selectedMessage.unlock_date).toLocaleDateString()}`}
        >
          {isUnlocked(selectedMessage) ? (
            <div className="flex flex-col gap-4">
              <p className="font-serif text-lg text-[#f5f2eb] leading-relaxed p-6 bg-[#070809]/60 rounded-xl border border-[#d48c5c]/30 italic">
                "{selectedMessage.content}"
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-4 py-6">
              <div className="w-16 h-16 rounded-full bg-[#1e222b] border border-white/[0.08] flex items-center justify-center text-[#d48c5c]">
                <Lock className="w-8 h-8" />
              </div>
              <p className="text-xs text-[#9498a1] max-w-sm">
                This time capsule is sealed until {new Date(selectedMessage.unlock_date).toLocaleDateString()}. Respect your past self's journey and return on that day.
              </p>
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}
