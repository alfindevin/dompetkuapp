'use client';

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { supabase } from './supabaseClient';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DompetKuApp() {
  const [userEmail, setUserEmail] = useState('Pengguna Supabase');
  const [activeTab, setActiveTab] = useState('dashboard');

  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Gaji / Uang Saku', 'Makanan & Minuman', 'Transportasi', 
    'Belanja & Hiburan', 'Tagihan & Utilitas', 'Lain-lain'
  ]);
  const [wallets, setWallets] = useState<any[]>([
    { name: 'Dompet Tunai' }, { name: 'Rekening Bank' }
  ]);
  const [budgets, setBudgets] = useState<Record<string, number>>({});
  const [goals, setGoals] = useState<any[]>([]);
  const [debts, setDebts] = useState<any[]>([]);

  // Form State Transaksi
  const [type, setType] = useState('pemasukan');
  const [walletSource, setWalletSource] = useState('Dompet Tunai');
  const [amount, setAmount] = useState('');
  const [categorySelect, setCategorySelect] = useState('Gaji / Uang Saku');
  const [customCategory, setCustomCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

  // Form State Transfer Dompet
  const [fromWallet, setFromWallet] = useState('Rekening Bank');
  const [toWallet, setToWallet] = useState('Dompet Tunai');
  const [transferAmount, setTransferAmount] = useState('');

  // Form Lainnya
  const [walletName, setWalletName] = useState('');
  const [budgetCat, setBudgetCat] = useState('Makanan & Minuman');
  const [budgetLimit, setBudgetLimit] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');

  // Form Utang-Piutang
  const [debtPerson, setDebtPerson] = useState('');
  const [debtType, setDebtType] = useState('piutang');
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDueDate, setDebtDueDate] = useState('');

  // Ambil data dari Supabase saat aplikasi dibuka
  useEffect(() => {
    fetchDataFromSupabase();
  }, []);

  const fetchDataFromSupabase = async () => {
    try {
      const { data: txData } = await supabase.from('transactions').select('*');
      if (txData) setTransactions(txData);

      const { data: walletData } = await supabase.from('wallets').select('*');
      if (walletData && walletData.length > 0) setWallets(walletData);

      const { data: budgetData } = await supabase.from('budgets').select('*');
      if (budgetData) {
        let bMap: Record<string, number> = {};
        budgetData.forEach((b: any) => { bMap[b.category] = b.limit; });
        setBudgets(bMap);
      }
    } catch (error) {
      console.error('Gagal mengambil data dari Supabase:', error);
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(angka);
  };

  // Tambah Transaksi ke Supabase
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    let finalCategory = categorySelect;
    if (finalCategory === 'TAMBAH_BARU_KATEGORI') {
      finalCategory = customCategory.trim();
    }

    const newTx = { type, wallet: walletSource, amount: Number(amount), category: finalCategory, date };
    
    const { error } = await supabase.from('transactions').insert([newTx]);
    if (error) {
      alert('Gagal menyimpan ke database: ' + error.message);
    } else {
      setAmount('');
      setCustomCategory('');
      fetchDataFromSupabase();
    }
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from('transactions').delete().match({ id });
    if (!error) fetchDataFromSupabase();
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const nominal = Number(transferAmount);
    if (fromWallet === toWallet) {
      alert('Dompet asal dan tujuan tidak boleh sama!');
      return;
    }
    if (nominal <= 0) return;

    const txOut = { type: 'pengeluaran', wallet: fromWallet, amount: nominal, category: `Transfer ke ${toWallet}`, date: new Date().toISOString().split('T')[0] };
    const txIn = { type: 'pemasukan', wallet: toWallet, amount: nominal, category: `Transfer dari ${fromWallet}`, date: new Date().toISOString().split('T')[0] };

    await supabase.from('transactions').insert([txOut, txIn]);
    setTransferAmount('');
    fetchDataFromSupabase();
    alert('Transfer berhasil dicatat ke cloud!');
  };

  const filteredTransactions = transactions.filter(tx => !filterMonth || tx.date.startsWith(filterMonth));
  let totalMasukBulanIni = 0;
  let totalKeluarBulanIni = 0;
  let totalSemuaMasuk = 0;
  let totalSemuaKeluar = 0;

  transactions.forEach(tx => {
    if (tx.type === 'pemasukan') totalSemuaMasuk += Number(tx.amount);
    else totalSemuaKeluar += Number(tx.amount);
  });

  filteredTransactions.forEach(tx => {
    if (tx.type === 'pemasukan') totalMasukBulanIni += Number(tx.amount);
    else totalKeluarBulanIni += Number(tx.amount);
  });

  let savingRate = totalMasukBulanIni > 0 ? ((totalMasukBulanIni - totalKeluarBulanIni) / totalMasukBulanIni) * 100 : 0;
  let healthStatus = { label: 'Belum Ada Data', color: 'bg-slate-100 text-slate-600 border-slate-200', desc: 'Catat pemasukan dan pengeluaran bulan ini untuk melihat analisis.' };
  if (totalMasukBulanIni > 0) {
    if (totalKeluarBulanIni > totalMasukBulanIni) {
      healthStatus = { label: '🔴 Defisit / Boros', color: 'bg-rose-50 text-rose-700 border-rose-200', desc: 'Pengeluaran bulan ini melebihi pemasukan Anda!' };
    } else if (savingRate >= 30) {
      healthStatus = { label: '🟢 Sangat Sehat', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', desc: 'Luar biasa! Anda mampu menabung lebih dari 30% dari pemasukan.' };
    } else {
      healthStatus = { label: '🟡 Cukup Sehat', color: 'bg-amber-50 text-amber-700 border-amber-200', desc: 'Keuangan stabil, pertahankan atau tingkatkan porsi tabungan Anda.' };
    }
  }

  let kategoriPengeluaranMap: Record<string, number> = {};
  categories.forEach(cat => kategoriPengeluaranMap[cat] = 0);
  filteredTransactions.forEach(tx => {
    if (tx.type === 'pengeluaran') {
      kategoriPengeluaranMap[tx.category] = (kategoriPengeluaranMap[tx.category] || 0) + Number(tx.amount);
    }
  });

  const chartData = {
    labels: Object.keys(kategoriPengeluaranMap),
    datasets: [{
      data: Object.values(kategoriPengeluaranMap),
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
      borderWidth: 0
    }]
  };

  return (
    <div className="bg-slate-100 min-h-screen pb-16 text-slate-800">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">💰</span>
          <span className="font-bold text-lg text-slate-800">DompetKu Ultimate (Supabase Cloud)</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">🟢 Terhubung ke Cloud</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 mt-4">
        <div className="flex space-x-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 overflow-x-auto">
          <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Dashboard & Transaksi</button>
          <button onClick={() => setActiveTab('wallets')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${activeTab === 'wallets' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Multi-Dompet & Transfer</button>
          <button onClick={() => setActiveTab('budgets')} className={`px-4 py-2 rounded-xl text-sm font-semibold transition whitespace-nowrap ${activeTab === 'budgets' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>Batas Anggaran</button>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-2xl border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${healthStatus.color}`}>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider opacity-75">Analisis Kesehatan Keuangan (Cloud)</p>
                <h3 className="text-xl font-bold mt-1">{healthStatus.label}</h3>
                <p className="text-sm mt-0.5 opacity-90">{healthStatus.desc}</p>
              </div>
              <div className="text-right bg-white/60 px-4 py-2 rounded-xl border border-black/5">
                <p className="text-xs font-semibold uppercase opacity-70">Rasio Tabungan</p>
                <p className="text-lg font-bold">{savingRate.toFixed(1)}%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4 md:col-span-1">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Total Saldo Global</p>
                  <h2 className="text-2xl font-bold text-slate-800 mt-1">{formatRupiah(totalSemuaMasuk - totalSemuaKeluar)}</h2>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Pemasukan Bulan Ini</p>
                  <h2 className="text-xl font-bold text-emerald-600 mt-1">{formatRupiah(totalMasukBulanIni)}</h2>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-400 font-semibold uppercase">Pengeluaran Bulan Ini</p>
                  <h2 className="text-xl font-bold text-rose-600 mt-1">{formatRupiah(totalKeluarBulanIni)}</h2>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2 flex flex-col justify-center items-center">
                <h3 className="text-sm font-bold text-slate-600 uppercase mb-2 w-full text-left">Statistik Pengeluaran per Kategori</h3>
                <div className="w-full h-64 flex justify-center items-center relative">
                  <Doughnut data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Tambah Transaksi Baru (Tersimpan ke Cloud)</h3>
              <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">TIPE</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    <option value="pemasukan">Pemasukan</option>
                    <option value="pengeluaran">Pengeluaran</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">DOMPET</label>
                  <select value={walletSource} onChange={(e) => setWalletSource(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm">
                    {wallets.map((w, idx) => <option key={idx} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">NOMINAL (RP)</label>
                  <input type="number" required value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Contoh: 50000" className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">KATEGORI</label>
                  <select value={categorySelect} onChange={(e) => setCategorySelect(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm mb-1">
                    {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
                    <option value="TAMBAH_BARU_KATEGORI">+ Tambah Kategori Baru...</option>
                  </select>
                  {categorySelect === 'TAMBAH_BARU_KATEGORI' && (
                    <input type="text" required value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Ketik kategori..." className="w-full px-3 py-2 border rounded-lg text-sm" />
                  )}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">TANGGAL</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm" />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition text-sm">Simpan</button>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-lg font-bold text-slate-800">Riwayat Transaksi (Cloud Database)</h3>
                <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="px-3 py-1.5 border rounded-lg text-sm text-slate-600" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b text-xs text-slate-400 uppercase">
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Dompet</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Tipe</th>
                      <th className="py-3 px-4">Nominal</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-700">
                    {filteredTransactions.length === 0 ? (
                      <tr><td colSpan={6} className="text-center text-slate-400 py-6">Belum ada transaksi di database cloud.</td></tr>
                    ) : (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={idx} className="border-b hover:bg-slate-50 transition">
                          <td className="py-3 px-4 text-slate-500 text-xs">{tx.date}</td>
                          <td className="py-3 px-4 font-semibold text-slate-600">{tx.wallet || 'Dompet Tunai'}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{tx.category}</td>
                          <td className="py-3 px-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${tx.type === 'pemasukan' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{tx.type}</span></td>
                          <td className={`py-3 px-4 font-semibold ${tx.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.type === 'pemasukan' ? '+' : '-'} {formatRupiah(tx.amount)}</td>
                          <td className="py-3 px-4 text-center"><button onClick={() => deleteTransaction(tx.id)} className="text-slate-400 hover:text-rose-600 text-xs font-semibold">Hapus</button></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Transfer Antar-Dompet</h3>
              <form onSubmit={handleTransfer} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <select value={fromWallet} onChange={(e) => setFromWallet(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                    {wallets.map((w, i) => <option key={i} value={w.name}>Dari: {w.name}</option>)}
                  </select>
                  <select value={toWallet} onChange={(e) => setToWallet(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
                    {wallets.map((w, i) => <option key={i} value={w.name}>Ke: {w.name}</option>)}
                  </select>
                </div>
                <div className="flex gap-2">
                  <input type="number" required value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} placeholder="Nominal Transfer (Rp)" className="flex-1 px-4 py-2 border rounded-lg text-sm" />
                  <button type="submit" className="bg-emerald-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-emerald-700 text-sm">Transfer</button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {wallets.map((w, idx) => {
                let bal = 0;
                transactions.forEach(tx => {
                  if ((tx.wallet || 'Dompet Tunai') === w.name) {
                    if (tx.type === 'pemasukan') bal += Number(tx.amount);
                    else bal -= Number(tx.amount);
                  }
                });
                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase">Dompet / Rekening</p>
                      <h4 className="text-lg font-bold text-slate-800 mt-1">{w.name}</h4>
                    </div>
                    <p className="text-sm font-bold text-blue-600">{formatRupiah(bal)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Pengaturan Batas Anggaran</h3>
            <p className="text-sm text-slate-500">Fitur anggaran terhubung otomatis dengan database Supabase Anda.</p>
          </div>
        )}
      </main>
    </div>
  );
}