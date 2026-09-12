"use client"
import React, { useEffect, useState, useCallback } from 'react'
import RequestCard from './RequestCard'
import Link from 'next/link'

export interface RequestItem {
  id: string
  name: string
  email: string
  subject: string
  message: string
  ai_response?: string | null
  status: string
  category?: string | null
  urgency?: string | null
  created_at: string
  updated_at?: string
}

export default function RequestList() {
  const [items, setItems] = useState<RequestItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all'|'pending'|'ai_responded'|'resolved'>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<'all'|'low'|'medium'|'high'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'desc'|'asc'>('desc')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchItems = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true)
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch('/api/requests', { cache: 'no-store' })
      if (!res.ok) {
        throw new Error(`Failed to fetch requests (${res.status})`)
      }
      const data = await res.json()
      setItems(data.requests || [])
    } catch (err: any) {
      console.error('[RequestList] Fetch error:', err.message)
      if (!isBackground) {
        setError(err.message || 'Error loading requests')
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchItems(false)
  }, [fetchItems])

  // Auto-polling interval (every 5 seconds when enabled)
  useEffect(() => {
    if (!autoRefresh) return
    const timer = setInterval(() => {
      fetchItems(true)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoRefresh, fetchItems])

  const filtered = items
    .filter(it => (statusFilter === 'all' ? true : it.status === statusFilter))
    .filter(it => (urgencyFilter === 'all' ? true : (it.urgency || '').toLowerCase() === urgencyFilter))
    .filter(it => {
      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase()
      return (
        it.subject.toLowerCase().includes(q) ||
        it.name.toLowerCase().includes(q) ||
        it.email.toLowerCase().includes(q) ||
        (it.category && it.category.toLowerCase().includes(q)) ||
        it.message.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const ta = new Date(a.created_at).getTime()
      const tb = new Date(b.created_at).getTime()
      return sortOrder === 'desc' ? tb - ta : ta - tb
    })

  function handleResolved(id: string) {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, status: 'resolved' } : i)))
  }

  const pendingCount = items.filter(i => i.status === 'pending').length
  const respondedCount = items.filter(i => i.status === 'ai_responded').length
  const resolvedCount = items.filter(i => i.status === 'resolved').length

  if (loading && items.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-slate-900 border-t-transparent mb-3"></div>
        <p className="text-sm font-medium text-slate-700">Connecting to Support Database...</p>
        <p className="text-xs text-slate-400 font-mono mt-1">Fetching latest ticket records</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="rounded-xl bg-rose-50 border border-rose-200 p-8 text-center space-y-3">
        <p className="text-rose-800 font-semibold">Failed to load support requests: {error}</p>
        <button
          onClick={() => fetchItems(false)}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 transition"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Metric Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">Total Intake</div>
          <div className="text-2xl font-display font-bold text-slate-900 mt-1">{items.length}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">All tickets logged</div>
        </div>

        <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono font-semibold text-amber-800 uppercase tracking-wider">Pending AI</div>
          <div className="text-2xl font-display font-bold text-amber-900 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700/80 font-mono mt-0.5">Awaiting generation</div>
        </div>

        <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono font-semibold text-indigo-800 uppercase tracking-wider">AI Responded</div>
          <div className="text-2xl font-display font-bold text-indigo-900 mt-1">{respondedCount}</div>
          <div className="text-[11px] text-indigo-700/80 font-mono mt-0.5">Drafts ready for review</div>
        </div>

        <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-4 shadow-sm">
          <div className="text-[11px] font-mono font-semibold text-emerald-800 uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-display font-bold text-emerald-900 mt-1">{resolvedCount}</div>
          <div className="text-[11px] text-emerald-700/80 font-mono mt-0.5">Closed by agents</div>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-4 shadow-sm space-y-3">
        {/* Top Controls: Search and Status Tabs */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Status Segmented Switch */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/70 overflow-x-auto text-xs font-medium w-full lg:w-auto shrink-0">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition whitespace-nowrap text-center ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition whitespace-nowrap text-center ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('ai_responded')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition whitespace-nowrap text-center ${
                statusFilter === 'ai_responded'
                  ? 'bg-white text-indigo-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Responded ({respondedCount})
            </button>
            <button
              onClick={() => setStatusFilter('resolved')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-md transition whitespace-nowrap text-center ${
                statusFilter === 'resolved'
                  ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative flex-1 w-full lg:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search subject, customer, email..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1.5 text-slate-400 hover:text-slate-600 text-xs p-0.5"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Secondary Row: Urgency Dropdown, Sort, Live Sync */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2.5 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-medium">Urgency:</span>
              <select
                value={urgencyFilter}
                onChange={e => setUrgencyFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="all">All</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(s => (s === 'desc' ? 'asc' : 'desc'))}
              className="px-2.5 py-1 border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 font-medium transition"
            >
              Order: {sortOrder === 'desc' ? 'Newest ↓' : 'Oldest ↑'}
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <label className="flex items-center gap-1.5 text-slate-600 select-none cursor-pointer font-mono text-[11px]">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${autoRefresh ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                Live Poll (5s)
              </span>
            </label>

            <button
              onClick={() => fetchItems(false)}
              disabled={isRefreshing}
              className="px-3 py-1 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-1.5 font-medium"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin h-3 w-3 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Syncing...
                </>
              ) : (
                '↻ Refresh'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket List Stream */}
      <div className="space-y-3.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-slate-500 space-y-2 shadow-sm">
            <span className="text-3xl block">📭</span>
            <p className="font-semibold text-slate-800 text-sm">No support tickets match your criteria</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query, status filters, or create a new support ticket.
            </p>
            <div className="pt-2">
              <Link
                href="/submit"
                className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
              >
                + Create Support Ticket
              </Link>
            </div>
          </div>
        ) : (
          filtered.map((it: RequestItem) => (
            <RequestCard key={it.id} item={it} onResolved={handleResolved} />
          ))
        )}
      </div>
    </div>
  )
}


