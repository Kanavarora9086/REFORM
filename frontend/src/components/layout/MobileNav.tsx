import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Activity, Feather, Sparkles, TrendingUp, Menu } from 'lucide-react'
import { Drawer } from '../ui/Drawer'
import { NAV_ITEMS } from './Sidebar'
import { useAuth } from '../../services/auth'

export const MobileNav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const primaryItems = [
    { label: 'Home', path: '/app', icon: <Home className="w-5 h-5" /> },
    { label: 'Pulse', path: '/app/pulse', icon: <Activity className="w-5 h-5" /> },
    { label: 'Unload', path: '/app/unload', icon: <Feather className="w-5 h-5" /> },
    { label: 'Reflect', path: '/app/reflect', icon: <Sparkles className="w-5 h-5" /> },
    { label: 'Progress', path: '/app/progress', icon: <TrendingUp className="w-5 h-5" /> },
  ]

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0b0c0e]/90 backdrop-blur-md border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
        <NavLink to="/app" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#d48c5c]" />
          <span className="text-base font-serif font-bold text-[#f5f2eb]">RE:FORM</span>
        </NavLink>
        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-[#9498a1] hover:text-[#f5f2eb] rounded-lg hover:bg-white/[0.06]"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Bottom Sticky Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0b0c0e]/95 backdrop-blur-lg border-t border-white/[0.08] px-2 py-2 flex items-center justify-around">
        {primaryItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#d48c5c]' : 'text-[#9498a1] hover:text-[#f5f2eb]'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Mobile Extra Menu Drawer */}
      <Drawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="RE:FORM Menu" position="right">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-[#9498a1] uppercase tracking-wider mb-2">Navigation</span>
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1e222b] text-[#d48c5c] font-semibold border border-white/[0.08]'
                      : 'text-[#9498a1] hover:text-[#f5f2eb]'
                  }`
                }
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
            <div className="text-xs text-[#9498a1]">Signed in as <span className="text-[#f5f2eb]">{user?.email || 'Guest'}</span></div>
            <button
              onClick={() => {
                logout()
                setIsMenuOpen(false)
              }}
              className="w-full text-left py-2 text-sm text-red-400 font-medium"
            >
              Sign out
            </button>
          </div>
        </div>
      </Drawer>
    </>
  )
}
