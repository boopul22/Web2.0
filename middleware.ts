import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  try {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession()

    console.log('Middleware - Current path:', req.nextUrl.pathname);
    console.log('Middleware - Session exists:', !!session);

    // If accessing admin routes without a session
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
        console.log('Middleware - No session, redirecting to login');
        const redirectUrl = new URL('/login', req.url)
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
      console.log('Middleware - Session exists, allowing admin access');
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }
}

// Updated matcher to remove admin routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api auth routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/auth).*)',
  ],
}