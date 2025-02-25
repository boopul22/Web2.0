import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: async (name) => {
            const cookie = req.cookies.get(name)
            return cookie?.value
          },
          set: async (name, value, options) => {
            res.cookies.set({ name, value, ...options })
          },
          remove: async (name, options) => {
            res.cookies.delete({ name, ...options })
          },
        },
      }
    )

    // Refresh session if expired
    const { data: { session } } = await supabase.auth.getSession()

    // Store the current path in a cookie for the auth layout
    await res.cookies.set('path', req.nextUrl.pathname)

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    return res
  }
}

// Updated matcher to remove admin routes
export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}