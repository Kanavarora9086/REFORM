import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Award, ShieldCheck, Zap, Compass, Plus, HeartPulse, CheckCircle2, Calendar, Target, Loader2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { ProgressBar } from '../components/ui/ProgressBar'
import { apiRequest } from '../services/api'

interface TrendPoint {
  t: string
  day: string
  date?: string
  intensity: number
  overthinking: number
  contact_urge: number
  urge: number
  energy?: number
  loneliness?: number
  emotion?: string
}

interface Milestone {
  id: number
  title: string
  category?: string
  description?: string
  target_duration?: string
  streak?: number
  progress?: number
  completed_at?: string
  created_at?: string
}

interface ProgressData {
  has_goals: boolean
  has_pulses: boolean
  has_journals: boolean
  total_goals: number
  active_goals_count: number
  completed_goals_count: number
  completion_percentage: number
  current_streak: number
  completed_milestones: Milestone[]
  active_goals: Milestone[]
  pulse_count: number
  journal_count: number
  avg_intensity: number | null
  avg_overthinking: number | null
  avg_urge: number | null
  first_pulse: {
    emotion: string
    intensity: number
    contact_urge: number
    date: string | null
  } | null
  latest_pulse: {
    emotion: string
    intensity: number
    contact_urge: number
    date: string | null
  } | null
}

