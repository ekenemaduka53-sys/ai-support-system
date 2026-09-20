import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const CUSTOMER_COOKIE = 'harbor_customer'
export const ADMIN_COOKIE = 'harbor_admin'

const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export type CustomerSession = {
  email: string
  name: string
}

export type AdminSession = {
  email: string
  role: 'admin'
}

function authSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!secret) {
    throw new Error('AUTH_SECRET is not configured')
  }
  return secret
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function signPayload(payload: object) {
  const data = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const sig = crypto.createHmac('sha256', authSecret()).update(data).digest('base64url')
  return `${data}.${sig}`
}

function verifyToken<T>(token: string | undefined | null): T | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [data, sig] = parts
  const expected = crypto.createHmac('sha256', authSecret()).update(data).digest('base64url')
  const sigBuf = Buffer.from(sig)
  const expectedBuf = Buffer.from(expected)
  if (sigBuf.length !== expectedBuf.length) return null
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null
  try {
    return JSON.parse(Buffer.from(data, 'base64url').toString('utf8')) as T
  } catch {
    return null
  }
}

export function createCustomerToken(session: CustomerSession) {
  return signPayload({
    email: normalizeEmail(session.email),
    name: session.name.trim(),
    kind: 'customer',
  })
}

export function createAdminToken(email: string) {
  return signPayload({
    email: normalizeEmail(email),
    role: 'admin',
    kind: 'admin',
  })
}

export function readCustomerSession(): CustomerSession | null {
  const token = cookies().get(CUSTOMER_COOKIE)?.value
  const payload = verifyToken<CustomerSession & { kind?: string }>(token)
  if (!payload?.email) return null
  return { email: normalizeEmail(payload.email), name: payload.name || '' }
}

export function readAdminSession(): AdminSession | null {
  const token = cookies().get(ADMIN_COOKIE)?.value
  const payload = verifyToken<AdminSession & { kind?: string }>(token)
  if (!payload?.email || payload.role !== 'admin') return null
  return { email: normalizeEmail(payload.email), role: 'admin' }
}

export function parseCustomerToken(token: string | undefined | null): CustomerSession | null {
  const payload = verifyToken<CustomerSession & { kind?: string }>(token)
  if (!payload?.email) return null
  return { email: normalizeEmail(payload.email), name: payload.name || '' }
}

export function parseAdminToken(token: string | undefined | null): AdminSession | null {
  const payload = verifyToken<AdminSession & { kind?: string }>(token)
  if (!payload?.email || payload.role !== 'admin') return null
  return { email: normalizeEmail(payload.email), role: 'admin' }
}

export function applySessionCookie(
  response: NextResponse,
  name: string,
  token: string
) {
  response.cookies.set(name, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  })
  return response
}

export function clearSessionCookie(response: NextResponse, name: string) {
  response.cookies.set(name, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}

export function timingSafeEqualString(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  if (left.length !== right.length) {
    crypto.timingSafeEqual(left, Buffer.alloc(left.length))
    return false
  }
  return crypto.timingSafeEqual(left, right)
}

export function getAdminCredentials() {
  const email = normalizeEmail(process.env.ADMIN_EMAIL || 'admin@harbor.internal')
  const password = process.env.ADMIN_PASSWORD || 'harboradmin123'
  return { email, password }
}
