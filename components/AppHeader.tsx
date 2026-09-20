"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

type Session = {
  customer: { email: string; name: string } | null
}

export default function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [session, setSession] = useState<Session>({ customer: null })
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => setSession({ customer: data.customer || null }))
      .catch(() => setSession({ customer: null }))
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const signedIn = Boolean(session.customer)

  const navLinks = signedIn
    ? [
        { href: '/', label: 'Overview' },
        { href: '/dashboard', label: 'My Requests' },
        { href: '/submit', label: 'Submit Ticket' },
      ]
    : [
        { href: '/', label: 'Overview' },
        { href: '/login', label: 'Customer Sign In' },
      ]

  async function signOut() {
    await fetch('/api/auth/customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    })
    setSession({ customer: null })
    setMobileMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const customerInitials = session.customer?.name
    ? session.customer.name.slice(0, 2).toUpperCase()
    : session.customer?.email
      ? session.customer.email.slice(0, 2).toUpperCase()
      : 'U'

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0B0E]/85 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/40'
          : 'bg-[#07080B]/60 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 group text-white font-display font-bold tracking-tight text-[18px]"
          >
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-400 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </span>
            <div className="flex flex-col">
              <span className="leading-tight text-white flex items-center gap-1.5">
                Harbor
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 uppercase tracking-widest">
                  AI
                </span>
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-stone-400 -mt-0.5">Support Suite</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map(link => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full transition-all duration-150 text-xs font-semibold ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/15 shadow-[0_0_20px_-5px_rgba(99,102,241,0.3)]'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right Action & Customer Session */}
        <div className="flex items-center gap-3">
          {signedIn ? (
            <div className="hidden sm:flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-3.5 pr-1.5 py-1 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-medium text-stone-300 max-w-[150px] truncate" title={session.customer?.email}>
                  {session.customer?.email}
                </span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-2 rounded-full hover:bg-white/5 transition"
              >
                Sign in
              </Link>
              <Link
                href="/submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 hover:opacity-90 text-white text-xs font-bold rounded-full shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-98"
              >
                <span>Get Help</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(o => !o)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-stone-300 hover:text-white hover:bg-white/10 rounded-xl border border-white/10 transition"
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

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0B0E]/95 backdrop-blur-2xl px-4 py-4 space-y-2 shadow-2xl animate-fade-in">
          {signedIn && (
            <div className="pb-3 mb-2 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  {customerInitials}
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-white truncate max-w-[200px]">{session.customer?.name || 'Customer'}</p>
                  <p className="text-stone-400 truncate max-w-[200px]">{session.customer?.email}</p>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>
          )}

          {navLinks.map(link => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive ? 'bg-white/10 text-white font-semibold border border-white/15' : 'text-stone-300 hover:bg-white/5'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                )}
              </Link>
            )
          })}

          {signedIn ? (
            <button
              type="button"
              onClick={signOut}
              className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
            >
              Sign out of account
            </button>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                Sign in to your account
              </Link>
              <Link
                href="/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/25"
              >
                Submit a new request
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
