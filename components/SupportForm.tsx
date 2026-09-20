"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { customerStatusLabel } from '../lib/status'

interface SubmittedTicket {
  id: string
  name: string
  email: string
  subject: string
  message: string
  ai_response?: string | null
  status: string
  created_at?: string
}

const TOPICS = [
  'Billing & Invoicing',
  'Technical Support',
  'Account & Security',
  'Feature Inquiries',
  'General Assistance',
]

export default function SupportForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submittedTicket, setSubmittedTicket] = useState<SubmittedTicket | null>(null)

  useEffect(() => {
    fetch('/api/auth/session')
      .then(r => r.json())
      .then(data => {
        if (data.customer) {
          setEmail(data.customer.email || '')
          setName(data.customer.name || '')
        }
      })
      .catch(() => {})
  }, [])

  function handleSelectTopic(topic: string) {
    setSelectedTopic(topic)
    if (!subject || TOPICS.some(t => subject.startsWith(t))) {
      setSubject(`${topic}: `)
    }
  }

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
        throw new Error(data.error || 'Could not process your request')
      }

      setSubmittedTicket(data.request)
      setSubject('')
      setMessage('')
      setSelectedTopic('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong while submitting your request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Response Card when ticket is submitted */}
      {submittedTicket && (
        <div className="bg-[#0E111A]/90 border border-teal-500/30 rounded-2xl p-6 space-y-5 animate-fade-in shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/40 text-teal-300 flex items-center justify-center text-xs font-bold shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <h3 className="font-display font-bold text-white text-base leading-tight">Request Received</h3>
                <p className="text-[11px] text-stone-400 font-mono">#{submittedTicket.id.slice(0, 8)}</p>
              </div>
            </div>

            <span className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {customerStatusLabel(submittedTicket.status)}
            </span>
          </div>

          {/* Inquiry summary */}
          <div className="rounded-xl bg-white/[0.04] border border-white/10 p-4 space-y-1.5 text-xs">
            <span className="font-semibold uppercase tracking-wider text-teal-400 text-[10px]">Your Question</span>
            <p className="font-semibold text-white text-sm">{submittedTicket.subject}</p>
            <p className="text-stone-300 whitespace-pre-wrap leading-relaxed">{submittedTicket.message}</p>
          </div>

          {/* Instant Reply Box */}
          {submittedTicket.ai_response ? (
            <div className="bg-gradient-to-b from-[#171A27] to-[#121522] border border-white/15 text-white rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span className="text-xs font-semibold text-stone-200">Harbor Concierge Resolution</span>
                </div>
                <span className="text-[11px] text-teal-300 font-bold uppercase tracking-wider">Instant Reply</span>
              </div>
              <p className="text-sm text-stone-100 whitespace-pre-wrap leading-relaxed">
                {submittedTicket.ai_response}
              </p>
            </div>
          ) : (
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/10 text-center space-y-1">
              <p className="text-sm font-semibold text-white">Your reply is being generated</p>
              <p className="text-xs text-stone-400">
                A full written response will appear in your private inbox in just a few moments.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white rounded-full hover:opacity-95 transition shadow-lg shadow-indigo-500/20"
            >
              <span>View in My Requests</span>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => setSubmittedTicket(null)}
              className="text-xs text-stone-300 hover:text-white font-semibold px-4 py-2 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition"
            >
              Submit Another Request
            </button>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Pills */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
            Select Category
          </label>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(topic => (
              <button
                key={topic}
                type="button"
                onClick={() => handleSelectTopic(topic)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTopic === topic
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white font-semibold shadow-md shadow-indigo-500/20 border border-transparent'
                    : 'bg-white/5 text-stone-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* User Identity Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Your Name <span className="text-teal-400">*</span>
            </label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Alex Vance"
              className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:bg-white/[0.08] focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
              Verified Email
            </label>
            <div className="relative">
              <input
                required
                type="email"
                value={email}
                readOnly
                className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-stone-400 font-mono cursor-not-allowed"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                Verified
              </span>
            </div>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
            Subject <span className="text-teal-400">*</span>
          </label>
          <input
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Brief summary of your question or issue"
            className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:bg-white/[0.08] focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>

        {/* Message / Details */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">
              Details & Context <span className="text-teal-400">*</span>
            </label>
            <span className="text-[11px] text-stone-400">{message.length} characters</span>
          </div>
          <textarea
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Please share all relevant details, error messages, account identifiers, or questions..."
            rows={5}
            className="w-full rounded-2xl border border-white/15 bg-white/[0.04] p-4 text-sm text-white placeholder-stone-500 focus:bg-white/[0.08] focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 transition-all"
          />
        </div>

        {error && (
          <div className="rounded-2xl bg-rose-500/10 border border-rose-500/25 p-3.5 text-xs text-rose-300 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Action bar */}
        <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-white/10">
          <Link
            href="/dashboard"
            className="text-xs text-center sm:text-left text-stone-400 hover:text-white font-medium transition"
          >
            ← Cancel and go to dashboard
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/25 active:scale-98 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Processing Inquiry…</span>
              </>
            ) : (
              <>
                <span>Send Request</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
