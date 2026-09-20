import React, { Suspense } from 'react'
import AdminLoginForm from './AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#111110] flex items-center justify-center text-stone-400 text-sm">
          Loading…
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  )
}
