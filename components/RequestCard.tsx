"use client"
import React, { useState } from 'react'
import { adminStatusLabel } from '../lib/status'

export interface Request {
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

function StatusBadge({ status }: { status: string }) {
  if (status === 'resolved') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        Resolved
      </span>
    )
  }
  if (status === 'ai_responded') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
        In Review
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      New Request
    </span>
  )
}

function UrgencyBadge({ urgency }: { urgency?: string | null }) {
  if (!urgency) return null
  const u = urgency.toLowerCase()
  if (u === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
        High Priority
      </span>
    )
  }
  if (u === 'medium') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
        Medium
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-stone-800 text-stone-300 border border-white/10">
      Low
    </span>
  )
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
    return new Date(dateString).toLocaleString('en-US', {
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

export default function RequestCard({
  item,
  onStatusChange,
}: {
  item: Request
  onStatusChange?: (id: string, status: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function updateStatus(status: string) {
    setActionError(null)
    setUpdating(true)
    try {
      const res = await fetch(`/api/admin/requests/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error(data?.error || `Status ${res.status}`)
      onStatusChange?.(item.id, status)
    } catch (err: any) {
      setActionError(err.message || 'Could not update status')
    } finally {
      setUpdating(false)
    }
  }

  const initials = item.name ? item.name.slice(0, 2).toUpperCase() : 'CU'

  return (
    <div className={`bg-stone-900/90 rounded-2xl border border-white/10 p-5 sm:p-6 transition-all duration-200 hover:border-white/20 shadow-lg ${item.status === 'resolved' ? 'opacity-85' : ''}`}>
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-2.5 flex-1 min-w-0">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-400">
            <span className="font-mono font-bold text-stone-300 bg-black/40 px-2 py-0.5 rounded border border-white/5">
              #{item.id.slice(0, 8)}
            </span>
            <span>·</span>
            <span>{formatRelativeTime(item.created_at)}</span>
            <span>·</span>
            <div className="flex items-center gap-1.5 text-stone-200">
              <span className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] font-bold">
                {initials}
              </span>
              <span className="font-semibold text-white truncate max-w-[140px] sm:max-w-none">{item.name}</span>
              <span className="text-stone-400 text-[11px] font-mono truncate max-w-[200px]">({item.email})</span>
            </div>
          </div>

          {/* Subject */}
          <h3 className="text-base sm:text-lg font-display font-bold text-white leading-snug break-words">
            {item.subject}
          </h3>

          {/* Triage Classification Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <StatusBadge status={item.status} />
            {item.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {item.category}
              </span>
            )}
            <UrgencyBadge urgency={item.urgency} />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          {item.status !== 'resolved' ? (
            <button
              type="button"
              disabled={updating}
              onClick={() => updateStatus('resolved')}
              className="inline-flex items-center gap-1 text-xs px-3.5 py-2 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-semibold border border-emerald-500/30 transition disabled:opacity-50"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>Quick Resolve</span>
            </button>
          ) : (
            <button
              type="button"
              disabled={updating}
              onClick={() => updateStatus('pending')}
              className="inline-flex items-center gap-1 text-xs px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-stone-300 font-semibold border border-white/10 transition disabled:opacity-50"
            >
              <span>Reopen Ticket</span>
            </button>
          )}

          {/* Status Dropdown */}
          <select
            disabled={updating}
            value={item.status}
            onChange={e => updateStatus(e.target.value)}
            className="text-xs border border-white/15 rounded-full px-3 py-2 bg-black/60 text-stone-200 focus:outline-none focus:border-white/40"
          >
            <option value="pending">Status: New</option>
            <option value="ai_responded">Status: In Review</option>
            <option value="resolved">Status: Resolved</option>
          </select>

          {/* Expand/Collapse */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            className="text-xs px-3.5 py-2 border border-white/15 rounded-full hover:bg-white/10 font-semibold text-stone-200 transition"
          >
            {open ? 'Hide Conversation' : 'Inspect Thread'}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-300">
          {actionError}
        </div>
      )}

      {/* Expanded Inspector Panel */}
      {open && (
        <div className="mt-5 border-t border-white/10 pt-5 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
          {/* Customer Message Details */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 font-semibold border-b border-white/5 pb-2">
              <span className="uppercase tracking-wider text-[10px] text-stone-400">Customer Message</span>
              <span className="text-[11px]">{formatDateFull(item.created_at)}</span>
            </div>
            <p className="text-sm text-stone-200 whitespace-pre-wrap leading-relaxed">
              {item.message}
            </p>
          </div>

          {/* Automated / AI Response Details */}
          <div className="bg-stone-950 border border-white/15 rounded-2xl p-4.5 space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-400 font-semibold border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="uppercase tracking-wider text-[10px]">Triage Generated Response</span>
              </div>
              <span className="text-[11px] text-stone-500">Autonomous</span>
            </div>
            <p className="text-sm text-stone-200 whitespace-pre-wrap leading-relaxed">
              {item.ai_response || (
                <span className="text-stone-500 italic">No automated response was generated for this ticket.</span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
