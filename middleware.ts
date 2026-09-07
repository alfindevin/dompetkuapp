import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAuthPage = pathname === '/login'
  const isProtectedRoute = pathname === '/' || pathname.startsWith('/dashboard')

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next()
  }

  // VERSI READ-ONLY: Kita tidak menggunakan setAll() untuk menghindari crash di Vercel
  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // Biarkan setAll kosong. Kita hanya perlu membaca session,
        // refresh session bisa dilakukan di sisi Client/Page.
        setAll() {},
      },
    }
  )

  try {
    // Hanya ambil data user untuk cek login
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

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
