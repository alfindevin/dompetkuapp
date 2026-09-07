'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  // Gunakan state untuk menyimpan client agar tidak diinisialisasi saat build-time
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Inisialisasi client HANYA setelah komponen mount di browser
    const client = createClient();
    setSupabase(client);
  }, []);

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Tampilkan loading singkat sampai supabase client siap
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-10 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
            👋
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Selamat Datang!</h1>
          <p className="text-slate-500 mt-2">Anda berhasil masuk ke DompetKu. Kelola keuanganmu dengan lebih bijak hari ini.</p>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <button onClick={() => router.push('/dashboard')} className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            Buka Dashboard
          </button>
          <button onClick={handleLogout} className="w-full py-3 px-4 bg-white text-red-500 border border-red-100 rounded-xl font-semibold hover:bg-red-50 transition-all">
            Keluar (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}
