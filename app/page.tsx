import Link from 'next/link'

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
              Operations Console
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 tracking-tight">
            Support Intelligence Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Automated tier-1 ticket intake, Gemini AI reply generation, categorical triage, and queue resolution management.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-sm transition active:scale-[0.98]"
          >
            Open Queue →
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition active:scale-[0.98] gap-1.5"
          >
            <span>+</span> New Support Ticket
          </Link>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>AI TRIAGE ENGINE</span>
            <span className="text-indigo-600 font-mono text-[11px] bg-indigo-50 px-1.5 py-0.5 rounded">
              Gemini 3.6 Flash
            </span>
          </div>
          <div className="text-xl font-display font-bold text-slate-900 mt-2">Automated Response</div>
          <p className="text-xs text-slate-500 mt-1">Instant classification of urgency & category upon ticket submission.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>DATABASE SYNC</span>
            <span className="text-emerald-700 font-mono text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded">
              Supabase Postgres
            </span>
          </div>
          <div className="text-xl font-display font-bold text-slate-900 mt-2">Live Realtime Queue</div>
          <p className="text-xs text-slate-500 mt-1">5s polling sync for live updates and instant resolution tracking.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>WORKFLOW EFFICIENCY</span>
            <span className="text-purple-700 font-mono text-[11px] bg-purple-50 px-1.5 py-0.5 rounded">
              Tier-1 Ready
            </span>
          </div>
          <div className="text-xl font-display font-bold text-slate-900 mt-2">One-Click Resolve</div>
          <p className="text-xs text-slate-500 mt-1">Staff can review generated drafts and mark tickets resolved seamlessly.</p>
        </div>
      </div>

      {/* Main Action Hub - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Submit Ticket */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-mono text-sm font-bold border border-indigo-100">
              ✍️
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Submit Customer Request
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create a support request with customer email, subject, and issue description. The AI triage pipeline generates an immediate draft, sets urgency flags, and queues it for review.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Automated Category Tagging (Billing, Tech, Account)
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Multi-tier Urgency Assessment (Low / Med / High)
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition"
            >
              Create New Ticket →
            </Link>
          </div>
        </div>

        {/* Card 2: Manage Support Queue */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-mono text-sm font-bold border border-emerald-100">
              📋
            </div>
            <h2 className="text-lg font-display font-bold text-slate-900">
              Support Queue & Resolution
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Access the live queue to filter tickets by status and urgency, inspect customer queries alongside generated AI responses, and resolve active tickets.
            </p>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Real-time 5-second Auto Refresh
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-600">✓</span> Status filtering (Pending / AI Responded / Resolved)
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center w-full px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-sm transition"
            >
              Open Support Queue →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

