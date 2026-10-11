import React, { useState } from 'react'
import { Settings as SettingsIcon, User, Shield, Bell, Sparkles, Download, Trash2, Key } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Toast, ToastMessage } from '../components/ui/Toast'
import { useAuth } from '../services/auth'

export default function Settings() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [aiTone, setAiTone] = useState('Editorial & Empathetic')
  const [dailyReminders, setDailyReminders] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Settings Saved',
      message: 'Your profile and AI preferences have been updated.',
    })
  }

  const handleExportData = () => {
    const data = {
      user,
      pulses: localStorage.getItem('reform_pulse_history'),
      journals: localStorage.getItem('reform_unload_entries'),
      unsent: localStorage.getItem('reform_unsent_letters'),
      memories: localStorage.getItem('reform_memories'),
      goals: localStorage.getItem('reform_rebuild_goals'),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reform_data_export_${Date.now()}.json`
    a.click()
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Data Exported',
      message: 'Your personal archive JSON file has been downloaded.',
    })
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Preferences & Controls
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Customize AI reflection tone, notification schedules, and manage your private data archive.
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
        {/* Profile Settings */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <User className="w-4 h-4 text-[#d48c5c]" />
            <h3 className="text-sm font-serif font-semibold text-[#f5f2eb]">Profile Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Display Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              label="Email Address"
              value={user?.email || 'user@reform.app'}
              disabled
              helperText="Managed by account security"
            />
          </div>
        </Card>

        {/* AI & Reflection Preferences */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Sparkles className="w-4 h-4 text-[#d48c5c]" />
            <h3 className="text-sm font-serif font-semibold text-[#f5f2eb]">AI Persona & Reflection Tone</h3>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-[#e6e1d5]/80">Clarity AI Tone Style</label>
            <select
              value={aiTone}
              onChange={(e) => setAiTone(e.target.value)}
              className="bg-[#070809] border border-white/[0.08] text-xs text-[#f5f2eb] p-3 rounded-lg focus:outline-none focus:border-[#d48c5c]"
            >
              <option value="Editorial & Empathetic">Editorial & Empathetic (Default - Stoic, introspective)</option>
              <option value="Direct & Grounded">Direct & Grounded (Shorter, highly actionable)</option>
              <option value="Philosophical">Philosophical (Socratic questions & quote references)</option>
            </select>
          </div>
        </Card>

        {/* Notifications & Reminders */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Bell className="w-4 h-4 text-[#d48c5c]" />
            <h3 className="text-sm font-serif font-semibold text-[#f5f2eb]">Notifications & Reminders</h3>
          </div>

          <div className="flex items-center justify-between p-3 bg-[#070809]/40 rounded-xl border border-white/[0.04]">
            <div>
              <h4 className="text-xs font-semibold text-[#f5f2eb]">Evening Reflection Prompt</h4>
              <p className="text-[11px] text-[#9498a1]">Receive a subtle reminder at 9:00 PM for daily pulse check-in.</p>
            </div>
            <input
              type="checkbox"
              checked={dailyReminders}
              onChange={(e) => setDailyReminders(e.target.checked)}
              className="w-4 h-4 accent-[#d48c5c] cursor-pointer"
            />
          </div>
        </Card>

        {/* Security & Data Export */}
        <Card variant="glass" className="flex flex-col gap-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06]">
            <Shield className="w-4 h-4 text-[#d48c5c]" />
            <h3 className="text-sm font-serif font-semibold text-[#f5f2eb]">Privacy & Data Portability</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-semibold text-[#f5f2eb]">Export Full Data Archive</h4>
              <p className="text-[11px] text-[#9498a1]">Download all your journal entries, pulses, goals, and unsent letters in JSON format.</p>
            </div>
            <Button
              type="button"
              variant="copper-outline"
              size="sm"
              onClick={handleExportData}
              icon={<Download className="w-4 h-4" />}
            >
              Export JSON Archive
            </Button>
          </div>
        </Card>

        <div className="flex justify-end pt-2">
          <Button variant="primary" type="submit">
            Save All Preferences
          </Button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
