import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Cek apakah API Key ada. Jika tidak ada, jangan jalankan Supabase agar tidak crash.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL atau Key hilang di Environment Variables!')
    return NextResponse.next()
  }

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
          // Update request cookies
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          // Update response cookies
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Gunakan try-catch agar jika getUser() gagal, aplikasi tidak crash total
  try {
    const { data: { user } } = await supabase.auth.getUser()

    const isAuthPage = request.nextUrl.pathname === '/login'
    const isProtectedRoute = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard')

    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user && isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  } catch (error) {
    console.error('Middleware Auth Error:', error)
    // Jika error, biarkan user lewat atau lempar ke login agar tidak 500 Internal Server Error
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
