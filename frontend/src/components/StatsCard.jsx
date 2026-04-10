import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ label, value, icon: Icon, trend, trendValue }) => {
  const isUp = trend === 'up';
  
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-50 relative overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 transition-all duration-500">
      {/* Background decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-slate-50 rounded-full blur-2xl group-hover:bg-blue-50 transition-colors"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] text-slate-500 rounded-2xl flex items-center justify-center shadow-inner group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-500/20 transition-all duration-500">
            <Icon size={26} strokeWidth={2.5} />
          </div>
          
          {trendValue && (
            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-extrabold uppercase tracking-widest transition-all duration-500 ${
              isUp 
                ? 'text-emerald-500 bg-emerald-50 group-hover:bg-emerald-500 group-hover:text-white' 
                : 'text-rose-500 bg-rose-50 group-hover:bg-rose-500 group-hover:text-white'
            }`}>
              {isUp ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
              {isUp ? '+' : '-'}{trendValue}%
            </div>
          )}
        </div>
        
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-extrabold text-[#0f172a] tracking-tight font-display">{value}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
