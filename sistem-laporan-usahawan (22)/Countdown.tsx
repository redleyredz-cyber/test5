
import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let target = new Date(now.getFullYear(), now.getMonth(), 25);
      
      // If today is past the 25th, target next month's 25th
      if (now.getDate() > 25 || (now.getDate() === 25 && now.getHours() >= 23)) {
        target = new Date(now.getFullYear(), now.getMonth() + 1, 25);
      }

      const diff = target.getTime() - now.getTime();
      
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-4 rounded-xl shadow-lg mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Timer className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider">Tarikh Akhir Laporan (25hb)</p>
          <p className="text-lg font-bold">Baki Masa Menghantar Laporan</p>
        </div>
      </div>
      <div className="flex gap-4 text-center">
        <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
          <span className="block text-xl font-bold">{timeLeft.days}</span>
          <span className="text-[10px] uppercase font-bold opacity-70">Hari</span>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
          <span className="block text-xl font-bold">{timeLeft.hours}</span>
          <span className="text-[10px] uppercase font-bold opacity-70">Jam</span>
        </div>
        <div className="bg-white/10 px-3 py-1 rounded-lg backdrop-blur-sm">
          <span className="block text-xl font-bold">{timeLeft.minutes}</span>
          <span className="text-[10px] uppercase font-bold opacity-70">Min</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
