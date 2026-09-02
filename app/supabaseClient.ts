import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vndekdvxrqzoqifccrb.supabase.co';
const supabaseAnonKey = 'sb_publishable_fX0-I0xey_ZOxrhZT0gb8A_3S0FLuEB';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);