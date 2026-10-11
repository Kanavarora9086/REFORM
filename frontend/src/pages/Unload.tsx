import React, { useState, useEffect } from 'react'
import { Feather, Sparkles, Trash2, Edit3, Maximize2, Minimize2, Save, Clock } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { Modal } from '../components/ui/Modal'
import { AIMessage } from '../components/ui/AIMessage'

export default function Unload() {
  const [text, setText] = useState('')
  const [mood, setMood] = useState('Reflective')
  const [trigger, setTrigger] = useState('Self')
  const [isFocusMode, setIsFocusMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [aiReflection, setAiReflection] = useState<string | null>(null)
  
  const [entries, setEntries] = useState<any[]>([])
  const [editingEntry, setEditingEntry] = useState<any | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  useEffect(() => {
    fetchEntries()
  }, [])

  async function fetchEntries() {
    const data = await apiRequest<any[]>('get', '/api/journal', null, 'reform_unload_entries')
    setEntries(data || [])
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      await apiRequest<any>('post', '/api/journal', { text, mood, trigger }, 'reform_unload_entries')
      
      // Request AI Reflection
      const aiRes = await apiRequest<any>('post', '/api/ai/reflect', {
        prompt: `Journal Entry: "${text}". Mood: ${mood}. Trigger: ${trigger}. Give an empathetic, non-judgmental editorial reflection.`
      })
      
      setAiReflection(aiRes?.reply || "Your writing reflects an earnest desire for growth. Re-read this in a few days to notice how the emotional peak subsides.")
      setText('')
      fetchEntries()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await apiRequest<any>('delete', `/api/journal/${id}`, null, 'reform_unload_entries')
      const updated = entries.filter((e) => e.id !== id)
      setEntries(updated)
      localStorage.setItem('reform_unload_entries', JSON.stringify(updated))
      setDeletingId(null)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      {!isFocusMode && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
              Distraction-Free Journal
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
              Unload
            </h1>
            <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
              Pour out unspoken thoughts, raw emotions, and internal static. No formatting, no pressure.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFocusMode(true)}
            icon={<Maximize2 className="w-4 h-4" />}
          >
            Zen Focus Mode
          </Button>
        </div>
      )}

      {/* Main Journaling Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={isFocusMode ? 'lg:col-span-3' : 'lg:col-span-2'}>
          <Card variant="glass" className={`flex flex-col gap-4 ${isFocusMode ? 'p-8 sm:p-12 min-h-[70vh]' : ''}`}>
            {isFocusMode && (
              <div className="flex justify-between items-center pb-4 border-b border-white/[0.06]">
                <span className="text-xs font-mono text-[#d48c5c]">Zen Mode Active</span>
                <button
                  onClick={() => setIsFocusMode(false)}
                  className="text-xs text-[#9498a1] hover:text-[#f5f2eb] flex items-center gap-1.5"
                >
                  <Minimize2 className="w-4 h-4" /> Exit Focus
                </button>
              </div>
            )}

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d48c5c]"
                >
                  <option value="Reflective">Reflective</option>
                  <option value="Overwhelmed">Overwhelmed</option>
                  <option value="Quiet">Quiet</option>
                  <option value="Grateful">Grateful</option>
                  <option value="Seeking Clarity">Seeking Clarity</option>
                </select>

                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#d48c5c]"
                >
                  <option value="Self">Self Reflection</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Work/Career">Work / Career</option>
                  <option value="Past Memory">Past Memory</option>
                </select>

                <span className="ml-auto text-xs font-mono text-[#9498a1]">
                  {wordCount} words
                </span>
              </div>

              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write whatever wants to be written. Don't edit or censor yourself..."
                rows={isFocusMode ? 14 : 10}
                className="font-serif text-base sm:text-lg leading-relaxed bg-[#070809]/40 border-white/[0.06] p-4"
              />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-[#9498a1] italic">
                  Saved strictly locally & encrypted.
                </span>
                <Button variant="primary" loading={loading} icon={<Save className="w-4 h-4" />}>
                  Save Entry
                </Button>
              </div>
            </form>
          </Card>

          {/* AI Reflection Output */}
          {aiReflection && (
            <div className="mt-6">
              <AIMessage content={aiReflection} title="Unload Insights" />
            </div>
          )}
        </div>

        {/* History Sidebar */}
        {!isFocusMode && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#9498a1] flex items-center gap-2">
              <Clock className="w-4 h-4" /> Journal History ({entries.length})
            </h3>

            {entries.length === 0 ? (
              <Card variant="subtle" className="text-center py-8">
                <p className="text-xs text-[#9498a1]">No journal entries saved yet.</p>
              </Card>
            ) : (
              <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-1">
                {entries.map((item) => (
                  <Card key={item.id} variant="glass" padding="sm" className="flex flex-col gap-2 group">
                    <div className="flex items-center justify-between">
                      <Badge variant="copper">{item.mood || 'Reflective'}</Badge>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="text-[#9498a1] hover:text-red-400 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-serif text-[#e6e1d5] line-clamp-3 leading-relaxed">
                      "{item.text}"
                    </p>
                    <span className="text-[10px] text-[#9498a1] self-end mt-1 font-mono">
                      {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="Delete Journal Entry?"
        subtitle="This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button variant="danger" onClick={() => deletingId && handleDelete(deletingId)}>
            Confirm Delete
          </Button>
        </div>
      </Modal>
    </div>
  )
}
