import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, Search, Command, User, Settings, LogOut, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import { IconButton, Button } from './ui/Button';



const DATE_OPTIONS = [
  { label: 'Last 7 Days', value: 7 },
  { label: 'Last 30 Days', value: 30 },
  { label: 'Last 90 Days', value: 90 },
];

function useOutsideClick(ref, handler) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, [ref, handler]);
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const { dateRange, setDateRange, addToast } = useUI();
  const navigate = useNavigate();

  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const bellRef = useRef(null);
  const dateRef = useRef(null);

  useOutsideClick(bellRef, () => setBellOpen(false));
  useOutsideClick(dateRef, () => setDateOpen(false));

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  const handleLogout = () => {
    logout();
    navigate('/login');
    addToast('You have been signed out.', 'info');
  };

  return (
    <header className="sticky top-0 z-20 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center px-8 gap-6">

      {/* Search */}
      <div className="relative flex-1 max-w-sm group">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors pointer-events-none" />
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full pl-11 pr-16 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 focus:bg-white transition-all"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-white border border-slate-200 px-1.5 py-0.5 rounded-lg shadow-sm pointer-events-none">
          <Command size={10} className="text-slate-400" />
          <span className="text-[10px] font-black text-slate-400">K</span>
        </div>
      </div>

      <div className="flex-1" />

      {/* Date Range Picker */}
      <div className="relative" ref={dateRef}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setDateOpen(o => !o)}
          rightIcon={<ChevronDown size={14} className={`transition-transform ${dateOpen ? 'rotate-180' : ''}`} />}
        >
          Last {dateRange} Days
        </Button>
        {dateOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 p-1.5 min-w-[160px] z-50">
            {DATE_OPTIONS.map(opt => (
              <Button
                key={opt.value}
                variant="ghost"
                onClick={() => { setDateRange(opt.value); setDateOpen(false); addToast(`Date range set to ${opt.label}`, 'info'); }}
                className="w-full justify-between hover:bg-slate-50 transition-colors py-2.5 rounded-xl block px-4"
              >
                <div className="flex items-center justify-between w-[95%]">
                  <span className="font-bold text-slate-700 text-sm">{opt.label}</span>
                  {dateRange === opt.value && <Check size={14} className="text-blue-600" />}
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Bell */}
      <div className="relative" ref={bellRef}>
        <div className="relative">
          <IconButton
            icon={<Bell size={20} strokeWidth={2} />}
            label="Notifications"
            variant="ghost"
            onClick={() => setBellOpen(o => !o)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white pointer-events-none" />
          )}
        </div>

        {bellOpen && (
          <div className="absolute right-0 top-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/50 w-80 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <p className="font-black text-slate-900 text-sm">Notifications</p>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs font-bold text-blue-600 hover:text-blue-700 h-auto py-1 px-2">Mark all read</Button>
            </div>
            <div className="divide-y divide-slate-50">
              {notifications.length === 0 ? (
                <div className="px-5 py-8 text-center text-slate-400 font-bold text-sm">No new notifications</div>
              ) : (
                notifications.map(n => (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${n.unread ? 'bg-blue-50/30' : ''}`}>
                    {n.unread && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                    {!n.unread && <span className="w-2 h-2 rounded-full shrink-0 mt-1.5" />}
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700 leading-snug">{n.text}</p>
                      <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest mt-1">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
