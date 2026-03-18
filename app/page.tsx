'use client';

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Clock, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ServerCrash
} from 'lucide-react';

interface Voucher {
  id: string;
  code: string;
  durationHours: number;
  status: 'active' | 'used' | 'expired' | 'unused';
  createdAt: Date;
  expiresAt?: Date;
}

export default function WifiVoucherDashboard() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Generate a random 6-character alphanumeric code
  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed confusing chars like I, 1, O, 0
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const newVoucher: Voucher = {
      id: Math.random().toString(36).substr(2, 9),
      code: generateCode(),
      durationHours: duration,
      status: 'unused',
      createdAt: new Date(),
    };
    setVouchers([newVoucher, ...vouchers]);
  };

  const handleDelete = (id: string) => {
    setVouchers(vouchers.filter(v => v.id !== id));
  };

  const handleSyncToModem = () => {
    setIsSyncing(true);
    setSyncError(null);
    
    // Simulate network request to 192.168.1.1
    setTimeout(() => {
      setIsSyncing(false);
      setSyncError(
        "Koneksi Gagal: Browser memblokir akses ke IP Lokal (192.168.1.1) dari website publik karena alasan keamanan (CORS). Selain itu, modem ZTE bawaan tidak memiliki API untuk sistem voucher."
      );
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar & Header Layout */}
      <div className="flex h-screen overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="p-2 bg-indigo-500 rounded-lg">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">ZTE Voucher</h1>
          </div>
          
          <nav className="flex-1 p-4 space-y-2">
            <a href="#" className="flex items-center gap-3 px-4 py-3 bg-indigo-600/20 text-indigo-400 rounded-xl font-medium">
              <Users className="w-5 h-5" />
              Manajemen Voucher
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Pengaturan Modem
            </a>
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <div className="text-xs text-slate-500 mb-1">IP Modem Target</div>
            <div className="font-mono text-sm text-slate-300 bg-slate-800 px-3 py-2 rounded-lg">
              http://192.168.1.1
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          
          <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Wi-Fi</h2>
              <p className="text-slate-500 mt-1">Kelola akses internet berbatas waktu.</p>
            </div>
            <button 
              onClick={handleSyncToModem}
              disabled={isSyncing}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all disabled:opacity-70"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Menyinkronkan...' : 'Sinkron ke Modem'}
            </button>
          </header>

          {/* Error Message for Sync */}
          {syncError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex gap-4 items-start">
              <ServerCrash className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800">Gagal Menyinkronkan ke Modem ZTE</h3>
                <p className="text-red-600 text-sm mt-1 leading-relaxed">{syncError}</p>
              </div>
              <button onClick={() => setSyncError(null)} className="ml-auto text-red-400 hover:text-red-600">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Technical Limitations Warning */}
          <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex gap-4 items-start shadow-sm">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 text-lg">Peringatan Keterbatasan Teknis Modem ZTE</h3>
              <div className="text-amber-800 text-sm mt-2 space-y-2 leading-relaxed">
                <p>
                  Modem bawaan (seperti ZTE F609/F670) <strong>tidak memiliki fitur Captive Portal (Sistem Voucher)</strong> bawaan.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mengganti password Wi-Fi di modem akan <strong>memutuskan semua pengguna</strong>, bukan hanya 1 pengguna yang habis waktunya.</li>
                  <li>Modem tidak bisa menghapus jaringan Wi-Fi dari HP pengguna secara otomatis.</li>
                  <li>Website ini (berjalan di cloud) tidak bisa mengakses IP lokal <code>192.168.1.1</code> secara langsung karena diblokir oleh browser.</li>
                </ul>
                <p className="font-medium mt-3 text-amber-900">
                  💡 Solusi: Anda memerlukan router tambahan (seperti <strong>Mikrotik</strong>) yang disambungkan ke modem ZTE untuk membuat sistem voucher (Hotspot) yang sebenarnya.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Generate Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" />
                  Buat Voucher Baru
                </h3>
                <form onSubmit={handleCreateVoucher} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Durasi (Jam)
                    </label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value={1}>1 Jam</option>
                      <option value={2}>2 Jam</option>
                      <option value={6}>6 Jam</option>
                      <option value={12}>12 Jam</option>
                      <option value={24}>24 Jam (1 Hari)</option>
                      <option value={168}>168 Jam (7 Hari)</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-colors flex justify-center items-center gap-2"
                  >
                    Generate Kode
                  </button>
                </form>
              </div>
            </div>

            {/* Vouchers List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-500" />
                    Daftar Voucher
                  </h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                    {vouchers.length} Total
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                        <th className="px-6 py-4 font-medium">Kode Voucher</th>
                        <th className="px-6 py-4 font-medium">Durasi</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {vouchers.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                            Belum ada voucher yang dibuat.
                          </td>
                        </tr>
                      ) : (
                        vouchers.map((voucher) => (
                          <tr key={voucher.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-mono font-bold text-lg text-slate-900 tracking-widest bg-slate-100 px-3 py-1 rounded-lg">
                                {voucher.code}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-medium">
                              {voucher.durationHours} Jam
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Belum Dipakai
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => handleDelete(voucher.id)}
                                className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                title="Hapus Voucher"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
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
        </main>
      </div>
    </div>
  );
}
