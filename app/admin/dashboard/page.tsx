import React from 'react'
import { redirect } from 'next/navigation'
import { readAdminSession } from '../../../lib/auth'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default function AdminDashboardPage() {
  const admin = readAdminSession()
  if (!admin) redirect('/admin/login')
  return <AdminDashboardClient />
}
