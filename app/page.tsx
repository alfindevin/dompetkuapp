'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '50px' }}>Memeriksa sesi...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Selamat Datang di Dompetku!</h1>
      <p>Anda berhasil masuk ke dalam aplikasi keuangan.</p>
      <button 
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        style={{ padding: '8px 16px', background: '#ff4d4f', color: '#fff', border: 'none', cursor: 'pointer', marginTop: '20px' }}
      >
        Keluar (Logout)
      </button>
    </div>
  );
}
