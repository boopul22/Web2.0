import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if expired
  await supabase.auth.getSession()

  // Store the current path in a cookie for the auth layout
  res.cookies.set('path', request.nextUrl.pathname)
  
  return res
}

// Only run middleware on admin routes
export const config = {
  matcher: '/admin/:path*'
}