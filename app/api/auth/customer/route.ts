import { NextResponse } from 'next/server'
import {
  CUSTOMER_COOKIE,
  applySessionCookie,
  clearSessionCookie,
  createCustomerToken,
  normalizeEmail,
  readCustomerSession,
} from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = normalizeEmail(body.email || '')
    const name = String(body.name || '').trim()
    const action = body.action as string | undefined

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true })
      return clearSessionCookie(res, CUSTOMER_COOKIE)
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 })
    }

    const token = createCustomerToken({ email, name: name || email.split('@')[0] })
    const res = NextResponse.json({
      ok: true,
      customer: { email, name: name || email.split('@')[0] },
    })
    return applySessionCookie(res, CUSTOMER_COOKIE, token)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sign-in failed' }, { status: 500 })
  }
}

export async function GET() {
  const customer = readCustomerSession()
  if (!customer) {
    return NextResponse.json({ customer: null }, { status: 401 })
  }
  return NextResponse.json({ customer })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  return clearSessionCookie(res, CUSTOMER_COOKIE)
}
