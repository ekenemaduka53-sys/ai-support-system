import '../styles/globals.css'
import React from 'react'

export const metadata = {
  title: 'Harbor — Autonomous Customer Support & AI Concierge',
  description: 'Instant, private customer care platform. Seamlessly resolve inquiries in seconds.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className="min-h-full bg-[#07080B] text-stone-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
        {children}
      </body>
    </html>
  )
}
