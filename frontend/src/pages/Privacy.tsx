import React from 'react'
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'

export default function Privacy() {
  return (
    <div className="flex flex-col gap-8 py-2 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 pb-6 border-b border-white/[0.06]">
        <Badge variant="copper">DATA SECURITY MANIFESTO</Badge>
        <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
          Privacy Policy & Architecture
        </h1>
        <p className="text-xs sm:text-sm text-[#9498a1] font-sans">
          RE:FORM is built around absolute confidentiality and data ownership.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="flex flex-col gap-3">
          <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">Zero Public AI Model Training</h3>
          <p className="text-xs text-[#9498a1] leading-relaxed">
            Your journals, unsent letters, and pulse logs are processed transiently strictly for reflection synthesis. They are never ingested into global training corpora.
          </p>
        </Card>

        <Card variant="glass" className="flex flex-col gap-3">
          <div className="p-2 w-10 h-10 rounded-xl bg-[#d48c5c]/10 text-[#d48c5c] flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="text-base font-serif font-semibold text-[#f5f2eb]">No Third-Party Analytics Trackers</h3>
          <p className="text-xs text-[#9498a1] leading-relaxed">
            We operate zero pixel trackers, commercial advertising SDKs, or social profiling scripts. Your identity is shielded.
          </p>
        </Card>
      </div>
    </div>
  )
}
