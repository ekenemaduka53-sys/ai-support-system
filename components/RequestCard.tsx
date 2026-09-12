"use client"
import React, { useState } from 'react'

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
  const map: Record<string, { bg: string; text: string; border: string; label: string; dot: string }> = {
    pending: {
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      label: 'Pending AI',
      dot: 'bg-amber-500',
    },
    ai_responded: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      label: 'AI Responded',
      dot: 'bg-indigo-500',
    },
    resolved: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      label: 'Resolved',
      dot: 'bg-emerald-500',
    },
  }

  const conf = map[status] || {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    label: status.replace('_', ' '),
    dot: 'bg-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-md border ${conf.bg} ${conf.text} ${conf.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${conf.dot}`}></span>
      {conf.label}
    </span>
  )
}

function CategoryBadge({ category }: { category?: string | null }) {
  if (!category) return null
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-purple-50 text-purple-700 border border-purple-200/80">
      <span className="text-[11px]">🏷️</span> {category}
    </span>
  )
}

function UrgencyFlag({ urgency }: { urgency?: string | null }) {
  if (!urgency) return null
  const u = urgency.toLowerCase()

  if (u === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-md bg-rose-50 text-rose-800 border border-rose-200">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
        High Urgency
      </span>
    )
  }
  if (u === 'medium') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-amber-50 text-amber-800 border border-amber-200/70">
        Med Urgency
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
      Low Urgency
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
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  } catch {
    return dateString
  }
}

export default function RequestCard({ item, onResolved }: { item: Request; onResolved?: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleResolve() {
    setActionError(null)
    if (!confirm(`Mark ticket "${item.subject}" as resolved?`)) return
    setResolving(true)

    try {
      const res = await fetch(`/api/requests/${item.id}/resolve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        const errorMsg = data?.error || `Server responded with status ${res.status}`
        throw new Error(errorMsg)
      }

      onResolved?.(item.id)
    } catch (err: any) {
      console.error('[RequestCard] Resolve error:', err)
      const message = err.message || 'Unknown resolution error'
      setActionError(message)
      alert(`Could not resolve ticket: ${message}`)
    } finally {
      setResolving(false)
    }
  }

  function handleCopyResponse() {
    if (!item.ai_response) return
    navigator.clipboard.writeText(item.ai_response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isResolved = item.status === 'resolved'
  const initials = item.name ? item.name.slice(0, 2).toUpperCase() : 'CU'

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-150 shadow-sm p-4 sm:p-5 ${
        isResolved ? 'border-slate-200 bg-slate-50/40 opacity-90' : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Top Header Row: Metadata & Badges */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-2 flex-1 min-w-0">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-mono">
            <span className="font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
              #{item.id.slice(0, 8)}
            </span>
            <span className="text-slate-300">•</span>
            <span className="shrink-0" title={new Date(item.created_at).toLocaleString()}>{formatRelativeTime(item.created_at)}</span>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5 text-slate-600 font-sans min-w-0">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
                {initials}
              </span>
              <span className="font-medium text-slate-800 truncate max-w-[120px] sm:max-w-none">{item.name}</span>
              <span className="text-slate-400 text-[11px] truncate max-w-[130px] sm:max-w-none hidden xs:inline">({item.email})</span>
            </div>
          </div>

          {/* Primary Subject Line */}
          <div className="pt-0.5">
            <h3 className="text-base font-display font-semibold text-slate-900 tracking-tight leading-snug break-words">
              {item.subject}
            </h3>
          </div>

          {/* Badge Cluster */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <StatusBadge status={item.status} />
            <CategoryBadge category={item.category} />
            <UrgencyFlag urgency={item.urgency} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto pt-2 sm:pt-0">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex-1 sm:flex-initial text-center justify-center text-xs px-3 py-2 sm:py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-medium text-slate-700 transition active:scale-[0.98]"
          >
            {open ? 'Hide Panel ▲' : 'View Draft ▼'}
          </button>

          <button
            onClick={handleResolve}
            disabled={resolving || isResolved}
            className={`flex-1 sm:flex-initial text-center justify-center text-xs px-3.5 py-2 sm:py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 shadow-sm active:scale-[0.98] ${
              isResolved
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-default'
                : 'bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50'
            }`}
          >
            {resolving ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Resolving...
              </>
            ) : isResolved ? (
              '✓ Resolved'
            ) : (
              'Resolve Ticket'
            )}
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mt-3 rounded-lg bg-rose-50 border border-rose-200 p-2.5 text-xs text-rose-700">
          ❌ {actionError}
        </div>
      )}

      {/* Expanded Split View Drawer */}
      {open && (
        <div className="mt-4 border-t border-slate-200/80 pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Customer Message */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono font-medium uppercase tracking-wider">
                <span>Customer Query</span>
                <span>{item.email}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                {item.message}
              </p>
            </div>

            {/* Right: AI Assistant Reply */}
            <div className="bg-indigo-50/50 border border-indigo-200/70 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs text-indigo-900 font-mono font-semibold uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span>🤖</span> AI Proposed Response
                </span>
                {item.ai_response && (
                  <button
                    onClick={handleCopyResponse}
                    className="text-[11px] text-indigo-700 hover:text-indigo-900 underline font-sans"
                  >
                    {copied ? 'Copied! ✓' : 'Copy'}
                  </button>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                {item.ai_response || (
                  <span className="text-slate-400 italic">No automated response has been generated yet.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


