import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldAlert, Feather, Activity, RotateCcw, HeartHandshake } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CountdownTimer } from '../components/ui/CountdownTimer'
import { Badge } from '../components/ui/Badge'

const URGE_OPTIONS = [
  { id: 'reply', label: 'I hope they will reply or notice', reflection: 'A reply rarely brings the exact closure you want. It often re-opens the wound.' },
  { id: 'them_back', label: 'I want them back in my life', reflection: 'Missing someone is proof you loved deeply, not proof that returning is safe or wise.' },
  { id: 'closure', label: 'I demand final closure', reflection: 'True closure is an internal decision you make, not a gift someone else grants you.' },
  { id: 'loneliness', label: 'I feel lonely and vulnerable right now', reflection: 'Loneliness is temporary. Reaching out out of loneliness trades long-term peace for short-term relief.' },
  { id: 'habit', label: 'It is a reflexive habit', reflection: 'Habits fade when you interrupt the loop for just 60 seconds.' },
  { id: 'dont_know', label: "I honestly don't know", reflection: 'Take a deep breath. Let the impulse pass like a wave over rocks.' },
]

export default function Pause() {
  const [selectedUrge, setSelectedUrge] = useState<typeof URGE_OPTIONS[0] | null>(null)
  const [timerFinished, setTimerFinished] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(30)

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] max-w-3xl mx-auto py-6 text-center animate-fade-in">
      <Badge variant="copper">IMPULSE INTERVENTION</Badge>
      
      <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#f5f2eb] mt-3 tracking-tight">
        "Before you do it, pause."
      </h1>
      
      <p className="text-xs sm:text-sm text-[#9498a1] mt-2 max-w-md leading-relaxed font-sans">
        Give yourself 30 seconds of space before acting on a sudden urge to contact, check up on, or react impulsively.
      </p>

      {/* Step 1: Intention Selection */}
      {!selectedUrge ? (
        <Card variant="glass" className="w-full mt-8 p-6 sm:p-8 flex flex-col gap-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-[#d48c5c]">
            What do you hope will happen if you act right now?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {URGE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedUrge(opt)}
                className="p-4 rounded-xl border border-white/[0.08] bg-[#070809]/50 text-xs text-[#e6e1d5] font-medium text-left hover:border-[#d48c5c]/60 hover:text-[#f5f2eb] transition-all cursor-pointer leading-relaxed"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      ) : (
        /* Step 2: Contextual Reflection + Countdown */
        <div className="w-full flex flex-col gap-6 mt-8">
          <Card variant="glow" className="p-6 text-left flex flex-col gap-2">
            <span className="text-[10px] font-mono uppercase text-[#d48c5c]">Contextual Reflection</span>
            <h4 className="text-base font-serif font-semibold text-[#f5f2eb]">"{selectedUrge.label}"</h4>
            <p className="text-xs text-[#e6e1d5]/90 italic font-serif leading-relaxed mt-1">
              "{selectedUrge.reflection}"
            </p>
          </Card>

          {/* Interactive Countdown */}
          <CountdownTimer
            initialSeconds={timerSeconds}
            autoStart={true}
            onComplete={() => setTimerFinished(true)}
          />

          {/* Completion Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link to="/app/unsent">
              <Button variant="primary" icon={<Feather className="w-4 h-4" />}>
                Write an Unsent Letter Instead
              </Button>
            </Link>
            
            <Link to="/app/pulse">
              <Button variant="secondary" icon={<Activity className="w-4 h-4" />}>
                Log a Pulse Check-in
              </Button>
            </Link>

            <Button
              variant="ghost"
              onClick={() => {
                setSelectedUrge(null)
                setTimerFinished(false)
              }}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Choose Different Urge
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
