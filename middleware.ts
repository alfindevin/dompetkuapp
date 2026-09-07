import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Definisi Halaman
  const isAuthPage = pathname === '/login'
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/dashboard')

  // 2. Setup Supabase Client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  // Buat response sederhana
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Hanya set cookie ke response, hindari pembuatan NextResponse baru di dalam sini
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  try {
    // Cek session user
    const { data: { user } } = await supabase.auth.getUser()

    // A. Jika tidak ada user dan mencoba akses halaman PROTECTED -> lempar ke /login
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // B. Jika ada user dan mencoba akses halaman LOGIN -> lempar ke / (home)
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
