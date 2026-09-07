'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface Transaction {
  id: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  description: string;
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalBalance = totalIncome - totalExpense;

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;

    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('Anda harus login untuk menambah transaksi');
      }

      const { error } = await supabase.from('transactions').insert([
        {
          user_id: user.id,
          amount: parseFloat(amount),
          category,
          type,
          description,
          date: new Date().toISOString().split('T')[0],
        },
      ]);

      if (error) throw error;

      setAmount('');
      setCategory('');
      setDescription('');
      await fetchTransactions();
    } catch (error: any) {
      alert('Gagal menambah transaksi: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 animate-pulse">Memuat data keuangan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Keuangan</h1>
            <p className="text-slate-500">Catat dan pantau arus kas Anda.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Saldo</p>
            <h2 className={`text-3xl font-bold mt-1 ${totalBalance >= 0 ? 'text-slate-800' : 'text-red-600'}`}>
              Rp {totalBalance.toLocaleString('id-ID')}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Pemasukan</p>
            <h2 className="text-3xl font-bold text-green-600 mt-1">
              Rp {totalIncome.toLocaleString('id-ID')}
            </h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Pengeluaran</p>
            <h2 className="text-3xl font-bold text-red-600 mt-1">
              Rp {totalExpense.toLocaleString('id-ID')}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Tambah Transaksi</h3>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setType('income')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Pemasukan
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('expense')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition ${type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Pengeluaran
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Jumlah (Rp)</label>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Kategori</label>
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Keterangan</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none" rows={3} />
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-xl font-bold transition shadow-lg ${type === 'income' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} disabled:opacity-50`}>
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </form>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3">Kategori</th>
                      <th className="px-6 py-3">Keterangan</th>
                      <th className="px-6 py-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactions.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-slate-400">Belum ada transaksi.</td></tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="px-6 py-4 text-sm text-slate-600">{t.date}</td>
                          <td className="px-6 py-4"><span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-600">{t.category}</span></td>
                          <td className="px-6 py-4 text-sm text-slate-500">{t.description || '-'}</td>
                          <td className={`px-6 py-4 text-sm font-bold text-right ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'} Rp {t.amount.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
