import React, { useState, useEffect } from 'react';
import { UserSession, Report, Category } from './types';
import UserTab from './components/UserTab';
import AdminTab from './components/AdminTab';
import { ReportService } from './services/api';
import { 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

const LOGO_URL = "https://www.iconpacks.net/icons/1/free-chart-icon-671-thumb.png";

export const USER_REGISTRY: Record<string, string> = {
  "MOHAMAD RODZHKAIRRIE BIN RAMBLI": "860527135113",
  "MUHAMMAD AFIQ HUSAINI BIN AZMI": "970725025289",
  "NURFAZELA BINTI ARNI": "970704135964",
  "WILTONE KENDAWANG ANAK LANGIT": "931114135663",
  "SHAHRUL NIZAM BIN SABLI": "921003135127",
  "STEVEEN ANAK EDIL": "940718136215",
  "KORINA ANAK JANA": "970525135942",
  "MICHELLE UNYI ANAK HARRY": "980814135796",
  "MOHAMAD SAIFUL BIN AMIN": "881103135999",
  "ASRIZAL BIN RAMLI": "950904135741",
  "MOHAMMAD AZEEREN BIN ALADIN": "990916136115",
  "MOHD FADALIE BIN JAPAR": "970115136029"
};

export const ADMIN_REGISTRY: Record<string, string> = {
  "DIDDIE BIN BUJANG": "diddie5187",
  "NUR AFIQAH BINTI HOSSEN": "afiqah5716"
};

export const PPPK_NAMES = Object.keys(USER_REGISTRY);
export const ADMIN_NAMES = Object.keys(ADMIN_REGISTRY);
export const CATEGORIES: Category[] = ['Usahawan', 'Agromakanan', 'Agro TS'];
export const MONTHS = ["Januari", "Februari", "Mac", "April", "Mei", "Jun", "Julai", "Ogos", "September", "Oktober", "November", "Disember"];
export const YEARS = ["2025", "2026", "2027", "2028", "2029", "2030"];
export const PAGE_SIZES = [5, 10, 20, 30, 40, 50];

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('pppk_session');
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncError, setIsSyncError] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [roleSelection, setRoleSelection] = useState<'USER' | 'ADMIN'>('USER');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const result = await ReportService.fetchReports();
      setReports(result.reports);
      setIsSyncError(!result.isLive);
      if (result.isLive) setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      setIsSyncError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const formData = new FormData(e.currentTarget);
    const role = formData.get('role') as 'USER' | 'ADMIN';
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;

    const registry = role === 'ADMIN' ? ADMIN_REGISTRY : USER_REGISTRY;
    if (registry[name] === password) {
      const newSession: UserSession = { role, pppkName: name };
      setSession(newSession);
      localStorage.setItem('pppk_session', JSON.stringify(newSession));
    } else {
      setLoginError(role === 'ADMIN' ? "Kata laluan salah." : "No. IC tidak sah.");
    }
  };

  const handleLogout = () => {
    setSession(null);
    localStorage.removeItem('pppk_session');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center shadow-lg mb-4 p-3 border border-blue-100">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">e-BizTrack</h1>
            <p className="text-slate-500 font-medium">Sistem Laporan Usahawan</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Peranan</label>
              <select 
                name="role" 
                value={roleSelection} 
                onChange={(e) => setRoleSelection(e.target.value as any)} 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all"
              >
                <option value="USER">Pengguna (PPPK)</option>
                <option value="ADMIN">Administrator</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nama Kakitangan</label>
              <select 
                name="name" 
                required 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all"
              >
                <option value="">Sila Pilih Nama</option>
                {(roleSelection === 'ADMIN' ? ADMIN_NAMES : PPPK_NAMES).map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{roleSelection === 'ADMIN' ? 'Kata Laluan' : 'No. IC (Tanpa -)'}</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold transition-all" 
                placeholder="••••••••" 
              />
            </div>
            {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 font-bold animate-pulse"><AlertCircle className="w-4 h-4" /> {loginError}</div>}
            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold hover:bg-blue-700 transform transition-all active:scale-[0.98] shadow-lg shadow-blue-100">Log Masuk</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shadow-sm p-2 border border-blue-100">
              <img src={LOGO_URL} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-xl text-slate-900 hidden sm:block leading-none">e-BizTrack</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${isSyncError ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isSyncError ? 'text-red-500' : 'text-green-600'}`}>{isSyncError ? 'Offline' : 'Online'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex flex-col items-end">
              <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                {session.role === 'ADMIN' ? <ShieldCheck className="w-4 h-4 text-amber-500" /> : <UserCircle className="w-4 h-4 text-blue-500" />}
                {session.pppkName}
              </div>
              {lastSync && <span className="text-[10px] text-slate-400 font-medium">Sync: {lastSync}</span>}
            </div>
            <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Logout">
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {session.role === 'ADMIN' ? (
          <AdminTab reports={reports} onDeleteReport={async (id) => {
            await ReportService.deleteReport(id);
            loadData();
          }} onRefresh={loadData} isRefreshing={isLoading} />
        ) : (
          <UserTab currentUser={session.pppkName!} allReports={reports} onAddReport={async (r) => {
            await ReportService.addReport(r);
            loadData();
          }} />
        )}
      </main>
    </div>
  );
};

export default App;