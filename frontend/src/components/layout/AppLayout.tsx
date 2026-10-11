
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
      <div className="flex-1 min-w-0 flex flex-col">
        <main className="flex-1 pb-24 lg:pb-12 pt-4 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto w-full animate-fade-in">
          {children}
        </main>


        {/* Footer Credit */}
        <footer className="mt-8 border-t border-white/[0.06] px-4 py-8 text-center">
          <p className="text-xs tracking-wide text-white/35">
            © 2026 RE:FORM. All rights reserved.
          </p>

          <p className="mt-3 text-sm text-white/50">
            Crafted with purpose by{' '}
            <span className="font-medium text-[#d48c5c]">
              Kanav Arora
            </span>
          </p>
        </footer>
      </div>
    </div>
  )
}