export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Keuangan</h1>
          <p className="text-slate-500">Ringkasan pengeluaran dan pemasukan Anda.</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Total Saldo</p>
            <h2 className="text-2xl font-bold text-slate-800 mt-1">Rp 0</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Pemasukan Bulan Ini</p>
            <h2 className="text-2xl font-bold text-green-600 mt-1">Rp 0</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-sm font-medium text-slate-500 uppercase">Pengeluaran Bulan Ini</p>
            <h2 className="text-2xl font-bold text-red-600 mt-1">Rp 0</h2>
          </div>
        </div>
        <div className="mt-10 p-12 bg-blue-50 rounded-3xl border-2 border-dashed border-blue-200 text-center">
          <p className="text-blue-600 font-medium">🚀 Modul pencatatan transaksi sedang dikembangkan. Tunggu ya!</p>
        </div>
      </div>
    </div>
  );
}
