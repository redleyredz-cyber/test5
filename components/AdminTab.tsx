import React, { useState, useMemo } from 'react';
import { Report } from '../types';
import { PPPK_NAMES, MONTHS, YEARS, CATEGORIES, PAGE_SIZES } from '../App';
import AnalysisCharts from '../AnalysisCharts';
import { 
  Filter, 
  Search, 
  Trash2, 
  Download, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  PieChart, 
  Table as TableIcon,
  AlertCircle,
  RefreshCw,
  Calendar
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface AdminTabProps {
  reports: Report[];
  onDeleteReport: (id: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const AdminTab: React.FC<AdminTabProps> = ({ reports, onDeleteReport, onRefresh, isRefreshing }) => {
  const [activeView, setActiveView] = useState<'table' | 'analysis'>('table');
  const [pppkFilter, setPppkFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchPppk = !pppkFilter || r.pppkName === pppkFilter;
      const matchMonth = !monthFilter || r.month === monthFilter;
      const matchYear = !yearFilter || String(r.year) === String(yearFilter);
      const matchCategory = !categoryFilter || r.category === categoryFilter;
      const matchSearch = !searchTerm || (r.entrepreneurName && r.entrepreneurName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchPppk && matchMonth && matchYear && matchCategory && matchSearch;
    });
  }, [reports, pppkFilter, monthFilter, yearFilter, categoryFilter, searchTerm]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);
  const paginatedReports = filteredReports.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportExcel = () => {
    const dataToExport = filteredReports.map(r => ({
      'Bulan': r.month,
      'Tahun': r.year,
      'PPPK': r.pppkName,
      'Kategori': r.category,
      'Usahawan': r.entrepreneurName,
      'Debit (RM)': r.debit,
      'Kredit (RM)': r.credit,
      'Pendapatan Bersih (RM)': r.netIncome,
      'Tarikh Hantar': new Date(r.submittedAt).toLocaleDateString('ms-MY')
    }));
    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Usahawan");
    XLSX.writeFile(wb, "Laporan_Usahawan_PPPK.xlsx");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">Panel Kawalan Admin</h1>
            <p className="text-gray-500 text-sm font-medium">Urus Dan Pantau Laporan Keseluruhan PPPK</p>
          </div>
          {onRefresh && (
             <button 
              onClick={onRefresh}
              disabled={isRefreshing}
              className={`p-2 rounded-full hover:bg-gray-100 transition-all ${isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-400'}`}
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
          <button 
            onClick={() => setActiveView('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeView === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TableIcon className="w-4 h-4" /> Jadual
          </button>
          <button 
            onClick={() => setActiveView('analysis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${activeView === 'analysis' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <PieChart className="w-4 h-4" /> Analisa
          </button>
        </div>
      </div>

      {activeView === 'table' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 no-print">
            <div className="flex items-center gap-2 mb-4 text-gray-700">
              <Filter className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold">Penapis Carian</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Cari usahawan..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
              </div>
              <select 
                value={pppkFilter}
                onChange={e => setPppkFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
              >
                <option value="">Semua PPPK</option>
                {PPPK_NAMES.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <select 
                value={yearFilter}
                onChange={e => setYearFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Semua Tahun</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <select 
                value={monthFilter}
                onChange={e => setMonthFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Semua Bulan</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              >
                <option value="">Semua Kategori</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={handleExportExcel} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-bold transition-all active:scale-95"><Download className="w-4 h-4" /> Excel</button>
                <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white py-2 px-3 rounded-lg text-sm font-bold transition-all active:scale-95"><Printer className="w-4 h-4" /> Cetak</button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden printable-content">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bulan/Tahun</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">PPPK</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usahawan</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tarikh Hantar</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Bersih (RM)</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center no-print">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedReports.map(report => (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm whitespace-nowrap font-medium text-gray-600">{report.month} {report.year}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{report.pppkName}</td>
                      <td className="px-6 py-4 text-sm"><span className="px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter bg-blue-100 text-blue-700">{report.category}</span></td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-800">{report.entrepreneurName}</td>
                      <td className="px-6 py-4 text-xs whitespace-nowrap text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.submittedAt).toLocaleDateString('ms-MY')}
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-black ${report.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>{report.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="px-6 py-4 text-center no-print">
                        <button onClick={() => setDeleteConfirmId(report.id)} className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <span>Paparan:</span>
                <select value={pageSize} onChange={e => { setPageSize(parseInt(e.target.value)); setCurrentPage(1); }} className="bg-white border border-gray-300 rounded-lg px-2 py-1 outline-none font-bold">
                  {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <span>dari {filteredReports.length} laporan</span>
              </div>
              <div className="flex items-center gap-1">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all"><ChevronLeft className="w-4 h-4" /></button>
                <div className="flex gap-1 px-4 text-sm font-bold text-gray-700">Halaman {currentPage} / {totalPages || 1}</div>
                <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 shadow-sm transition-all"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'analysis' && <AnalysisCharts reports={reports} />}

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="p-4 bg-red-50 rounded-full mb-6"><AlertCircle className="w-10 h-10 text-red-600" /></div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Sahkan Padam?</h3>
              <p className="text-gray-500 text-sm mb-8 font-medium">Tindakan ini tidak boleh diundurkan.</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold transition-all">Batal</button>
                <button onClick={() => { onDeleteReport(deleteConfirmId); setDeleteConfirmId(null); }} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold shadow-lg shadow-red-100 transition-all active:scale-95">Ya, Padam</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTab;