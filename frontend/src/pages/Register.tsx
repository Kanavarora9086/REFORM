import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, User, ArrowRight } from 'lucide-react'
import { useAuth } from '../services/auth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(email, password, name)
      navigate('/login')
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || 'Registration failed. Try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f5f2eb] flex items-center justify-center p-4 sm:p-6 antialiased relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d48c5c]/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#d48c5c] shadow-[0_0_12px_#d48c5c]" />
            <span className="text-2xl font-serif font-bold tracking-widest text-[#f5f2eb]">RE:FORM</span>
          </div>
          <p className="text-xs font-mono tracking-wider text-[#9498a1] uppercase">
            Understand. Rebuild. Become.
          </p>
        </div>

        <Card variant="glass" className="p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-serif font-semibold text-[#f5f2eb]">Begin Your Journey</h2>
            <p className="text-xs text-[#9498a1]">Create a private encrypted account to start your self-reflection practice.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <Button variant="primary" type="submit" loading={loading} fullWidth icon={<ArrowRight className="w-4 h-4" />}>
              Create Account
            </Button>
          </form>

          <div className="border-t border-white/[0.06] pt-4 text-center">
            <p className="text-xs text-[#9498a1]">
              Already have an account? <Link to="/login" className="text-[#d48c5c] hover:underline font-semibold">Sign in</Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
