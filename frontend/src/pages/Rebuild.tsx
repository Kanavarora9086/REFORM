import React, { useState, useEffect } from 'react'
import { Compass, Plus, CheckCircle2, Flame, Award, Trash2, RotateCcw, Target, Calendar } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'
import { Modal } from '../components/ui/Modal'

export interface GoalItem {
  id: number
  user_id: number
  title: string
  description?: string
  category: string
  progress: number
  target_duration?: string
  due_date?: string
  streak: number
  completed: boolean
  completed_at?: string
  created_at: string
}

const CATEGORIES = ['Body', 'Mind', 'Study/Work', 'Social', 'Hobbies', 'Routine', 'Self']

export default function Rebuild() {
  const [goals, setGoals] = useState<GoalItem[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [fetching, setFetching] = useState(true)

  // Form State
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Routine')
  const [targetDuration, setTargetDuration] = useState('30 days')
  const [nextAction, setNextAction] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  async function fetchGoals() {
    setFetching(true)
    try {
      const data = await apiRequest<GoalItem[]>('get', '/api/goals', null, 'reform_rebuild_goals')
      setGoals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch goals:', err)
      setGoals([])
    } finally {
      setFetching(false)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        target_duration: targetDuration.trim() || undefined,
        nextAction: nextAction.trim() || undefined,
        progress: 0,
        streak: 0,
      }
      const saved = await apiRequest<GoalItem>('post', '/api/goals', payload)
      if (saved) {
        setGoals((prev) => [saved, ...prev])
      } else {
        await fetchGoals()
      }
      setTitle('')
      setDescription('')
      setCategory('Routine')
      setTargetDuration('30 days')
      setNextAction('')
      setIsModalOpen(false)
    } catch (err) {
      console.error('Failed to create goal:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProgress = async (id: number, currentProgress: number, currentStreak: number) => {
    const nextProg = Math.min(100, currentProgress + 15)
    const nextStreak = nextProg === 100 ? currentStreak + 1 : currentStreak
    const isCompleted = nextProg === 100

    try {
      const updated = await apiRequest<GoalItem>('patch', `/api/goals/${id}`, {
        progress: nextProg,
        streak: nextStreak,
        completed: isCompleted,
      })
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
      }
    } catch (err) {
      console.error('Failed to update goal progress:', err)
    }
  }

  const handleCompleteGoal = async (id: number) => {
    try {
      const updated = await apiRequest<GoalItem>('patch', `/api/goals/${id}/complete`)
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
      }
    } catch (err) {
      console.error('Failed to complete goal:', err)
    }
  }

  const handleReopenGoal = async (id: number) => {
    try {
      const updated = await apiRequest<GoalItem>('patch', `/api/goals/${id}`, {
        completed: false,
        progress: 80,
      })
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)))
      }
    } catch (err) {
      console.error('Failed to reopen goal:', err)
    }
  }

  const handleDeleteGoal = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return
    try {
      await apiRequest('delete', `/api/goals/${id}`)
      setGoals((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      console.error('Failed to delete goal:', err)
    }
  }

  const filteredGoals = activeCategory === 'All'
    ? goals
    : goals.filter((g) => g.category?.toLowerCase() === activeCategory.toLowerCase())

  const activeGoals = filteredGoals.filter((g) => !g.completed)
  const completedGoals = filteredGoals.filter((g) => g.completed)

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Reconstruction & Growth
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            "Build something that is yours."
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Shift focus away from what you lost toward building your physical, mental, and social foundation.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
          New Goal
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveCategory('All')}
          className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap ${
            activeCategory === 'All'
              ? 'bg-[#1e222b] text-[#d48c5c] border-[#d48c5c]/40 font-semibold'
              : 'bg-[#070809]/40 text-[#9498a1] border-white/[0.06] hover:text-[#f5f2eb]'
          }`}
        >
          All Categories ({goals.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = goals.filter((g) => g.category?.toLowerCase() === cat.toLowerCase()).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-[#1e222b] text-[#d48c5c] border-[#d48c5c]/40 font-semibold'
                  : 'bg-[#070809]/40 text-[#9498a1] border-white/[0.06] hover:text-[#f5f2eb]'
              }`}
            >
              {cat} {count > 0 && `(${count})`}
            </button>
          )
        })}
      </div>

      {/* Total Zero State */}
      {goals.length === 0 && !fetching ? (
        <Card variant="subtle" className="text-center py-16 px-6 max-w-xl mx-auto flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-serif font-bold text-[#f5f2eb]">
            "Your rebuild starts with one decision."
          </h3>
          <p className="text-sm text-[#9498a1] leading-relaxed">
            Create your first goal to begin tracking your progress and reclaiming your focus.
          </p>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
            Create a Goal
          </Button>
        </Card>
      ) : (
        <>
          {/* Active Goals Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-serif font-semibold text-[#f5f2eb] flex items-center gap-2">
                Active Rebuild Goals
                <span className="text-xs font-mono font-normal text-[#9498a1]">({activeGoals.length})</span>
              </h2>
            </div>

            {activeGoals.length === 0 ? (
              <Card variant="subtle" className="text-center py-10">
                <p className="text-sm text-[#9498a1]">
                  {goals.length > 0
                    ? 'No active goals in this category. All caught up or filter active!'
                    : 'No active goals right now.'}
                </p>
                <Button variant="copper-outline" size="sm" className="mt-3" onClick={() => setIsModalOpen(true)}>
                  + Add Active Goal
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeGoals.map((g) => (
                  <Card key={g.id} variant="glass" className="flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2">
                          <Badge variant="copper">{g.category || 'Routine'}</Badge>
                          {g.target_duration && (
                            <span className="text-[11px] font-mono text-[#9498a1] flex items-center gap-1">
                              <Target className="w-3 h-3 text-[#d48c5c]" /> {g.target_duration}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {g.streak > 0 && (
                            <span className="text-xs font-mono text-[#d48c5c] flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5" /> {g.streak}d Streak
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteGoal(g.id)}
                            className="text-[#9498a1] hover:text-red-400 transition-colors p-1"
                            title="Delete goal"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-lg font-serif font-semibold text-[#f5f2eb] mt-3">{g.title}</h4>
                      {g.description && (
                        <p className="text-xs text-[#9498a1] mt-1 font-sans leading-relaxed">{g.description}</p>
                      )}

                      <div className="mt-4">
                        <ProgressBar value={g.progress} label="Progress" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                      <Button
                        variant="copper-outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(g.id, g.progress, g.streak)}
                        icon={<Plus className="w-3.5 h-3.5" />}
                      >
                        + Log Progress
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleCompleteGoal(g.id)}
                        icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Mark as Complete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Completed Milestones Section */}
          {completedGoals.length > 0 && (
            <div className="flex flex-col gap-4 mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-semibold text-[#f5f2eb] flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#d48c5c]" />
                  Completed Rebuild Milestones
                  <span className="text-xs font-mono font-normal text-emerald-400">({completedGoals.length})</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((g) => (
                  <Card key={g.id} variant="glass" className="p-5 flex flex-col justify-between gap-3 border-emerald-500/20 bg-emerald-950/10">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant="neutral">{g.category || 'Routine'}</Badge>
                          <span className="text-[11px] text-emerald-400 font-mono font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Achieved
                          </span>
                        </div>
                        <h4 className="text-base font-serif font-semibold text-[#f5f2eb] line-through text-[#f5f2eb]/80">
                          {g.title}
                        </h4>
                        {g.completed_at && (
                          <span className="text-[10px] font-mono text-[#9498a1] flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3 text-[#d48c5c]" />
                            Completed on {new Date(g.completed_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReopenGoal(g.id)}
                          className="text-[#9498a1] hover:text-[#f5f2eb] transition-colors p-1.5 text-xs font-mono flex items-center gap-1 rounded-lg border border-white/[0.08]"
                          title="Reopen goal"
                        >
                          <RotateCcw className="w-3 h-3" /> Reopen
                        </button>
                        <button
                          onClick={() => handleDeleteGoal(g.id)}
                          className="text-[#9498a1] hover:text-red-400 transition-colors p-1.5"
                          title="Delete goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Establish New Rebuild Goal"
        subtitle="Small consistent actions rebuild momentum."
      >
        <form onSubmit={handleAddGoal} className="flex flex-col gap-4">
          <Input
            label="Goal Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Go 30 days without checking their profile"
            required
          />

          <div>
            <label className="text-xs font-medium text-[#e6e1d5]/80 block mb-1.5">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Why this goal matters for your healing and rebuild..."
              className="w-full bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] p-3 rounded-lg focus:outline-none focus:border-[#d48c5c]/60 min-h-[70px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#e6e1d5]/80 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] p-2.5 rounded-lg focus:outline-none focus:border-[#d48c5c]/60"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Input
              label="Target Duration"
              value={targetDuration}
              onChange={(e) => setTargetDuration(e.target.value)}
              placeholder="e.g. 30 days, 2 weeks"
            />
          </div>

          <Input
            label="Immediate Next Action (Optional)"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            placeholder="e.g. Remove app icon from home screen"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" loading={loading}>Save Goal</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
