import dynamic from 'next/dynamic'
import React from 'react'
import Link from 'next/link'

const RequestList = dynamic(() => import('../../components/RequestList'), { ssr: false })

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
            <Link href="/" className="hover:text-slate-800 transition">
              Overview
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Queue</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
            Support Queue Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time customer requests, automated AI triage classifications, and resolution workflow.
          </p>
        </div>

        <Link
          href="/submit"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition active:scale-[0.98]"
        >
          <span>+</span> Submit Ticket
        </Link>
      </div>

      {/* Main Request Stream */}
      <div>
        <RequestList />
      </div>
    </div>
  )
}

