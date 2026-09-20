import { NextResponse } from 'next/server'
import { readAdminSession, readCustomerSession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  const customer = readCustomerSession()
  const admin = readAdminSession()
  return NextResponse.json({
    customer: customer ? { email: customer.email, name: customer.name } : null,
    admin: admin ? { email: admin.email } : null,
  })
}
