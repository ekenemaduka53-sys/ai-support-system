"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react'
import RequestCard, { Request } from './RequestCard'

export default function RequestList() {
  const [items, setItems] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'ai_responded' | 'resolved'>('all')
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'urgency'>('newest')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchItems = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true)
    setIsRefreshing(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/requests', { cache: 'no-store' })
      if (res.status === 401) {
        window.location.href = '/admin/login'
        return
      }
      if (!res.ok) throw new Error(`Failed to fetch requests (${res.status})`)
      const data = await res.json()
      setItems(data.requests || [])
    } catch (err: any) {
      if (!isBackground) setError(err.message || 'Error loading requests')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchItems(false)
  }, [fetchItems])

  useEffect(() => {
    if (!autoRefresh) return
    const timer = setInterval(() => fetchItems(true), 8000)
    return () => clearInterval(timer)
  }, [autoRefresh, fetchItems])

  // Extract unique categories for filter
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>()
    items.forEach(i => {
      if (i.category) set.add(i.category)
    })
    return Array.from(set).sort()
  }, [items])

  const pendingCount = items.filter(i => i.status === 'pending').length
  const respondedCount = items.filter(i => i.status === 'ai_responded').length
  const resolvedCount = items.filter(i => i.status === 'resolved').length
  const highUrgencyCount = items.filter(i => (i.urgency || '').toLowerCase() === 'high').length

  const filtered = useMemo(() => {
    return items
      .filter(it => (statusFilter === 'all' ? true : it.status === statusFilter))
      .filter(it => (urgencyFilter === 'all' ? true : (it.urgency || '').toLowerCase() === urgencyFilter))
      .filter(it => (categoryFilter === 'all' ? true : (it.category || '').toLowerCase() === categoryFilter.toLowerCase()))
      .filter(it => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
          it.subject.toLowerCase().includes(q) ||
          it.name.toLowerCase().includes(q) ||
          it.email.toLowerCase().includes(q) ||
          (it.category && it.category.toLowerCase().includes(q)) ||
          it.message.toLowerCase().includes(q) ||
          (it.ai_response && it.ai_response.toLowerCase().includes(q))
        )
      })
      .sort((a, b) => {
        if (sortOrder === 'urgency') {
          const rank: Record<string, number> = { high: 3, medium: 2, low: 1 }
          const rankA = rank[(a.urgency || '').toLowerCase()] || 0
          const rankB = rank[(b.urgency || '').toLowerCase()] || 0
          if (rankA !== rankB) return rankB - rankA
        }
        const ta = new Date(a.created_at).getTime()
        const tb = new Date(b.created_at).getTime()
        return sortOrder === 'oldest' ? ta - tb : tb - ta
      })
  }, [items, statusFilter, urgencyFilter, categoryFilter, searchQuery, sortOrder])

  if (loading && items.length === 0) {
    return (
      <div className="py-24 text-center bg-stone-900/60 rounded-3xl border border-white/10 space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-stone-600 border-t-white"></div>
        <p className="text-sm font-medium text-stone-400">Loading global triage queue…</p>
      </div>
    )
  }

  if (error && items.length === 0) {
    return (
      <div className="rounded-3xl bg-rose-500/10 border border-rose-500/20 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-white font-display font-bold">Failed to load tickets</h3>
          <p className="text-xs text-rose-300">{error}</p>
        </div>
        <button
          onClick={() => fetchItems(false)}
          className="px-5 py-2 bg-white text-stone-950 text-xs font-bold uppercase tracking-wider rounded-full hover:bg-stone-200 transition"
        >
          Retry Connection
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-stone-900/80 border border-white/10 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Total Queue</span>
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
          <div className="text-3xl font-display font-extrabold text-white">{items.length}</div>
          <p className="text-[11px] text-stone-500">All submitted tickets</p>
        </div>

        <div className="bg-stone-900/80 border border-white/10 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">High Urgency</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="text-3xl font-display font-extrabold text-rose-400">{highUrgencyCount}</div>
          <p className="text-[11px] text-stone-500">Requires priority action</p>
        </div>

        <div className="bg-stone-900/80 border border-white/10 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">In Review</span>
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          </div>
          <div className="text-3xl font-display font-extrabold text-sky-400">{respondedCount}</div>
          <p className="text-[11px] text-stone-500">Auto-replied & awaiting review</p>
        </div>

        <div className="bg-stone-900/80 border border-white/10 rounded-2xl p-5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">Resolved</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-3xl font-display font-extrabold text-emerald-400">{resolvedCount}</div>
          <p className="text-[11px] text-stone-500">Successfully closed</p>
        </div>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-stone-900/90 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
        {/* Row 1: Status Pills & Global Search */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl overflow-x-auto text-xs font-semibold text-stone-400 border border-white/5">
            {([
              ['all', `All (${items.length})`],
              ['pending', `New (${pendingCount})`],
              ['ai_responded', `In Review (${respondedCount})`],
              ['resolved', `Resolved (${resolvedCount})`],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  statusFilter === key
                    ? 'bg-white text-stone-950 shadow font-bold'
                    : 'hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 lg:max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by customer, email, subject, category, message…"
              className="w-full px-3.5 py-2 pl-9 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder-stone-500 focus:bg-black/60 focus:outline-none focus:border-white/30 transition-all"
            />
            <svg className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Row 2: Secondary Filters & Live Sync */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-3">
            {/* Urgency Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Urgency:</span>
              <select
                value={urgencyFilter}
                onChange={e => setUrgencyFilter(e.target.value as any)}
                className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-stone-200 focus:outline-none"
              >
                <option value="all">All Urgencies</option>
                <option value="high">High Urgency</option>
                <option value="medium">Medium Urgency</option>
                <option value="low">Low Urgency</option>
              </select>
            </div>

            {/* Category Filter */}
            {uniqueCategories.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-stone-200 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Sort:</span>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as any)}
                className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1 text-stone-200 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="urgency">Highest Urgency First</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer select-none text-stone-400 hover:text-stone-200">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={e => setAutoRefresh(e.target.checked)}
                className="rounded border-white/20 bg-black/40 text-blue-600 focus:ring-0"
              />
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${autoRefresh ? 'bg-emerald-400 animate-pulse' : 'bg-stone-600'}`}></span>
                Auto-sync
              </span>
            </label>

            <button
              onClick={() => fetchItems(false)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-stone-950 font-semibold rounded-full hover:bg-stone-200 disabled:opacity-50 transition-all text-xs"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin w-3 h-3 text-stone-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Syncing…</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 text-stone-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Refresh Queue</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Cards Stream */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-stone-900/60 border border-white/10 rounded-2xl p-12 text-center text-stone-400 space-y-2">
            <p className="font-semibold text-white">No tickets match active filters</p>
            <p className="text-xs">Adjust search keywords, urgency, or category filters to display tickets.</p>
          </div>
        ) : (
          filtered.map(it => (
            <RequestCard
              key={it.id}
              item={it}
              onStatusChange={(id, status) =>
                setItems(prev => prev.map(i => (i.id === id ? { ...i, status } : i)))
              }
            />
          ))
        )}
      </div>
    </div>
  )
}
