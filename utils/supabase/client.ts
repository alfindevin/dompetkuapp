import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIG } from './config'

export function createClient() {
  const url = SUPABASE_CONFIG.url
  const key = SUPABASE_CONFIG.anonKey

  if (!url || !key) {
    throw new Error('Supabase Configuration missing!');
  }

  return createBrowserClient(url, key)
}
