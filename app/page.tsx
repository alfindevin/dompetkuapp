'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Sesuaikan path jika file supabaseClient.ts ada di root atau folder utils
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengecek sesi aktif saat halaman dibuka
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error || !session) {
        // Jika belum login atau token invalid, lempar ke /login
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    // Listener untuk mendeteksi perubahan status auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
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
        style={{ marginTop: '20px', padding: '10px 20px', background: '#ef4444', color: '#white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        Keluar (Logout)
      </button>
    </div>
  );
}
