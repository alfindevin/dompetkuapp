'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Mode: false = Login, true = Daftar
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // Proses Pendaftaran Akun Baru
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert('Gagal mendaftar: ' + error.message);
      } else {
        alert('Pendaftaran berhasil! Silakan periksa email Anda untuk konfirmasi (jika diaktifkan) atau langsung masuk.');
        setIsSignUp(false); // Pindahkan kembali ke mode login
      }
    } else {
      // Proses Masuk (Login)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert('Gagal masuk: ' + error.message);
      } else {
        router.push('/');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        
        {/* Header Judul Dinamis */}
        <div className="text-center mb-8">
          <span className="text-4xl">💰</span>
          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {isSignUp ? 'Buat Akun DompetKu' : 'Masuk ke DompetKu'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isSignUp ? 'Daftar untuk mulai mencatat keuangan' : 'Silakan masukkan akun keuangan Anda'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="nama@email.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition text-sm shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Memproses...' : (isSignUp ? 'Daftar Sekarang' : 'Masuk')}
          </button>
        </form>

        {/* Tombol Pindah Mode (Login <-> Daftar) */}
        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            {isSignUp ? 'Sudah punya akun? Masuk di sini' : 'Belum punya akun? Daftar mandiri di sini'}
          </button>
        </div>

      </div>
    </div>
  );
}
