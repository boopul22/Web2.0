import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => { res.cookies.set({ name, value, ...options }); },
        remove: (name, options) => { res.cookies.delete({ name, ...options }); },
      },
    }
  )

  // Refresh session if expired
  await supabase.auth.getSession()

  // Store the current path in a cookie for the auth layout
  res.cookies.set('path', req.nextUrl.pathname)
  
  return res
}

// Only run middleware on admin routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}