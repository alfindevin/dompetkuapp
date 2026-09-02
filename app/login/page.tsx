'use client';

import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Gagal login: ' + error.message);
    } else {
      router.push('/'); // Mengarahkan ke halaman utama setelah sukses login
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Login Dompetku</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <label style={{ display: 'block', marginBottom: 5 }}>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading} 
          style={{ width: '100%', padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}
