import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { readCustomerSession } from '../../../lib/auth'
import SupportForm from '../../../components/SupportForm'

export const dynamic = 'force-dynamic'

export default function SubmitPage() {
  const customer = readCustomerSession()
  if (!customer) redirect('/login?next=/submit')

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-2">
      {/* Header */}
      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-teal-300 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to My Inbox</span>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          How can we help today?
        </h1>
        <p className="text-sm text-stone-400 leading-relaxed">
          Provide the details of your inquiry. Our autonomous engine will deliver an instant tailored resolution directly to your workspace.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="forethought-glass-card rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <SupportForm />
      </div>
    </div>
  )
}
