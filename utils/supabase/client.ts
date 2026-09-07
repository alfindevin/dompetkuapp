import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    console.error(
      '❌ ERROR: Supabase Environment Variables tidak ditemukan!\n' +
      'Pastikan Anda telah menambahkan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di Vercel Settings.'
    );
    // Melemparkan error yang lebih jelas agar tidak membingungkan
    throw new Error('Missing Supabase Environment Variables');
  }

  return createBrowserClient(url, key)
}
