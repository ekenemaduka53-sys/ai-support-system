import dynamic from 'next/dynamic'
import React from 'react'
import Link from 'next/link'

const SupportForm = dynamic(() => import('../../components/SupportForm'), { ssr: false })

export default function SubmitPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Breadcrumb & Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link href="/" className="hover:text-slate-800 transition">
            Overview
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">New Ticket</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
          Create Support Request
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Log a customer issue into the queue. The Gemini AI engine will categorize, assign urgency, and draft a response.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <SupportForm />
      </div>
    </div>
  )
}

