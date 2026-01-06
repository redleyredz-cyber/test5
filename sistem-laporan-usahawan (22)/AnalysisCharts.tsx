import React, { useMemo } from 'react';
import { Report, Category } from './types';
import { CATEGORIES, MONTHS } from './App';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell,
  PieChart as RechartsPieChart,
  Pie
} from 'recharts';
import { TrendingUp, Users, ShoppingBag, Salad, LayoutDashboard, Calendar } from 'lucide-react';

interface AnalysisChartsProps {
  reports: Report[];
}

const COLORS = ['#3b82f6', '#f59e0b', '#8b5cf6'];

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ reports }) => {
  const now = new Date();
  const currentMonth = MONTHS[now.getMonth()];
  const currentYear = now.getFullYear().toString();

  const categoryStats = useMemo(() => {
    return CATEGORIES.map(cat => {
      const catReports = reports.filter(r => r.category === cat);
      const currentMonthCatReports = catReports.filter(r => 
        r.month === currentMonth && String(r.year) === currentYear
      );
      
      return {
        name: cat,
        currentMonthIncome: currentMonthCatReports.reduce((acc, curr) => acc + curr.netIncome, 0),
        overallIncome: catReports.reduce((acc, curr) => acc + curr.netIncome, 0),
        currentMonthCount: currentMonthCatReports.length,
        overallCount: catReports.length
      };
    });
  }, [reports, currentMonth, currentYear]);

  const getIcon = (cat: Category) => {
    switch (cat) {
      case 'Usahawan': return <ShoppingBag className="w-5 h-5" />;
      case 'Agromakanan': return <Salad className="w-5 h-5" />;
      case 'Agro TS': return <Users className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  const getBgColor = (cat: Category) => {
    switch (cat) {
      case 'Usahawan': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Agromakanan': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Agro TS': return 'bg-purple-50 text-purple-700 border-purple-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-2 no-print">
        <div className="flex items-center gap-2 text-gray-500">
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-sm font-medium">Analisa Prestasi Laporan</span>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          <Calendar className="w-3 h-3" />
          {currentMonth} {currentYear}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categoryStats.map((stat) => (
          <div key={stat.name} className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${getBgColor(stat.name as Category)}`}>
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/60 rounded-xl shadow-inner">{getIcon(stat.name as Category)}</div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">{stat.name}</span>
              </div>
              
              <p className="text-xs opacity-80 mb-1 font-bold">Prestasi Bulan Ini</p>
              <p className="text-2xl font-black mb-2">RM {stat.currentMonthIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              
              <div className="pt-3 border-t border-current/10 flex justify-between items-end">
                <div>
                  <p className="text-[10px] opacity-70 font-bold uppercase">Jumlah Terkumpul</p>
                  <p className="text-sm font-black">RM {stat.overallIncome.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] opacity-70 font-bold uppercase">Laporan</p>
                  <p className="text-sm font-black">{stat.currentMonthCount} / {stat.overallCount}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" /> Agihan Pendapatan ({currentMonth})
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`RM ${value.toLocaleString()}`, 'Bulan Ini']}
                />
                <Bar dataKey="currentMonthIncome" radius={[6, 6, 0, 0]} barSize={40}>
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Komposisi Laporan (Keseluruhan)
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="overallCount"
                  label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                   formatter={(value: any) => [`${value} Laporan`, 'Jumlah Keseluruhan']}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCharts;