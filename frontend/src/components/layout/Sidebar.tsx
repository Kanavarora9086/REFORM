import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  Home,
  Activity,
  Feather,
  Sparkles,
  Timer,
  Lock,
  Bookmark,
  Compass,
  TrendingUp,
  Clock,
  Bell,
  Settings,
  User,
  LogOut
} from 'lucide-react'
import { useAuth } from '../../services/auth'

export interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/app', icon: <Home className="w-4 h-4" /> },
  { label: 'Pulse', path: '/app/pulse', icon: <Activity className="w-4 h-4" /> },
  { label: 'Unload', path: '/app/unload', icon: <Feather className="w-4 h-4" /> },
  { label: 'Reflect', path: '/app/reflect', icon: <Sparkles className="w-4 h-4" /> },
  { label: 'Pause', path: '/app/pause', icon: <Timer className="w-4 h-4" /> },
  { label: 'Unsent', path: '/app/unsent', icon: <Lock className="w-4 h-4" /> },
  { label: 'Memories', path: '/app/memories', icon: <Bookmark className="w-4 h-4" /> },
  { label: 'Rebuild', path: '/app/rebuild', icon: <Compass className="w-4 h-4" /> },
  { label: 'Progress', path: '/app/progress', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'Future You', path: '/app/future-you', icon: <Clock className="w-4 h-4" /> },
  { label: 'Notifications', path: '/app/notifications', icon: <Bell className="w-4 h-4" /> },
  { label: 'Settings', path: '/app/settings', icon: <Settings className="w-4 h-4" /> },
]

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0b0c0e] border-r border-white/[0.06] text-[#f5f2eb] px-4 py-6 justify-between select-none z-30 shrink-0">
      {/* Top Header & Brand */}
      <div className="flex flex-col gap-6">
        <NavLink to="/app" className="flex flex-col px-3 group">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#d48c5c] shadow-[0_0_10px_#d48c5c]" />
            <h1 className="text-xl font-serif font-bold tracking-widest text-[#f5f2eb] group-hover:text-[#d48c5c] transition-colors">
              RE:FORM
            </h1>
          </div>
          <span className="text-[10px] font-mono tracking-wider text-[#9498a1] mt-1 uppercase">
            Understand. Rebuild. Become.
          </span>
        </NavLink>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1 scrollbar-none">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#1e222b] text-[#f5f2eb] border border-white/[0.08] shadow-md font-semibold'
                    : 'text-[#9498a1] hover:text-[#f5f2eb] hover:bg-white/[0.04]'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <span className="text-current">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-[#d48c5c]/20 text-[#d48c5c] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom User Section */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-[#d48c5c]/20 border border-[#d48c5c]/40 flex items-center justify-center text-[#d48c5c] shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-[#f5f2eb] truncate">
                {user?.name || user?.email?.split('@')[0] || 'Reflector'}
              </span>
              <span className="text-[10px] text-[#9498a1] truncate">{user?.email || 'Private Account'}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-[#9498a1] hover:text-red-400 p-1.5 rounded-md hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
