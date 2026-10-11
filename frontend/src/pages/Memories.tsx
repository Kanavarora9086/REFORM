import React, { useState, useEffect } from 'react'
import { Bookmark, Plus, Trash2, Edit3, Heart, Archive, Flame, Filter, Eye } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { Badge } from '../components/ui/Badge'
import { Tabs } from '../components/ui/Tabs'
import { Modal } from '../components/ui/Modal'

export default function Memories() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'KEEP' | 'ARCHIVE' | 'RELEASE'>('ALL')
  const [memories, setMemories] = useState<any[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedMemory, setSelectedMemory] = useState<any | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [emotion, setEmotion] = useState('Nostalgia')
  const [status, setStatus] = useState<'KEEP' | 'ARCHIVE' | 'RELEASE'>('KEEP')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMemories()
  }, [])

  async function fetchMemories() {
    const data = await apiRequest<any[]>('get', '/api/memories', null, 'reform_memories')
    setMemories(data || [])
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const payload = {
        title,
        description,
        status,
        emotion,
        date: new Date().toISOString().split('T')[0],
      }
      const saved = await apiRequest<any>('post', '/api/memories', payload)
      const newMemory = saved || { id: Date.now(), ...payload }
      const updated = [newMemory, ...memories]
      setMemories(updated)
      localStorage.setItem('reform_memories', JSON.stringify(updated))
      setTitle('')
      setDescription('')
      setIsAddModalOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateMemoryStatus = (id: number, newStatus: 'KEEP' | 'ARCHIVE' | 'RELEASE') => {
    const updated = memories.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    setMemories(updated)
    localStorage.setItem('reform_memories', JSON.stringify(updated))
    if (selectedMemory) setSelectedMemory({ ...selectedMemory, status: newStatus })
  }

  const filteredMemories = activeTab === 'ALL'
    ? memories
    : memories.filter((m) => m.status === activeTab)

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Emotional Artifact Vault
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Memories
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Categorize significant personal artifacts: Keep what nurtures you, archive what is past, release what weighs you down.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsAddModalOpen(true)}>
          Add Memory
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-between items-center">
        <Tabs
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
          tabs={[
            { id: 'ALL', label: 'All Artifacts', count: memories.length },
            { id: 'KEEP', label: 'Keep (Treasured)', count: memories.filter((m) => m.status === 'KEEP').length },
            { id: 'ARCHIVE', label: 'Archive (Past)', count: memories.filter((m) => m.status === 'ARCHIVE').length },
            { id: 'RELEASE', label: 'Released', count: memories.filter((m) => m.status === 'RELEASE').length },
          ]}
        />
      </div>

      {/* Memories Grid */}
      {filteredMemories.length === 0 ? (
        <Card variant="subtle" className="text-center py-12">
          <Bookmark className="w-8 h-8 text-[#9498a1] mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-[#f5f2eb]">No memories in this category</h4>
          <p className="text-xs text-[#9498a1] mt-1">Add a new memory or change the active tab filter.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((mem) => (
            <Card key={mem.id} variant="glass" className="flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <Badge
                    variant={
                      mem.status === 'KEEP' ? 'copper' : mem.status === 'ARCHIVE' ? 'neutral' : 'released'
                    }
                  >
                    {mem.status}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#9498a1]">{mem.date}</span>
                </div>

                <h4 className="text-base font-serif font-semibold text-[#f5f2eb] mt-3 group-hover:text-[#d48c5c] transition-colors">
                  {mem.title}
                </h4>
                
                <p className="text-xs text-[#9498a1] line-clamp-3 leading-relaxed mt-2 font-sans">
                  {mem.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between">
                <Badge variant="outline">{mem.emotion || 'Nostalgia'}</Badge>
                <button
                  onClick={() => setSelectedMemory(mem)}
                  className="text-xs text-[#d48c5c] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" /> Details
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Memory Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Store New Memory"
        subtitle="Catalog a significant moment or object"
      >
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input
            label="Memory Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The Apartment Keys, Rainy Bus Ride..."
            required
          />

          <Textarea
            label="Description & Emotional Meaning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Why does this memory resurface?"
            rows={4}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[#e6e1d5]/80 block mb-1.5">Primary Emotion</label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] p-2.5 rounded-lg"
              >
                <option value="Nostalgia">Nostalgia</option>
                <option value="Gratitude">Gratitude</option>
                <option value="Regret">Regret</option>
                <option value="Sadness">Sadness</option>
                <option value="Peace">Peace</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#e6e1d5]/80 block mb-1.5">Action Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] p-2.5 rounded-lg"
              >
                <option value="KEEP">Keep (Treasured)</option>
                <option value="ARCHIVE">Archive (Past Chapter)</option>
                <option value="RELEASE">Release (Ritual)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>Save Memory</Button>
          </div>
        </form>
      </Modal>

      {/* Memory Detail Modal & Status Switcher */}
      {selectedMemory && (
        <Modal
          isOpen={selectedMemory !== null}
          onClose={() => setSelectedMemory(null)}
          title={selectedMemory.title}
          subtitle={`Recorded on ${selectedMemory.date}`}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="copper">{selectedMemory.status}</Badge>
              <Badge variant="outline">{selectedMemory.emotion}</Badge>
            </div>

            <p className="text-sm font-serif text-[#f5f2eb] leading-relaxed p-4 bg-[#070809]/60 rounded-xl border border-white/[0.06]">
              {selectedMemory.description}
            </p>

            <div className="pt-4 border-t border-white/[0.06]">
              <span className="text-xs text-[#9498a1] block mb-2 font-mono">Change Status:</span>
              <div className="flex gap-2">
                <Button
                  variant={selectedMemory.status === 'KEEP' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => updateMemoryStatus(selectedMemory.id, 'KEEP')}
                >
                  Keep
                </Button>
                <Button
                  variant={selectedMemory.status === 'ARCHIVE' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => updateMemoryStatus(selectedMemory.id, 'ARCHIVE')}
                >
                  Archive
                </Button>
                <Button
                  variant={selectedMemory.status === 'RELEASE' ? 'danger' : 'secondary'}
                  size="sm"
                  onClick={() => updateMemoryStatus(selectedMemory.id, 'RELEASE')}
                >
                  Release Ritual
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
