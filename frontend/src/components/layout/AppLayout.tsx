import React from 'react'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#0b0c0e] text-[#f5f2eb] flex flex-col lg:flex-row antialiased selection:bg-[#d48c5c]/30">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Mobile Header & Bottom Bar */}
      <MobileNav />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 pb-24 lg:pb-12 pt-4 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full animate-fade-in">
        {children}
      </main>
    </div>
  )
}
