import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { readCustomerSession } from '../../../lib/auth'
import CustomerRequestList from '../../../components/CustomerRequestList'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const customer = readCustomerSession()
  if (!customer) redirect('/login?next=/dashboard')

  const displayName = customer.name || customer.email.split('@')[0]
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <div className="space-y-8 py-2">
      {/* Dashboard Top Header */}
      <div className="forethought-glass-card rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-teal-400 text-white flex items-center justify-center font-display font-bold text-lg shadow-lg shadow-indigo-500/25">
            {initials}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                Welcome, {displayName}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Customer Session
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-400">
              Personal Support Inbox · <span className="font-mono text-teal-300">{customer.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white text-xs font-bold uppercase tracking-wider hover:opacity-95 transition shadow-lg shadow-indigo-500/25 active:scale-98"
          >
            <span>New Support Request</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Ticket List Component */}
      <CustomerRequestList />
    </div>
  )
}

