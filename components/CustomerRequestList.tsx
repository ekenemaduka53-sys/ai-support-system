"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { customerStatusLabel } from '../lib/status'

export interface CustomerTicket {
  id: string
  name?: string
  email?: string
  subject: string
  message: string
  ai_response?: string | null
  status: string
  category?: string | null
  created_at: string
}

function formatRelativeTime(dateString: string) {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  } catch {
    return dateString
  }
}

function formatDateFull(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateString
  }
}

function StatusChip({ status }: { status: string }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 rounded-full border border-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Resolved
      </span>
    )
  }
  if (status === 'ai_responded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-teal-300 bg-teal-500/10 rounded-full border border-teal-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
        Replied
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-300 bg-amber-500/10 rounded-full border border-amber-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      Received
    </span>
  )
}

function TicketCard({ item, defaultOpen = false }: { item: CustomerTicket; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <article className="forethought-glass-card rounded-3xl overflow-hidden transition-all duration-200">
      {/* Card Header (clickable to expand/collapse) */}
      <div
        onClick={() => setOpen(o => !o)}
        className="p-5 sm:p-6 cursor-pointer select-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
      >
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
            <span className="font-mono font-medium text-stone-300 bg-white/10 px-2 py-0.5 rounded-md">
              #{item.id.slice(0, 8)}
            </span>
            <span>·</span>
            <span>{formatRelativeTime(item.created_at)}</span>
            <span>·</span>
            <span className="text-stone-400 hidden sm:inline">{formatDateFull(item.created_at)}</span>
          </div>

          <h2 className="text-base sm:text-lg font-display font-bold text-white break-words leading-snug">
            {item.subject}
          </h2>

          {!open && (
            <p className="text-xs text-stone-400 truncate max-w-2xl">
              {item.ai_response ? `Support Reply: ${item.ai_response}` : item.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <StatusChip status={item.status} />
          <button
            type="button"
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-white/15 text-stone-300 bg-white/5 hover:bg-white/10 hover:text-white transition"
          >
            {open ? 'Collapse' : 'View Thread'}
          </button>
        </div>
      </div>

      {/* Expanded Conversation Thread */}
      {open && (
        <div className="border-t border-white/10 bg-black/20 p-5 sm:p-6 space-y-4 animate-fade-in">
          {/* Customer's Inquiry */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 text-stone-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              You
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-semibold text-stone-300">Your Inquiry</span>
                <span>{formatDateFull(item.created_at)}</span>
              </div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-sm text-stone-200 whitespace-pre-wrap leading-relaxed shadow-sm">
                {item.message}
              </div>
            </div>
          </div>

          {/* Support Team Response */}
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-teal-400 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-md shadow-indigo-500/20">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-stone-400">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                  Harbor Concierge Team
                </span>
                <span className="text-teal-300 font-medium">{item.ai_response ? 'Instant Resolution' : 'Pending'}</span>
              </div>

              {item.ai_response ? (
                <div className="rounded-2xl bg-gradient-to-b from-[#171A27] to-[#121522] border border-white/15 text-stone-100 p-4.5 text-sm whitespace-pre-wrap leading-relaxed shadow-xl">
                  <p>{item.ai_response}</p>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/[0.03] border border-dashed border-white/15 p-4 text-sm text-stone-400 text-center">
                  Our system is currently processing your request. Please check back in a few seconds.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default function CustomerRequestList() {
  const [items, setItems] = useState<CustomerTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'resolved'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchItems = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch('/api/requests', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not load your requests')
      setItems(data.requests || [])
    } catch (err: any) {
      setError(err.message || 'Could not load your requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const totalCount = items.length
  const activeCount = items.filter(i => i.status !== 'resolved').length
  const resolvedCount = items.filter(i => i.status === 'resolved').length

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        if (activeTab === 'active') return item.status !== 'resolved'
        if (activeTab === 'resolved') return item.status === 'resolved'
        return true
      })
      .filter(item => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          item.subject.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          (item.ai_response && item.ai_response.toLowerCase().includes(q))
        )
      })
  }, [items, activeTab, searchQuery])

  if (loading) {
    return (
      <div className="py-20 text-center forethought-glass-card rounded-3xl space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-teal-400"></div>
        <p className="text-sm font-semibold text-stone-300">Loading your private inbox…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl forethought-glass-card border-rose-500/25 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1 max-w-md mx-auto">
          <h3 className="font-display font-bold text-white text-base">Unable to load requests</h3>
          <p className="text-xs text-stone-400">{error}</p>
        </div>
        <button
          onClick={fetchItems}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full hover:opacity-95 transition shadow-lg shadow-indigo-500/25"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="forethought-glass-card rounded-3xl p-12 text-center space-y-5 shadow-2xl backdrop-blur-2xl">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h3 className="font-display font-bold text-xl text-white">No requests submitted yet</h3>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            When you ask a question or report an issue, your conversation and prompt answers will appear here in your private workspace.
          </p>
        </div>
        <Link
          href="/submit"
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white rounded-full hover:opacity-95 transition shadow-lg shadow-indigo-500/25"
        >
          <span>Ask Your First Question</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter and Search Bar */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/10 p-3 sm:p-4 shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl text-xs font-semibold text-stone-400">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white/15 text-white shadow-sm border border-white/10'
                : 'hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'active'
                ? 'bg-white/15 text-white shadow-sm border border-white/10'
                : 'hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('resolved')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'resolved'
                ? 'bg-white/15 text-white shadow-sm border border-white/10'
                : 'hover:text-white'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search your requests…"
            className="w-full rounded-xl border border-white/15 bg-black/30 pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:bg-black/50 focus:border-indigo-400 focus:outline-none transition-all"
          />
          <svg className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="forethought-glass-card rounded-3xl p-8 text-center text-xs text-stone-400 space-y-2">
            <p className="font-semibold text-white">No requests match your current filters</p>
            <p>Try clearing your search query or switching tabs.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <TicketCard key={item.id} item={item} defaultOpen={idx === 0 && filteredItems.length === 1} />
          ))
        )}
      </div>
    </div>
  )
}
