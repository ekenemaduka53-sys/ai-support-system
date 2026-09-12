"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/dashboard', label: 'Support Queue' },
    { href: '/submit', label: 'Submit Ticket' },
  ]

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Left: Brand & Desktop Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 text-slate-900 font-display font-bold tracking-tight text-base hover:opacity-90 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-mono text-xs shadow-sm">
              ⚡
            </div>
            <span>SupportOps</span>
            <span className="hidden xs:inline-block text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              v1.0
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            {navLinks.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right: Actions, Live Indicator & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Live Status Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[11px] font-medium text-emerald-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AI Agent Online</span>
          </div>

          {/* Quick Action Button */}
          <Link
            href="/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            <span>+</span> <span className="hidden xs:inline">New</span> Ticket
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-xs font-mono text-slate-500">
            <span>Navigation Menu</span>
            <span className="flex items-center gap-1.5 text-emerald-700 font-sans font-medium text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              AI Agent Active
            </span>
          </div>
          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
