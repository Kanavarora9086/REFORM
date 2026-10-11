import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
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
        </div>

        <Card variant="glass" className="p-6 sm:p-8 flex flex-col gap-6">
          {!sent ? (
            <>
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-serif font-semibold text-[#f5f2eb]">Reset Your Password</h2>
                <p className="text-xs text-[#9498a1]">Enter your email to receive a password recovery link.</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <Button variant="primary" type="submit" fullWidth>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-[#d48c5c]/20 text-[#d48c5c] flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">Recovery Email Sent</h3>
              <p className="text-xs text-[#9498a1]">
                If an account exists for <span className="text-[#f5f2eb] font-semibold">{email}</span>, password reset instructions have been dispatched.
              </p>
            </div>
          )}

          <div className="border-t border-white/[0.06] pt-4 text-center">
            <Link to="/login" className="text-xs text-[#9498a1] hover:text-[#f5f2eb] inline-flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
