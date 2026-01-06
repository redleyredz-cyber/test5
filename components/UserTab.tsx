import React, { useState } from 'react';
import { Report, Category } from '../types';
import { MONTHS, YEARS, CATEGORIES } from '../App';
import Countdown from '../Countdown';
import { Loader2, Send, History, FileText, UploadCloud } from 'lucide-react';

interface UserTabProps {
  currentUser: string;
  allReports: Report[];
  onAddReport: (report: Report) => void;
}

const UserTab: React.FC<UserTabProps> = ({ currentUser, allReports, onAddReport }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    month: MONTHS[new Date().getMonth()],
    year: new Date().getFullYear().toString(),
    category: 'Usahawan' as Category,
    entrepreneurName: '',
    debit: 0,
    credit: 0
  });

  const [file, setFile] = useState<File | null>(null);
  const netIncome = formData.debit - formData.credit;
  const userHistory = allReports.filter(r => r.pppkName === currentUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.entrepreneurName) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newReport: Report = {
      id: crypto.randomUUID(),
      ...formData,
      pppkName: currentUser,
      netIncome,
      submittedAt: new Date().toISOString(),
      documentUrl: file ? URL.createObjectURL(file) : undefined
    };

    onAddReport(newReport);
    setIsSubmitting(false);
    
    setFormData(prev => ({
      ...prev,
      entrepreneurName: '',
      debit: 0,
      credit: 0
    }));
    setFile(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Countdown />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Borang Laporan Bulanan</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bulan Laporan</label>
                  <select 
                    value={formData.month}
                    onChange={e => setFormData(p => ({ ...p, month: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tahun Laporan</label>
                  <select 
                    value={formData.year}
                    onChange={e => setFormData(p => ({ ...p, year: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value as Category }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Usahawan</label>
                  <input 
                    type="text"
                    placeholder="Masukkan nama usahawan"
                    required
                    value={formData.entrepreneurName}
                    onChange={e => setFormData(p => ({ ...p, entrepreneurName: e.target.value }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Debit (RM)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.debit || ''}
                    onChange={e => setFormData(p => ({ ...p, debit: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kredit (RM)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formData.credit || ''}
                    onChange={e => setFormData(p => ({ ...p, credit: parseFloat(e.target.value) || 0 }))}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Untung Bersih</label>
                  <div className={`p-2.5 rounded-lg border font-bold text-center ${netIncome >= 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    RM {netIncome.toFixed(2)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dokumen Sokongan (Imej)</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 font-medium">{file ? file.name : 'Muat naik resit/dokumen'}</p>
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-100"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? 'Menghantar...' : 'Hantar Laporan'}
              </button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-fit overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 bg-gray-50/50">
            <History className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Sejarah Anda</h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto divide-y divide-gray-100">
            {userHistory.length === 0 ? (
              <p className="p-8 text-center text-gray-400 text-sm italic">Tiada rekod ditemui</p>
            ) : (
              userHistory.map(report => (
                <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-900 leading-tight">{report.entrepreneurName}</p>
                      <p className="text-xs text-gray-500 mt-1">{report.month} {report.year}</p>
                    </div>
                    <span className={`text-sm font-bold ${report.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      RM {report.netIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTab;