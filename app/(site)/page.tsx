import Link from 'next/link'
import React from 'react'

export default function Home() {
  return (
    <div className="space-y-24 sm:space-y-32 py-4">
      {/* Hero Section */}
      <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Headline & CTAs */}
        <div className="lg:col-span-7 space-y-7 relative z-10">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-purple-500/10 border border-teal-500/25 text-teal-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Autonomous Customer Care Engine</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.8rem] font-display font-extrabold text-white tracking-tight leading-[1.05]">
            Customer support that is instant, personal, and{' '}
            <span className="text-gradient-vibrant">strictly private</span>.
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-stone-300 max-w-xl leading-relaxed font-normal">
            Deliver immediate, personalized resolutions to customer inquiries around the clock. Every conversation is automatically triaged and isolated to your verified workspace.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white text-sm font-bold shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all duration-200 transform active:scale-98"
            >
              <span>Submit a Request</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 text-stone-200 text-sm font-semibold border border-white/10 hover:border-white/20 hover:bg-white/10 backdrop-blur-md transition-all shadow-sm"
            >
              <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Open My Dashboard</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-medium border-t border-white/5">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-stone-300 font-semibold">&lt; 2s response latency</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-stone-300 font-semibold">Row-level customer privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-stone-300 font-semibold">24/7 Always Active</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Forethought-style UI Showcase Card */}
        <div className="lg:col-span-5 relative">
          {/* Subtle Outer Neon Halo */}
          <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-tr from-indigo-500/30 via-purple-500/20 to-teal-400/30 blur-2xl opacity-60"></div>

          <div className="relative rounded-3xl bg-[#0E111A]/90 border border-white/15 p-6 sm:p-7 space-y-5 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
            {/* Console Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 p-0.5">
                  <div className="w-full h-full rounded-full bg-[#0E111A] flex items-center justify-center text-xs font-bold text-white">
                    AV
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">Alex Vance</h3>
                  <p className="text-[11px] text-stone-400">alex@acme.corp</p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Encrypted Session
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-3.5 text-sm">
              {/* User Inquiry */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-4 text-stone-300 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                  <span className="text-stone-400">Customer Inquiry</span>
                  <span>Just now</span>
                </div>
                <p className="text-white text-[13px] leading-relaxed font-medium">
                  "I noticed a duplicate seat allocation on our annual billing statement. Can you review and credit the difference?"
                </p>
              </div>

              {/* Instant Automated Reply */}
              <div className="rounded-2xl bg-gradient-to-b from-[#171A27] to-[#121522] border border-white/15 p-4.5 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between text-[11px] text-stone-400 font-medium border-b border-white/10 pb-2">
                  <span className="flex items-center gap-2 text-white font-semibold">
                    <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                    Harbor Concierge Resolution
                  </span>
                  <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">Instant Reply</span>
                </div>
                <p className="text-stone-200 leading-relaxed text-[13px]">
                  We verified your seat allocations and removed the redundant billing item. A prorated credit statement has been issued directly to your primary payment method.
                </p>
              </div>
            </div>

            {/* Telemetry Footer */}
            <div className="pt-2 flex items-center justify-between text-xs text-stone-400 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-stone-400">
                <svg className="w-3.5 h-3.5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Isolated Customer Workspace
              </span>
              <span className="font-mono text-[11px] text-stone-300">Ticket #HB-8492</span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Performance Banner */}
      <section className="rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 p-8 sm:p-10 backdrop-blur-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          <div className="space-y-1 sm:px-4">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-gradient-vibrant">99.4%</div>
            <p className="text-xs sm:text-sm font-semibold text-white">First-Contact Resolution Rate</p>
            <p className="text-[11px] text-stone-400">Inquiries solved automatically</p>
          </div>
          <div className="space-y-1 pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-white">&lt; 2.4s</div>
            <p className="text-xs sm:text-sm font-semibold text-white">Average Resolution Latency</p>
            <p className="text-[11px] text-stone-400">Zero ticket backlog waiting</p>
          </div>
          <div className="space-y-1 pt-6 sm:pt-0 sm:px-4">
            <div className="text-3xl sm:text-4xl font-display font-extrabold text-gradient-amber">100%</div>
            <p className="text-xs sm:text-sm font-semibold text-white">Customer Data Privacy</p>
            <p className="text-[11px] text-stone-400">Isolated per email identity</p>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">Autonomous Capabilities</p>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Built for enterprise speed, precision, and privacy.
          </h2>
          <p className="text-sm sm:text-base text-stone-400">
            A customer experience suite that resolves questions with superhuman precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="forethought-glass-card rounded-3xl p-7 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-300 flex items-center justify-center font-bold shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Instant Answers</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              No unresolved queue delay. Every customer inquiry is processed instantly with context-aware answers tailored to your exact question.
            </p>
          </div>

          {/* Card 2 */}
          <div className="forethought-glass-card rounded-3xl p-7 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/10 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Strict Row-Level Privacy</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Inquiry history is cryptographically verified to your authenticated email. No user can ever access tickets submitted by other customers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="forethought-glass-card rounded-3xl p-7 space-y-4 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-center font-bold shadow-lg shadow-purple-500/10 group-hover:scale-105 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-display font-bold text-xl text-white">Cross-Platform Sync</h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Experience a dark, uncluttered workspace engineered for smartphones, tablets, laptops, and wide executive command desks.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-indigo-950/80 via-purple-950/60 to-teal-950/80 border border-white/15 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 max-w-2xl space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white">
            Need dedicated support for your account?
          </h2>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Submit your question now to experience instant, concierge support in your private customer workspace.
          </p>
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <Link
              href="/submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-600 to-teal-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition"
            >
              <span>Submit a Request</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-semibold border border-white/10 transition"
            >
              <span>Go to My Dashboard</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
