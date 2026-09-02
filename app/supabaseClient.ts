import { createClient } from '@supabase/supabase-js'

// Kunci diambil secara otomatis dari sistem (Environment Variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
