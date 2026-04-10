import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ label, value, icon: Icon, trend, trendValue, iconBg = 'bg-blue-50', iconColor = 'text-blue-600' }) {
  const isUp = trend === 'up';

  return (
    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      {/* Background blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-slate-50 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out" />

      <div className="relative z-10">
        {/* Top row: icon + badge */}
        <div className="flex items-start justify-between mb-8">
          <div className={`w-14 h-14 ${iconBg} ${iconColor} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={24} strokeWidth={2} />
          </div>

          {trendValue !== undefined && (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black ${
              isUp
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-50 text-rose-500'
            }`}>
              {isUp ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              {isUp ? '+' : ''}{trendValue}%
            </div>
          )}
        </div>

        {/* Label + Value */}
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-2">{label}</p>
        <p className="text-4xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      </div>
    </div>
  );
}
