import React from 'react'
import Link from 'next/link'
import AppHeader from '../../components/AppHeader'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#07080B] text-stone-100 relative selection:bg-indigo-500 selection:text-white forethought-mesh-bg overflow-x-hidden">
      {/* Forethought atmospheric hero glow */}
      <div className="forethought-hero-glow"></div>

      {/* Grid Pattern Accent */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-grid-pattern opacity-40"></div>

      <AppHeader />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-[#0A0B0E]/80 backdrop-blur-xl py-8 px-4 sm:px-6 relative z-10 mt-auto">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-medium text-stone-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All Systems Operational</span>
            </div>
            <span className="text-white/20">·</span>
            <span>256-bit Encrypted Session</span>
          </div>

          <div className="flex items-center gap-6 text-stone-400">
            <Link href="/" className="hover:text-white transition">Overview</Link>
            <Link href="/dashboard" className="hover:text-white transition">My Requests</Link>
            <Link href="/submit" className="hover:text-white transition">Submit Ticket</Link>
            <Link href="/admin/login" className="hover:text-indigo-400 transition">Staff Portal</Link>
          </div>

          <div className="text-stone-500">
            © {new Date().getFullYear()} Harbor Technologies Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
