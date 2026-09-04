'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';  // ✅ file di folder yang sama
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange di Supabase v2 otomatis fire event 'INITIAL_SESSION'
    // saat listener dipasang, jadi kita cukup andalkan ini saja
    // tanpa perlu memanggil getSession() secara terpisah.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
        }}
      >
        <p>Memeriksa sesi login...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <h1>Selamat Datang di Dompetku!</h1>
      <p>Anda sudah berhasil masuk.</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push('/login');
        }}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          background: '#ef4444',
          color: '#ffffff', // fix: sebelumnya '#white' (invalid)
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Keluar (Logout)
      </button>
    </div>
  );
}
