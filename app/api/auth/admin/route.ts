import { NextResponse } from 'next/server'
import {
  ADMIN_COOKIE,
  applySessionCookie,
  clearSessionCookie,
  createAdminToken,
  getAdminCredentials,
  normalizeEmail,
  readAdminSession,
  timingSafeEqualString,
} from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const action = body.action as string | undefined

    if (action === 'logout') {
      const res = NextResponse.json({ ok: true })
      return clearSessionCookie(res, ADMIN_COOKIE)
    }

    const email = normalizeEmail(body.email || '')
    const password = String(body.password || '')
    const creds = getAdminCredentials()

    if (!creds.email || !creds.password) {
      return NextResponse.json(
        { error: 'Admin access is not configured on this server' },
        { status: 500 }
      )
    }

    const emailOk = timingSafeEqualString(email, creds.email)
    const passwordOk = timingSafeEqualString(password, creds.password)

    if (!emailOk || !passwordOk) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = createAdminToken(email)
    const res = NextResponse.json({ ok: true, admin: { email } })
    return applySessionCookie(res, ADMIN_COOKIE, token)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sign-in failed' }, { status: 500 })
  }
}

export async function GET() {
  const admin = readAdminSession()
  if (!admin) {
    return NextResponse.json({ admin: null }, { status: 401 })
  }
  return NextResponse.json({ admin })
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  return clearSessionCookie(res, ADMIN_COOKIE)
}
