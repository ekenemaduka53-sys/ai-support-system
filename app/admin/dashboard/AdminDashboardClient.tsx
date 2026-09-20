"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RequestList from '../../../components/RequestList'

export default function AdminDashboardClient() {
  const router = useRouter()

  async function signOut() {
    await fetch('/api/auth/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0C0C0D] text-stone-100 selection:bg-stone-700 selection:text-white flex flex-col">
      {/* Top Operations Header */}
      <header className="sticky top-0 z-40 bg-[#121214]/90 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-white text-stone-950 flex items-center justify-center text-sm font-black shadow-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </span>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-tight text-white leading-tight">
                  Harbor Console
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold">
                  Global Triage Desk
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-stone-300 font-medium">Operations Live</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition"
            >
              Customer Portal ↗
            </Link>
            <button
              onClick={signOut}
              className="text-xs font-semibold text-rose-300 hover:text-rose-200 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-stone-400">
              Staff Administrative Clearance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mt-1">
            Global Support Queue & Triage Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-2xl leading-relaxed">
            Monitor real-time incoming tickets from all customers, review categorized topics and urgency levels, inspect automated responses, and manage ticket status.
          </p>
        </div>

        {/* Global Request List */}
        <RequestList />
      </main>

      <footer className="border-t border-white/5 bg-[#0C0C0D] py-6 px-4 text-center text-xs text-stone-600">
        Harbor Internal Support Console · Strictly Authorized Staff Access Only
      </footer>
    </div>
  )
}
