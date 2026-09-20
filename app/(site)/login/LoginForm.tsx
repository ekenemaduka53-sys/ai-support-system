"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get('next') || '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/auth/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not sign in')
      router.push(next)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Sign-in failed. Please check your email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-6 sm:py-10">
      {/* Header */}
      <div className="mb-8 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-teal-500/10 to-indigo-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold tracking-wide">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Private Customer Workspace</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Sign In to Harbor
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed max-w-sm mx-auto">
          Enter your email to view your personal support conversations and private resolution history.
        </p>
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="forethought-glass-card rounded-3xl p-6 sm:p-8 space-y-4.5 shadow-2xl backdrop-blur-2xl"
      >
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Your Name <span className="text-stone-500 font-normal lowercase">(optional)</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Alex Vance"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-stone-600 focus:bg-black/60 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
            Email Address <span className="text-rose-400">*</span>
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder-stone-600 focus:bg-black/60 focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
          />
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/20 p-3.5 text-xs text-rose-300 flex items-start gap-2">
            <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Privacy Note */}
        <div className="rounded-2xl bg-white/[0.03] p-3.5 border border-white/5 text-xs text-stone-400 flex items-center gap-2">
          <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Row-Level Security: You only access tickets belonging to this email.</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white text-sm font-bold hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span>Opening Workspace…</span>
            </>
          ) : (
            <>
              <span>Continue to Workspace</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center text-xs text-stone-500 mt-6">
        Need quick answers without signing in?{' '}
        <Link href="/submit" className="text-teal-300 font-semibold underline underline-offset-4 hover:text-teal-200">
          Submit a new request
        </Link>
      </p>
    </div>
  )
}
