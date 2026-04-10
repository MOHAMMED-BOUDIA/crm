import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Target, Handshake,
  Plus, HelpCircle, ChevronRight, CheckSquare, Settings
} from 'lucide-react';
import Logo from './Logo';
import { Button } from './ui/Button';
import SupportModal from './modals/SupportModal';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/customers', icon: Users, label: 'Customers' },
  { path: '/leads', icon: Target, label: 'Leads' },
  { path: '/deals', icon: Handshake, label: 'Deals' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-slate-950 to-slate-900 z-30 border-r border-white/5">

        {/* Brand */}
        <div className="px-8 pt-10 pb-8">
          <Logo size="md" withText={true} theme="dark" text="CRM Pro" option="A" />
          <div className="flex items-center gap-1.5 mt-2 pl-14">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Workspace</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-4">Main Menu</p>
          <div className="space-y-1">
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group
                   ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`p-1.5 rounded-xl transition-colors shrink-0 ${isActive ? 'bg-white/15' : 'group-hover:bg-white/5'}`}>
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span className="font-bold text-[14px] flex-1">{label}</span>
                    {isActive && <ChevronRight size={15} className="text-blue-200 shrink-0" />}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* Support card */}
        <div className="px-5 mb-4">
          <div className="bg-slate-800/60 border border-white/5 rounded-3xl p-5">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0">
                <HelpCircle size={15} className="text-blue-400" />
              </div>
              <p className="text-white font-bold text-sm">Need Support?</p>
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-4">
              Access our knowledge base or speak with a specialist.
            </p>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={() => setSupportOpen(true)}
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl py-2.5"
            >
              Open Center
            </Button>
          </div>
        </div>

      </aside>

      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
