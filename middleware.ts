import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CUSTOMER_COOKIE = 'harbor_customer'
const ADMIN_COOKIE = 'harbor_admin'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!request.cookies.get(ADMIN_COOKIE)?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  if (pathname === '/dashboard' || pathname === '/submit') {
    if (!request.cookies.get(CUSTOMER_COOKIE)?.value) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard', '/submit'],
}
