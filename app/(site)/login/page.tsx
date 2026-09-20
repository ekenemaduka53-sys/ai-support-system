import React, { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto text-sm text-stone-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  )
}
