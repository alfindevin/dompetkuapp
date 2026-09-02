import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ambil URL saat ini
  const url = request.clone();
  
  // Contoh pengecekan sederhana: 
  // Jika Anda ingin mengarahkan halaman utama (/) langsung ke /login sementara waktu
  if (url.pathname === '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang ingin dicegat oleh middleware
export const config = {
  matcher: ['/'], // Untuk saat ini, arahkan root (/) ke /login
};
