"use client"
import React, { useState } from 'react'
import Link from 'next/link'

interface SubmittedTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  ai_response?: string | null
  status: string
  category?: string | null
  urgency?: string | null
  created_at?: string
}

export default function SupportForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedTicket, setSubmittedTicket] = useState<SubmittedTicket | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSubmittedTicket(null)

    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit support request')
      }

      setSubmittedTicket(data.request)
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err: any) {
      setError(err.message || 'Submission error')
    } finally {
      setLoading(false)
    }
  }

  function handleCopyResponse() {
    if (!submittedTicket?.ai_response) return
    navigator.clipboard.writeText(submittedTicket.ai_response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function UrgencyBadge({ urgency }: { urgency?: string | null }) {
    if (!urgency) return null
    const map: Record<string, string> = {
      low: 'bg-slate-100 text-slate-700 border-slate-200',
      medium: 'bg-amber-50 text-amber-800 border-amber-200',
      high: 'bg-rose-50 text-rose-800 border-rose-200',
    }
    return (
      <span className={`text-xs px-2.5 py-0.5 rounded-md font-medium border ${map[urgency.toLowerCase()] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
        Urgency: {urgency}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Real-time Result Card */}
      {submittedTicket && (
        <div className="bg-white border-2 border-emerald-300 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-emerald-700 font-bold text-base">✓</span>
              <h3 className="font-display font-bold text-slate-900 text-base">Ticket Successfully Ingested</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500">Ticket ID:</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-semibold border border-slate-200">
                #{submittedTicket.id.slice(0, 8)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
              Status: {submittedTicket.status.replace('_', ' ')}
            </span>
            {submittedTicket.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md font-medium bg-purple-50 text-purple-700 border border-purple-200">
                🏷️ {submittedTicket.category}
              </span>
            )}
            <UrgencyBadge urgency={submittedTicket.urgency} />
          </div>

          {submittedTicket.ai_response ? (
            <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-mono font-semibold text-indigo-950 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span>🤖</span> Gemini Automated Response
                </span>
                <button
                  onClick={handleCopyResponse}
                  className="text-indigo-700 hover:text-indigo-900 underline font-sans text-xs font-medium"
                >
                  {copied ? 'Copied! ✓' : 'Copy Text'}
                </button>
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {submittedTicket.ai_response}
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-800">
              ⏳ The AI response draft is currently processing. You can monitor its status on the support queue.
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-sm"
            >
              Open in Support Queue →
            </Link>
            <button
              onClick={() => setSubmittedTicket(null)}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
            >
              Submit another ticket
            </button>
          </div>
        </div>
      )}

      {/* Ticket Intake Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Customer Name <span className="text-rose-500">*</span>
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g., Alex Vance"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g., alex.vance@company.com"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Subject / Issue Headline <span className="text-rose-500">*</span>
          </label>
          <input
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Brief summary of the issue..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Message Body <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Provide all context, error messages, and customer query details..."
            rows={6}
            className="w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Gemini AI will automatically triage category, determine urgency, and generate a draft response.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-medium">
            ❌ {error}
          </div>
        )}

        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <Link
            href="/dashboard"
            className="text-xs text-center sm:text-left text-slate-500 hover:text-slate-800 font-medium py-1 sm:py-0"
          >
            ← View Existing Tickets
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-sm transition disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                Ingesting & Generating Reply...
              </span>
            ) : (
              'Submit Support Request →'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}


