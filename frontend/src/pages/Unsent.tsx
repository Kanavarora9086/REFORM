import React, { useState, useEffect } from 'react'
import { Lock, Flame, Sparkles, Trash2, Edit3, Save, Eye } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { AIMessage } from '../components/ui/AIMessage'

const RECIPIENTS = ['Ex-Partner', 'Past Self', 'Someone Lost', 'Unspoken Friend', 'Family Member', 'Future Self']

export default function Unsent() {
  const [text, setText] = useState('')
  const [recipient, setRecipient] = useState('Ex-Partner')
  const [loading, setLoading] = useState(false)
  const [intentAnalysis, setIntentAnalysis] = useState<string | null>(null)
  
  const [letters, setLetters] = useState<any[]>([])
  const [viewingLetter, setViewingLetter] = useState<any | null>(null)
  const [burningId, setBurningId] = useState<number | null>(null)

  useEffect(() => {
    fetchLetters()
  }, [])

  async function fetchLetters() {
    const data = await apiRequest<any[]>('get', '/api/unsent', null, 'reform_unsent_letters')
    setLetters(data || [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      const intentOptions = ['Closure Seeking', 'Grief Release', 'Hope for Connection', 'Self-Soothing']
      const detectedIntent = intentOptions[Math.floor(Math.random() * intentOptions.length)]

      await apiRequest<any>('post', '/api/unsent', { text, recipient, intent: detectedIntent }, 'reform_unsent_letters')
      
      // AI Intent Analysis
      const aiRes = await apiRequest<any>('post', '/api/ai/reflect', {
        prompt: `Analyze the emotional intent of this unsent letter to ${recipient}: "${text}". Identify primary underlying needs.`
      })
      
      setIntentAnalysis(aiRes?.reply || `Analysis: The primary driver behind this letter is ${detectedIntent.toLowerCase()}. Expressing this privately prevents unnecessary conflict while honoring your truth.`)
      setText('')
      fetchLetters()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleBurn = async (id: number) => {
    try {
      await apiRequest<any>('delete', `/api/unsent/${id}`, null, 'reform_unsent_letters')
      const updated = letters.filter((l) => l.id !== id)
      setLetters(updated)
      localStorage.setItem('reform_unsent_letters', JSON.stringify(updated))
      setBurningId(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Encrypted Unsent Vault
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            "Say everything. Send nothing."
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Write what you could never send out loud. Let the paper carry the burden instead of your mind.
          </p>
        </div>
        <Badge variant="copper">100% Private</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Unsent Letter Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card variant="glass" className="flex flex-col gap-4">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#9498a1]">To:</span>
                  <select
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="bg-[#070809] border border-white/[0.08] text-xs text-[#d48c5c] font-semibold px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d48c5c]"
                  >
                    {RECIPIENTS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <Badge variant="neutral"><Lock className="w-3 h-3" /> Encrypted</Badge>
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Dear..."
                rows={10}
                className="font-serif text-base sm:text-lg leading-relaxed bg-[#070809]/40 border-white/[0.06] p-4"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-[#9498a1] italic">
                  Will never be transmitted or delivered to anyone.
                </span>
                <Button variant="primary" loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Privately
                </Button>
              </div>
            </form>
          </Card>

          {/* AI Emotional-Intent Analysis */}
          {intentAnalysis && (
            <AIMessage content={intentAnalysis} title="Emotional Intent Analysis" />
          )}
        </div>

        {/* Saved Unsent Letters List */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9498a1] flex items-center gap-2">
            <Lock className="w-4 h-4" /> Unsent Vault ({letters.length})
          </h3>

          {letters.length === 0 ? (
            <Card variant="subtle" className="text-center py-8">
              <p className="text-xs text-[#9498a1]">No unsent letters stored.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
              {letters.map((l) => (
                <Card key={l.id} variant="glass" padding="sm" className="flex flex-col gap-2 group">
                  <div className="flex items-center justify-between">
                    <Badge variant="copper">To: {l.recipient || 'Someone'}</Badge>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setViewingLetter(l)}
                        className="text-[#9498a1] hover:text-[#f5f2eb] p-1"
                        title="Read letter"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setBurningId(l.id)}
                        className="text-[#9498a1] hover:text-amber-500 p-1"
                        title="Burn ritual"
                      >
                        <Flame className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs font-serif text-[#e6e1d5] line-clamp-3 leading-relaxed">
                    "{l.text}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#9498a1] pt-1">
                    <span>Intent: {l.intent || 'Release'}</span>
                    <span className="font-mono">{new Date(l.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Viewing Letter Modal */}
      <Modal
        isOpen={viewingLetter !== null}
        onClose={() => setViewingLetter(null)}
        title={`Unsent Letter to ${viewingLetter?.recipient}`}
        subtitle="Private Draft"
      >
        {viewingLetter && (
          <div className="flex flex-col gap-4">
            <p className="font-serif text-base text-[#f5f2eb] leading-relaxed whitespace-pre-wrap p-4 bg-[#070809]/60 rounded-xl border border-white/[0.06]">
              {viewingLetter.text}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="danger" icon={<Flame className="w-4 h-4" />} onClick={() => {
                handleBurn(viewingLetter.id)
                setViewingLetter(null)
              }}>
                Burn & Release
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Burn Ritual Modal */}
      <Modal
        isOpen={burningId !== null}
        onClose={() => setBurningId(null)}
        title="Perform Release Ritual?"
        subtitle="This letter will be permanently burned from your private vault."
      >
        <div className="flex flex-col items-center text-center gap-4 py-4">
          <div className="w-16 h-16 rounded-full bg-amber-950/40 border border-amber-800/40 flex items-center justify-center text-amber-500">
            <Flame className="w-8 h-8 animate-pulse" />
          </div>
          <p className="text-xs text-[#9498a1] max-w-sm">
            Symbolically releasing this letter signals to your subconscious that you are ready to let go of this emotional attachment.
          </p>
          <div className="flex justify-end gap-3 w-full mt-4">
            <Button variant="ghost" onClick={() => setBurningId(null)}>Keep Letter</Button>
            <Button variant="danger" icon={<Flame className="w-4 h-4" />} onClick={() => burningId && handleBurn(burningId)}>
              Burn Forever
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
