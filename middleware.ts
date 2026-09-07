import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { SUPABASE_CONFIG } from './utils/supabase/config' // Import config

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthPage = pathname === '/login'
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/dashboard')

  const supabaseUrl = SUPABASE_CONFIG.url
  const supabaseKey = SUPABASE_CONFIG.anonKey

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error('Auth Error:', error)
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
