import React, { useState, useEffect } from 'react'
import { Activity, Sparkles, CheckCircle, ArrowRight, RotateCcw, Clock } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Slider } from '../components/ui/Slider'
import { Badge } from '../components/ui/Badge'
import { EmotionSelector, PRIMARY_EMOTIONS } from '../components/ui/EmotionSelector'
import { AIMessage } from '../components/ui/AIMessage'

const SECONDARY_OPTIONS = ['Empty', 'Anxious', 'Regretful', 'Quiet', 'Determined', 'Yearning', 'Exhausted', 'Grounded']
const TRIGGER_OPTIONS = ['Relationship / Breakup', 'Self-Doubt', 'Past Memory', 'Work / Study Stress', 'Unspoken Words', 'Unknown / Sudden']

export default function Pulse() {
  const [step, setStep] = useState<number>(1)
  const [emotion, setEmotion] = useState<string>('sadness')
  const [intensity, setIntensity] = useState<number>(5)
  const [secondary, setSecondary] = useState<string[]>([])
  const [trigger, setTrigger] = useState<string>('Relationship / Breakup')
  
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    fetchHistory()
  }, [])

  async function fetchHistory() {
    const data = await apiRequest<any[]>('get', '/api/pulse/history', null, 'reform_pulse_history')
    setHistory(data || [])
  }

  const toggleSecondary = (item: string) => {
    if (secondary.includes(item)) {
      setSecondary(secondary.filter((s) => s !== item))
    } else {
      if (secondary.length < 3) {
        setSecondary([...secondary, item])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { emotion, intensity, secondary, trigger }
      const res = await apiRequest<any>('post', '/api/pulse', payload, 'reform_pulse_history')
      
      // Request AI reflection insight
      const aiRes = await apiRequest<any>('post', '/api/ai/reflect', {
        prompt: `The user logged a Pulse check-in. Primary Emotion: ${emotion}, Intensity: ${intensity}/10, Secondary feelings: ${secondary.join(', ')}, Trigger: ${trigger}. Offer a calm, editorial insight.`
      })
      
      setResult({
        checkin: payload,
        aiInsight: aiRes?.reply || "Notice how naming this emotion creates distance between you and the intensity. This check-in is an anchor."
      })
      
      fetchHistory()
      setStep(5) // Result step
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setEmotion('sadness')
    setIntensity(5)
    setSecondary([])
    setResult(null)
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Step {step <= 4 ? step : 5} of 5
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Pulse Check-in
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Tune into your internal compass without judgement.
          </p>
        </div>

        {step <= 4 && (
          <div className="flex items-center gap-1 bg-[#070809]/80 p-1.5 rounded-xl border border-white/[0.08]">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-8 h-2 rounded-full transition-all ${
                  step === s ? 'bg-[#d48c5c]' : step > s ? 'bg-[#d48c5c]/40' : 'bg-white/[0.08]'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Step Container */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card variant="glass" className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#f5f2eb]">What is your dominant emotion right now?</h3>
                <p className="text-xs text-[#9498a1] mt-1">Select the state that feels closest to your immediate experience.</p>
              </div>

              <EmotionSelector selected={emotion} onSelect={(emo) => setEmotion(emo)} />

              <div className="flex justify-end pt-4 border-t border-white/[0.06]">
                <Button variant="primary" onClick={() => setStep(2)} icon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Intensity
                </Button>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card variant="glass" className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#f5f2eb]">How intense is this emotion?</h3>
                <p className="text-xs text-[#9498a1] mt-1">0 is a whisper, 10 is overwhelming energy.</p>
              </div>

              <div className="py-8 px-4 bg-[#070809]/40 border border-white/[0.06] rounded-2xl">
                <Slider
                  value={intensity}
                  onChange={(val) => setIntensity(val)}
                  min={0}
                  max={10}
                  label="Emotional Intensity"
                  leftLabel="0 - Mild background tone"
                  rightLabel="10 - All-consuming"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(3)} icon={<ArrowRight className="w-4 h-4" />}>
                  Continue to Secondary Feelings
                </Button>
              </div>
            </Card>
          )}

          {step === 3 && (
            <Card variant="glass" className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#f5f2eb]">Any secondary feelings underneath?</h3>
                <p className="text-xs text-[#9498a1] mt-1">Select up to 3 subtle nuances beneath the main emotion.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SECONDARY_OPTIONS.map((item) => {
                  const isSelected = secondary.includes(item)
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleSecondary(item)}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#d48c5c]/20 border-[#d48c5c] text-[#d48c5c]'
                          : 'bg-[#070809]/40 border-white/[0.06] text-[#e6e1d5] hover:bg-white/[0.04]'
                      }`}
                    >
                      {item}
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                <Button variant="primary" onClick={() => setStep(4)} icon={<ArrowRight className="w-4 h-4" />}>
                  Identify Trigger
                </Button>
              </div>
            </Card>
          )}

          {step === 4 && (
            <Card variant="glass" className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h3 className="text-xl font-serif font-semibold text-[#f5f2eb]">What triggered this pulse?</h3>
                <p className="text-xs text-[#9498a1] mt-1">Grounding the root cause helps dissolve emotional fog.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TRIGGER_OPTIONS.map((trig) => {
                  const isSelected = trigger === trig
                  return (
                    <button
                      key={trig}
                      type="button"
                      onClick={() => setTrigger(trig)}
                      className={`p-4 rounded-xl border text-xs font-medium text-left transition-all ${
                        isSelected
                          ? 'bg-[#d48c5c]/20 border-[#d48c5c] text-[#d48c5c]'
                          : 'bg-[#070809]/40 border-white/[0.06] text-[#e6e1d5] hover:bg-white/[0.04]'
                      }`}
                    >
                      {trig}
                    </button>
                  )
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-white/[0.06]">
                <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  icon={<CheckCircle className="w-4 h-4" />}
                >
                  Record & Analyze Pulse
                </Button>
              </div>
            </Card>
          )}

          {step === 5 && result && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <Card variant="glow" className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-[#d48c5c] text-xs font-mono uppercase tracking-widest">
                  <CheckCircle className="w-4 h-4" /> Pulse Logged Successfully
                </div>
                
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Badge variant="copper">{result.checkin.emotion}</Badge>
                  <Badge variant="neutral">Intensity: {result.checkin.intensity}/10</Badge>
                  {result.checkin.secondary?.map((sec: string) => (
                    <Badge key={sec} variant="outline">{sec}</Badge>
                  ))}
                  <Badge variant="neutral">{result.checkin.trigger}</Badge>
                </div>
              </Card>

              {/* AI Perspective Card */}
              <AIMessage content={result.aiInsight} title="RE:FORM Clarity AI" />

              <div className="flex justify-between items-center pt-2">
                <Button variant="secondary" onClick={resetForm} icon={<RotateCcw className="w-4 h-4" />}>
                  Log Another Check-in
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#9498a1] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Pulses
          </h3>
          {history.length === 0 ? (
            <Card variant="subtle" className="text-center py-8">
              <p className="text-xs text-[#9498a1]">No check-ins recorded yet.</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
              {history.map((h) => (
                <Card key={h.id} variant="glass" padding="sm" className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#f5f2eb] capitalize">{h.emotion}</span>
                    <span className="text-[10px] font-mono text-[#d48c5c]">{h.intensity}/10</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#9498a1]">
                    <span>{h.trigger || 'General'}</span>
                    <span>{new Date(h.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
