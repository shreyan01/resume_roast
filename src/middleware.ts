import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Allow access to landing page and signup page without authentication
  if (req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/signup') {
    return res
  }

  // If user is not signed in and trying to access protected routes,
  // redirect to signin
  if (!session && req.nextUrl.pathname !== '/signup') {
    return NextResponse.redirect(new URL('/signup', req.url))
  }

  // If user is signed in and trying to access signin page,
  // redirect to dashboard
  if (session && req.nextUrl.pathname === '/signup') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 