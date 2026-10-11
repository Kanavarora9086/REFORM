import React, { useState, useEffect } from 'react'
import { Bell, CheckCircle2, Clock } from 'lucide-react'
import { apiRequest } from '../services/api'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'

export default function Notifications() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const res = await apiRequest<any[]>('get', '/api/notifications', null, 'reform_notifications')
      setItems(res || [])
    }
    load()
  }, [])

  const markAllRead = () => {
    setItems(items.map((i) => ({ ...i, read: true })))
  }

  return (
    <div className="flex flex-col gap-8 py-2 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[#d48c5c] font-semibold">
            Activity & System Signals
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#f5f2eb] mt-1">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-[#9498a1] mt-1 font-sans">
            Important check-in reminders, goal milestone updates, and time capsule unlocks.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={markAllRead}>
          Mark All as Read
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <Card variant="subtle" className="text-center py-12">
            <Bell className="w-8 h-8 text-[#9498a1] mx-auto mb-3" />
            <p className="text-xs text-[#9498a1]">No notifications at this time.</p>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} variant="glass" padding="sm" className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${item.read ? 'bg-white/[0.04] text-[#9498a1]' : 'bg-[#d48c5c]/20 text-[#d48c5c]'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-semibold text-[#f5f2eb]">{item.title}</h4>
                    {!item.read && <Badge variant="copper">New</Badge>}
                  </div>
                  <p className="text-xs text-[#9498a1] mt-0.5">{item.message}</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#9498a1] shrink-0">{item.time}</span>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
