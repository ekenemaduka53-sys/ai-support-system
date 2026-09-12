import '../styles/globals.css'
import React from 'react'
import AppHeader from '../components/AppHeader'

export const metadata = {
  title: 'AI Support Operations',
  description: 'Internal customer support console with automated AI triage and response',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-slate-50 antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full font-sans text-slate-800 bg-slate-50 selection:bg-slate-900 selection:text-white">
        <div className="min-h-screen flex flex-col">
          {/* Top Responsive Application Header */}
          <AppHeader />

          {/* Main Content Area */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-3.5 sm:px-6 py-5 sm:py-8">
            {children}
          </main>

          {/* Minimal Internal Footer */}
          <footer className="border-t border-slate-200/80 bg-white/60 py-4 px-4 text-center text-xs text-slate-400 font-mono">
            AI Support Operations Console • Gemini 3.6 Flash & Supabase Engine
          </footer>
        </div>
      </body>
    </html>
  )
}


