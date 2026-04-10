import { Search, Bell, ChevronDown, Command } from 'lucide-react';
import { IconButton } from './ui/Button';

const Navbar = ({ title }) => {
  return (
    <header className="h-24 glass border-b border-white/40 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-[19]">
      {/* Search Interaction Zone */}
      <div className="flex-1 max-w-xl relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
        </div>
        <input 
          type="text" 
          placeholder="Global search command..." 
          className="w-full pl-12 pr-12 py-3 bg-[#f8fafc]/50 border-2 border-transparent rounded-2xl text-[13px] font-bold placeholder:text-slate-300 focus:outline-none focus:bg-white focus:border-blue-500/20 focus:ring-8 focus:ring-blue-500/5 transition-all shadow-sm"
        />
        <div className="absolute inset-y-0 right-4 flex items-center gap-1.5 pointer-events-none bg-white/50 my-2 px-2 rounded-lg border border-slate-100 shadow-sm">
          <Command size={10} className="text-slate-400 font-bold" />
          <span className="text-[10px] font-extrabold text-slate-400 tracking-tighter">K</span>
        </div>
      </div>
      
      {/* User & Global Actions */}
      <div className="flex items-center gap-6 lg:gap-10">
        <div className="hidden md:flex items-center gap-2 relative">
          <IconButton 
            icon={<Bell size={20} strokeWidth={2.5} />} 
            label="Notifications" 
            variant="ghost" 
            className="text-slate-400 hover:text-blue-600 hover:bg-blue-50"
          />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border-2 border-white shadow-lg animate-pulse pointer-events-none"></span>
        </div>
        
        {/* User Identity Segment */}
        <div className="flex items-center gap-4 pl-10 border-l border-slate-100 group cursor-pointer select-none">
          <div className="text-right hidden sm:block">
            <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight font-display">Alex Sterling</h4>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-[0.15em] mt-1">Enterprise Admin</p>
          </div>
          <div className="relative group/avatar">
            <div className="w-12 h-12 rounded-2xl overflow-hidden ring-4 ring-slate-100/30 group-hover/avatar:ring-blue-500/20 shadow-xl transition-all duration-500">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" 
                alt="Profile" 
                className="w-full h-full object-cover grayscale opacity-90 group-hover/avatar:grayscale-0 group-hover/avatar:scale-110 transition-all duration-700" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm ring-1 ring-emerald-500/20"></div>
          </div>
          <ChevronDown size={14} className="text-slate-300 group-hover:text-blue-500 transition-all group-hover:translate-y-0.5" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
