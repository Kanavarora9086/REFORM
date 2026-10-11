import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Activity, Feather, Sparkles, Timer, ArrowUpRight, TrendingUp, Calendar, ShieldCheck, HeartPulse, Plus, CheckCircle2, Compass } from 'lucide-react'
import { useAuth } from '../services/auth'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { ProgressBar } from '../components/ui/ProgressBar'

export default function Home() {
  const { user } = useAuth()
  const [pulses, setPulses] = useState<any[]>([])
  const [journals, setJournals] = useState<any[]>([])
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        const [pData, jData, gData] = await Promise.all([
          apiRequest<any[]>('get', '/api/pulse/history', null, 'reform_pulse_history'),
          apiRequest<any[]>('get', '/api/journal', null, 'reform_unload_entries'),
          apiRequest<any[]>('get', '/api/goals', null, 'reform_rebuild_goals'),
        ])
        setPulses(Array.isArray(pData) ? pData : [])
        setJournals(Array.isArray(jData) ? jData : [])
        setGoals(Array.isArray(gData) ? gData : [])
      } catch (err) {
        console.warn('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    loadDashboardData()
  }, [])

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const latestPulse = pulses.length > 0 ? pulses[0] : null
  const oldestPulse = pulses.length > 0 ? pulses[pulses.length - 1] : null
  const latestJournal = journals.length > 0 ? journals[0] : null

  const activeGoals = goals.filter((g) => !g.completed)
  const topGoal = activeGoals.length > 0 ? activeGoals[0] : (goals.length > 0 ? goals[0] : null)

  return (
    <div className="flex flex-col gap-8 py-2">
      {/* Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Private Sanity Space
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            {getTimeGreeting()}, {user?.name || user?.email?.split('@')[0] || 'Traveler'}.
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans max-w-xl leading-relaxed">
            A quiet sanctuary to observe your inner dialogue, put down what's heavy, and step forward intentionally.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/app/pulse">
            <Button variant="primary" size="sm" icon={<Activity className="w-4 h-4" />}>
              Quick Check-in
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero "How are you, really?" Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#16191f] via-[#111317] to-[#1e222b] border border-[#d48c5c]/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d48c5c]/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-xl">
            <Badge variant="copper">DAILY REFLECTION</Badge>
            <h2 className="text-xl sm:text-3xl font-serif font-semibold text-[#f5f2eb] mt-3 leading-tight">
              "How are you, really?"
            </h2>
            <p className="text-xs sm:text-sm text-[#9498a1] mt-2 leading-relaxed">
              Don't default to 'fine'. Take 30 seconds to log your emotional intensity, secondary feelings, and underlying triggers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link to="/app/pulse">
              <Button variant="primary" icon={<HeartPulse className="w-4 h-4" />}>
                Record Pulse
              </Button>
            </Link>
            <Link to="/app/unload">
              <Button variant="secondary" icon={<Feather className="w-4 h-4" />}>
                Unload Journal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Emotional State */}
        <Card variant="glass" className="flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">Today's State</span>
            {latestPulse ? (
              <Badge variant="copper">{latestPulse.emotion}</Badge>
            ) : (
              <Badge variant="neutral">Not Logged</Badge>
            )}
          </div>

          <div className="py-6 flex flex-col items-center text-center">
            {latestPulse ? (
              <>
                <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#070809] border-2 border-[#d48c5c]/40 my-2">
                  <span className="text-3xl font-mono font-bold text-[#f5f2eb]">{latestPulse.intensity}</span>
                  <span className="text-[10px] text-[#9498a1] absolute bottom-3">/ 10</span>
                </div>
                <p className="text-xs text-[#9498a1] mt-2">
                  Intensity score recorded in recent check-in.
                </p>
              </>
            ) : (
              <div className="py-4 flex flex-col items-center gap-2">
                <HeartPulse className="w-10 h-10 text-[#d48c5c]/50 mb-1" />
                <p className="text-xs text-[#9498a1]">No check-in recorded yet today.</p>
                <Link to="/app/pulse" className="mt-2">
                  <Button variant="copper-outline" size="sm">
                    Record Pulse Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-[#9498a1]">Total Recorded:</span>
            <span className="text-[#f5f2eb] font-mono">
              {pulses.length} {pulses.length === 1 ? 'Check-in' : 'Check-ins'}
            </span>
          </div>
        </Card>

        {/* Latest Reflection / Journal Continuation */}
        <Card variant="glass" className="lg:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">Latest Entry</span>
            <Link to="/app/unload" className="text-xs text-[#d48c5c] hover:underline flex items-center gap-1">
              View History <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="py-4">
            {latestJournal ? (
              <div className="flex flex-col gap-2">
                <span className="text-[11px] text-[#d48c5c] font-mono">
                  {new Date(latestJournal.created_at || Date.now()).toLocaleDateString()}
                </span>
                <p className="font-serif text-base text-[#f5f2eb]/90 italic leading-relaxed line-clamp-3">
                  "{latestJournal.text}"
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="neutral">{latestJournal.mood || 'Reflective'}</Badge>
                  <Badge variant="outline">{latestJournal.trigger || 'Self'}</Badge>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <p className="text-xs text-[#9498a1]">No journal entries logged yet. Write your first thought in Unload.</p>
                <Link to="/app/unload" className="mt-3 inline-block">
                  <Button variant="copper-outline" size="sm">
                    Open Journal
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <Link to="/app/reflect" className="text-xs text-[#9498a1] hover:text-[#f5f2eb] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d48c5c]" /> Ask AI to analyze this entry
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">Core Practices</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link to="/app/pulse" className="group">
            <Card variant="glass" className="h-full transition-all group-hover:border-[#d48c5c]/40 group-hover:translate-y-[-2px]">
              <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#f5f2eb]">Pulse</h4>
              <p className="text-[11px] text-[#9498a1] mt-1">Multi-step emotional check-in.</p>
            </Card>
          </Link>

          <Link to="/app/unload" className="group">
            <Card variant="glass" className="h-full transition-all group-hover:border-[#d48c5c]/40 group-hover:translate-y-[-2px]">
              <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#f5f2eb]">Unload</h4>
              <p className="text-[11px] text-[#9498a1] mt-1">Distraction-free journal space.</p>
            </Card>
          </Link>

          <Link to="/app/reflect" className="group">
            <Card variant="glass" className="h-full transition-all group-hover:border-[#d48c5c]/40 group-hover:translate-y-[-2px]">
              <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#f5f2eb]">Reflect</h4>
              <p className="text-[11px] text-[#9498a1] mt-1">Editorial AI guidance space.</p>
            </Card>
          </Link>

          <Link to="/app/pause" className="group">
            <Card variant="glass" className="h-full transition-all group-hover:border-[#d48c5c]/40 group-hover:translate-y-[-2px]">
              <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-[#f5f2eb]">Pause</h4>
              <p className="text-[11px] text-[#9498a1] mt-1">Impulse resistance countdown.</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Rebuild Goal Progress + Then vs Now + Future You */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rebuild Goal Card */}
        <Card variant="glass" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">
                {topGoal?.completed ? 'Rebuild Milestone' : 'Active Rebuild Goal'}
              </span>
              {topGoal && <Badge variant="copper">{topGoal.category || 'Routine'}</Badge>}
            </div>

            {topGoal ? (
              <div className="mt-3">
                <h4 className="text-base font-serif font-semibold text-[#f5f2eb]">{topGoal.title}</h4>
                <div className="mt-4">
                  <ProgressBar
                    value={topGoal.progress || (topGoal.completed ? 100 : 0)}
                    label={topGoal.completed ? 'Goal Achieved' : 'Completion progress'}
                  />
                </div>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center text-center gap-2">
                <Compass className="w-8 h-8 text-[#9498a1]/50 mb-1" />
                <p className="text-xs text-[#9498a1]">No rebuild goals set yet.</p>
                <Link to="/app/rebuild" className="mt-2">
                  <Button variant="copper-outline" size="sm" icon={<Plus className="w-3.5 h-3.5" />}>
                    Establish First Goal
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <Link to="/app/rebuild" className="mt-4 text-xs text-[#d48c5c] hover:underline flex items-center gap-1">
            Manage all goals →
          </Link>
        </Card>

        {/* Then vs Now Card (Real Check-ins) */}
        <Card variant="glass" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">Then vs Now</span>
              <Badge variant="neutral">{pulses.length} Entries</Badge>
            </div>

            {latestPulse && oldestPulse && pulses.length >= 2 ? (
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="p-3 bg-[#070809]/40 rounded-lg border border-white/[0.04]">
                  <span className="text-[10px] text-[#9498a1] uppercase block">First Pulse</span>
                  <span className="text-xs text-[#e6e1d5] font-medium block mt-1">
                    Intensity: {oldestPulse.intensity}/10
                  </span>
                </div>
                <div className="p-3 bg-[#d48c5c]/10 rounded-lg border border-[#d48c5c]/30">
                  <span className="text-[10px] text-[#d48c5c] uppercase block">Latest Pulse</span>
                  <span className="text-xs text-[#f5f2eb] font-medium block mt-1">
                    Intensity: {latestPulse.intensity}/10
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center flex flex-col items-center gap-1">
                <p className="text-xs text-[#9498a1]">
                  {pulses.length === 1
                    ? '1 check-in recorded. Log more to see trends.'
                    : 'Track your urge resistance over time.'}
                </p>
                <Link to="/app/pulse" className="mt-3">
                  <Button variant="copper-outline" size="sm">
                    {pulses.length === 0 ? 'Log First Pulse' : 'Log Daily Pulse'}
                  </Button>
                </Link>
              </div>
            )}
          </div>
          <Link to="/app/progress" className="mt-4 text-xs text-[#9498a1] hover:text-[#f5f2eb]">
            See full progress timeline →
          </Link>
        </Card>

        {/* Future Capsule Card */}
        <Card variant="glass" className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <span className="text-xs font-mono uppercase tracking-wider text-[#9498a1]">Future Capsule</span>
              <Badge variant="copper">Private</Badge>
            </div>
            <p className="text-xs text-[#e6e1d5] font-serif italic mt-3 leading-relaxed">
              "Send a letter forward in time. Speak directly to the person you are becoming."
            </p>
          </div>
          <Link to="/app/future-you" className="mt-4 text-xs text-[#d48c5c] hover:underline flex items-center gap-1">
            Write time capsule →
          </Link>
        </Card>
      </div>
    </div>
  )
}
