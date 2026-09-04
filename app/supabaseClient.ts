import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vndekdvxrqqzoqifccrb.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZuZGVrZHZ4cnFxem9xaWZjY3JiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMjM1ODIsImV4cCI6MjEwMzc5OTU4Mn0.M7v6oURP_KDSAoaOlVpWMlq5YNAjxrefrzvwaF59K0Y' // Ganti string ini dengan anon key asli Anda jika ingin aman secara hardcode sementara

export const supabase = createClient(supabaseUrl, supabaseKey)
