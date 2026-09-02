'useEffect' // gunakan di dalam komponen utama
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

// Di dalam fungsi komponen Anda:
const router = useRouter();
const [session, setSession] = useState(null);

useEffect(() => {
  // Cek apakah user sudah login
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (!session) {
      router.push('/login'); // Jika belum login, arahkan ke halaman /login
    }
  });
}, [router]);