export default function Progress() {
  const [range, setRange] = useState<'7D' | '30D' | '90D'>('30D')
  const [progressData, setProgressData] = useState<ProgressData | null>(null)
  const [rawTrends, setRawTrends] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadAllProgress() {
      setLoading(true)
      try {
        const [overview, trendsData] = await Promise.all([
          apiRequest<ProgressData>('get', '/api/progress'),
          apiRequest<TrendPoint[]>('get', '/api/progress/trends'),
        ])
        if (overview) setProgressData(overview)
        if (Array.isArray(trendsData)) setRawTrends(trendsData)
      } catch (err) {
        console.warn('Could not load progress data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadAllProgress()
  }, [])

  // Loading state — avoid blank flash
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] gap-4">
        <Loader2 className="w-8 h-8 text-[#d48c5c] animate-spin" />
        <p className="text-xs text-[#9498a1] font-mono uppercase tracking-wider">Loading your progress...</p>
      </div>
    )
  }

  const hasGoals = Boolean(progressData && progressData.total_goals > 0)
  // Only check the API flag — rawTrends may be empty if user just logged first pulse
  const hasPulses = Boolean(progressData?.has_pulses)

  // Slice trends based on selected range (newest N, data is oldest→newest)
  const chartData = (() => {
    if (!hasPulses || rawTrends.length === 0) return []
    const count = range === '7D' ? 7 : range === '30D' ? 30 : 90
    return rawTrends.slice(-count).map((item, idx) => ({
      day: item.date || item.day || `D${idx + 1}`,
      intensity: item.intensity,
      overthinking: item.overthinking,
      urge: item.contact_urge ?? item.urge,
    }))
  })()

  // Completely empty state if no goals have been established yet
  if (!loading && !hasGoals && !hasPulses) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[65vh] max-w-xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center mb-6">
          <Compass className="w-8 h-8" />
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
          Rebuild Progress & Milestones
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-2 mb-3">
          "Your rebuild starts with one decision."
        </h1>
        <p className="text-sm text-[#9498a1] leading-relaxed max-w-md mb-8 font-sans">
          Create your first goal to begin tracking your progress. Every milestone you conquer builds momentum.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/app/rebuild">
            <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
              Create a Goal
            </Button>
          </Link>
          <Link to="/app/pulse">
            <Button variant="secondary" icon={<HeartPulse className="w-4 h-4" />}>
              Log Emotional Pulse
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const activeGoalsCount = progressData?.active_goals_count ?? 0
  const completedGoalsCount = progressData?.completed_goals_count ?? 0
  const completionPercentage = progressData?.completion_percentage ?? 0
  const currentStreak = progressData?.current_streak ?? 0
  const pulseCount = progressData?.pulse_count ?? 0
  const journalCount = progressData?.journal_count ?? 0

  return (
    <div className="flex flex-col gap-8 py-2 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Real Activity Analytics
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Progress & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Quantify actual completed goals, rebuild streaks, and real emotional changes over time.
          </p>
        </div>

        <Link to="/app/rebuild">
          <Button variant="primary" size="sm" icon={<Plus className="w-4 h-4" />}>
            New Rebuild Goal
          </Button>
        </Link>
      </div>

      {/* Metrics Row (Strictly Real User Activity) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="glass" padding="sm" className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#9498a1]">Active Goals</span>
          <span className="text-2xl font-serif font-bold text-[#f5f2eb]">{activeGoalsCount}</span>
          <span className="text-[11px] text-[#9498a1]">Currently in progress</span>
        </Card>

        <Card variant="glass" padding="sm" className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#9498a1]">Completed Milestones</span>
          <span className="text-2xl font-serif font-bold text-emerald-400">{completedGoalsCount}</span>
          <span className="text-[11px] text-emerald-400 font-medium">Rebuilt & verified</span>
        </Card>

        <Card variant="glass" padding="sm" className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#9498a1]">Completion Rate</span>
          <span className="text-2xl font-serif font-bold text-[#d48c5c]">{completionPercentage}%</span>
          <span className="text-[11px] text-[#9498a1]">Of total established goals</span>
        </Card>

        <Card variant="glass" padding="sm" className="flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-[#9498a1]">Best Streak</span>
          <span className="text-2xl font-serif font-bold text-[#f5f2eb]">
            {currentStreak > 0 ? `${currentStreak}×` : '—'}
          </span>
          <span className="text-[11px] text-[#9498a1]">
            {currentStreak > 0 ? 'Highest goal streak logged' : 'Log progress to start streak'}
          </span>
        </Card>
      </div>

      {/* Activity counts sub-row */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="subtle" padding="sm" className="flex items-center gap-3">
          <HeartPulse className="w-5 h-5 text-[#d48c5c] shrink-0" />
          <div>
            <span className="text-xs font-semibold text-[#f5f2eb]">{pulseCount} Pulse Check-ins</span>
            <p className="text-[11px] text-[#9498a1] mt-0.5">{pulseCount === 0 ? 'None logged yet' : 'Total emotional logs'}</p>
          </div>
        </Card>
        <Card variant="subtle" padding="sm" className="flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="text-xs font-semibold text-[#f5f2eb]">{journalCount} Journal Entries</span>
            <p className="text-[11px] text-[#9498a1] mt-0.5">{journalCount === 0 ? 'None logged yet' : 'Total reflection logs'}</p>
          </div>
        </Card>
      </div>

      {/* Rebuild Milestones Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Milestones List */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-base font-serif font-semibold text-[#f5f2eb] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#d48c5c]" />
              Completed Rebuild Milestones
            </h3>
            <Badge variant="neutral">{completedGoalsCount}</Badge>
          </div>

          {progressData?.completed_milestones && progressData.completed_milestones.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {progressData.completed_milestones.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start justify-between p-3.5 bg-emerald-950/20 rounded-xl border border-emerald-500/20"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#f5f2eb]">{m.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="copper">{m.category || 'Routine'}</Badge>
                        {m.target_duration && (
                          <span className="text-[10px] font-mono text-[#9498a1]">Target: {m.target_duration}</span>
                        )}
                      </div>
                      {m.completed_at && (
                        <p className="text-[10px] font-mono text-emerald-400/80 mt-1.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Achieved on {new Date(m.completed_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-[#9498a1]/50" />
              <p className="text-xs text-[#9498a1]">No completed milestones yet.</p>
              <p className="text-[11px] text-[#9498a1]/70 max-w-xs">
                Mark active goals as completed in Rebuild Goals to celebrate your achievements here.
              </p>
              <Link to="/app/rebuild" className="mt-2 text-xs text-[#d48c5c] hover:underline">
                View active goals →
              </Link>
            </div>
          )}
        </Card>

        {/* Active Goals Overview */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <h3 className="text-base font-serif font-semibold text-[#f5f2eb] flex items-center gap-2">
              <Target className="w-4 h-4 text-[#d48c5c]" />
              Active Goals in Flight
            </h3>
            <Badge variant="copper">{activeGoalsCount}</Badge>
          </div>

          {progressData?.active_goals && progressData.active_goals.length > 0 ? (
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-1">
              {progressData.active_goals.map((g) => (
                <div
                  key={g.id}
                  className="p-3.5 bg-white/[0.02] rounded-xl border border-white/[0.06] flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f5f2eb]">{g.title}</span>
                    <Badge variant="neutral">{g.category || 'Routine'}</Badge>
                  </div>
                  <ProgressBar value={g.progress || 0} label="Progress" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center flex flex-col items-center gap-2">
              <Compass className="w-8 h-8 text-[#9498a1]/50" />
              <p className="text-xs text-[#9498a1]">No active goals right now.</p>
              <Link to="/app/rebuild" className="mt-2">
                <Button variant="copper-outline" size="sm">
                  + Create New Goal
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Emotional Trajectory Chart (Strictly Real Pulse Data) */}
      <Card variant="glass" className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">
              Emotional Trajectory
            </h3>
            <p className="text-xs text-[#9498a1] mt-0.5">
              {hasPulses && rawTrends.length > 0
                ? `From ${rawTrends.length} real pulse check-in${rawTrends.length !== 1 ? 's' : ''}.`
                : 'Log pulse check-ins to see your trajectory.'}
            </p>
          </div>

          {hasPulses && rawTrends.length > 0 ? (
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1 text-[#d48c5c]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d48c5c]" /> Intensity
                </span>
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-300" /> Overthinking
                </span>
              </div>
              <div className="flex bg-[#070809] border border-white/[0.08] p-1 rounded-xl">
                {(['7D', '30D', '90D'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
                      range === r
                        ? 'bg-[#1e222b] text-[#d48c5c] font-bold border border-white/[0.08]'
                        : 'text-[#9498a1] hover:text-[#f5f2eb]'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <Link to="/app/pulse">
              <Button variant="copper-outline" size="sm" icon={<HeartPulse className="w-3.5 h-3.5" />}>
                Record First Pulse
              </Button>
            </Link>
          )}
        </div>

        {hasPulses && chartData.length > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" stroke="#9498a1" fontSize={11} />
                <YAxis stroke="#9498a1" fontSize={11} domain={[0, 10]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111317',
                    borderColor: 'rgba(212,140,92,0.3)',
                    borderRadius: '12px',
                    color: '#f5f2eb',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#d48c5c"
                  strokeWidth={3}
                  dot={{ fill: '#d48c5c', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="overthinking"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12 text-center flex flex-col items-center gap-3">
            <HeartPulse className="w-10 h-10 text-[#d48c5c]/40" />
            <h4 className="text-sm font-semibold text-[#f5f2eb]">No emotional trajectory data yet</h4>
            <p className="text-xs text-[#9498a1] max-w-sm">
              Log daily check-ins in the Pulse tab to visualize your emotional intensity, overthinking reduction, and urge patterns.
            </p>
            <Link to="/app/pulse" className="mt-2">
              <Button variant="primary" size="sm">
                Log a Pulse Check-in
              </Button>
            </Link>
          </div>
        )}
      </Card>

      {/* Then vs Now — only shown when there are 2+ different pulse logs */}
      {hasPulses && progressData?.first_pulse && progressData?.latest_pulse &&
        progressData.first_pulse.date !== progressData.latest_pulse.date && (
        <Card variant="glass" className="flex flex-col gap-4">
          <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">
            Then vs Now Comparison (Actual Check-in History)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#070809]/60 rounded-xl border border-white/[0.06]">
              <span className="text-xs font-mono text-red-400 block mb-1">
                First Check-in {progressData.first_pulse.date && `(${new Date(progressData.first_pulse.date).toLocaleDateString()})`}
              </span>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Dominant Emotion:</span>
                  <span className="text-[#f5f2eb] font-medium capitalize">{progressData.first_pulse.emotion}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Intensity Score:</span>
                  <span className="text-red-400 font-mono font-bold">{progressData.first_pulse.intensity} / 10</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Contact Urge:</span>
                  <span className="text-amber-400 font-mono font-bold">{progressData.first_pulse.contact_urge} / 10</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#d48c5c]/10 rounded-xl border border-[#d48c5c]/30">
              <span className="text-xs font-mono text-[#d48c5c] block mb-1">
                Latest Check-in {progressData.latest_pulse.date && `(${new Date(progressData.latest_pulse.date).toLocaleDateString()})`}
              </span>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Dominant Emotion:</span>
                  <span className="text-[#f5f2eb] font-medium capitalize">{progressData.latest_pulse.emotion}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Intensity Score:</span>
                  <span className="text-emerald-400 font-mono font-bold">{progressData.latest_pulse.intensity} / 10</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#9498a1]">Contact Urge:</span>
                  <span className="text-emerald-400 font-mono font-bold">{progressData.latest_pulse.contact_urge} / 10</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Avg Pulse Readings — only if user has logged pulses */}
      {hasPulses && progressData?.avg_intensity !== null && (
        <Card variant="glass" className="flex flex-col gap-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#9498a1] flex items-center gap-2">
            <Zap className="w-4 h-4" /> Average Emotional Readings
            <span className="ml-auto text-[10px] normal-case">Across all {pulseCount} logs</span>
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <span className="text-xl font-serif font-bold text-[#d48c5c]">
                {progressData.avg_intensity?.toFixed(1) ?? '—'}
              </span>
              <p className="text-[11px] text-[#9498a1] mt-0.5">Avg Intensity</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-serif font-bold text-amber-400">
                {progressData.avg_overthinking?.toFixed(1) ?? '—'}
              </span>
              <p className="text-[11px] text-[#9498a1] mt-0.5">Avg Overthinking</p>
            </div>
            <div className="text-center">
              <span className="text-xl font-serif font-bold text-[#f5f2eb]">
                {progressData.avg_urge?.toFixed(1) ?? '—'}
              </span>
              <p className="text-[11px] text-[#9498a1] mt-0.5">Avg Contact Urge</p>
            </div>
          </div>
        </Card>
      )}
      {/* Print-only footer — rendered on every page when printing */}
      <div className="print-footer" aria-hidden="true">
        Designed and Developed by Kanav Arora
      </div>
    </div>
  )
}
