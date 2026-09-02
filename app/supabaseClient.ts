import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vndekdvxrqqzoqifccrb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_fX0-I0xey_ZOxrhZT0gb8A_3S0FLuEB'; // masukkan anon key Anda yang asli di sini atau biarkan pakai process.env

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
