import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Target, Handshake,
  Plus, HelpCircle, ChevronRight, CheckSquare, Settings, LogOut,
  Search, Zap, TrendingUp, Bell, Clock, ChevronDown, Home
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUI } from '../context/UIContext';
import Logo from './Logo';
import { Button } from './ui/Button';
import SupportModal from './modals/SupportModal';

const NAV_SECTIONS = [
  {
    section: 'Core',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', shortcut: '⌘D' },
      { path: '/tasks', icon: CheckSquare, label: 'Tasks', shortcut: '⌘T', badge: '5' },
    ]
  },
  {
    section: 'Sales',
    items: [
      { path: '/customers', icon: Users, label: 'Customers', shortcut: '⌘C', badge: '24' },
      { path: '/leads', icon: Target, label: 'Leads', shortcut: '⌘L', badge: '12', highlight: true },
      { path: '/deals', icon: Handshake, label: 'Deals', shortcut: '⌘E' },
    ]
  },
  {
    section: 'System',
    items: [
      { path: '/settings', icon: Settings, label: 'Settings', shortcut: '⌘,' },
    ]
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const { addToast } = useUI();
  const navigate = useNavigate();
  const [supportOpen, setSupportOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSection, setExpandedSection] = useState('Core');

  const handleLogout = () => {
    logout();
    navigate('/login');
    addToast('Successfully signed out.', 'info');
  };

  const filteredSections = searchQuery
    ? NAV_SECTIONS.map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(s => s.items.length > 0)
    : NAV_SECTIONS;

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-30 border-r border-white/5 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl animate-pulse opacity-50" />
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full overflow-hidden">

          {/* Header with Profile */}
          <div className="px-5 pt-6 pb-4 border-b border-white/5 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <Logo size="md" withText={true} theme="dark" text="CRM Pro" option="A" />
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.1em]">Live</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-5 py-3.5 border-b border-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-2.5 group hover:bg-blue-600/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} className="text-blue-400" />
                  <p className="text-[9px] font-bold text-slate-400">Pipeline</p>
                </div>
                <p className="text-xs font-black text-blue-300">245K DH</p>
              </div>
              <div className="bg-violet-600/10 border border-violet-600/20 rounded-xl p-2.5 group hover:bg-violet-600/15 transition-all">
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={12} className="text-violet-400" />
                  <p className="text-[9px] font-bold text-slate-400">Active</p>
                </div>
                <p className="text-xs font-black text-violet-300">18</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(148, 163, 184, 0.2) transparent' }}>
            {filteredSections.map((section, idx) => (
              <div key={idx} className="mb-2">
                {/* Section Header */}
                <button
                  onClick={() => setExpandedSection(expandedSection === section.section ? null : section.section)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-2 rounded-lg hover:bg-white/5 transition-all group"
                >
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] group-hover:text-slate-400">
                    {section.section}
                  </p>
                  <ChevronDown
                    size={14}
                    className={`text-slate-600 group-hover:text-slate-400 transition-transform ${
                      expandedSection === section.section ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Menu Items */}
                {expandedSection === section.section && (
                  <div className="space-y-1.5">
                    {section.items.map(({ path, icon: Icon, label, shortcut, badge, highlight }) => (
                      <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden
                           ${isActive
                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25'
                            : highlight
                            ? 'bg-gradient-to-r from-orange-600/20 to-red-600/20 text-slate-300 hover:from-orange-600/30 hover:to-red-600/30 hover:text-white border border-orange-600/20'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {/* Icon Background */}
                            <div className={`p-2 rounded-lg transition-all shrink-0 ${
                              isActive
                                ? 'bg-white/20'
                                : highlight
                                ? 'bg-orange-600/20 group-hover:bg-orange-600/30'
                                : 'group-hover:bg-white/5'
                            }`}>
                              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {/* Label */}
                            <span className="font-bold text-[13px] flex-1">{label}</span>

                            {/* Badge */}
                            {badge && (
                              <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                                isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                {badge}
                              </span>
                            )}

                            {/* Shortcut Hint */}
                            {isActive && shortcut && (
                              <span className="text-[9px] font-bold text-blue-200 opacity-75">{shortcut}</span>
                            )}

                            {/* Active Indicator */}
                            {isActive && (
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-lg" />
                            )}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Support Card */}
          <div className="px-5 pt-3 pb-3 border-t border-white/5 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-blue-600/10 to-violet-600/10 border border-blue-600/20 rounded-2xl p-4 group hover:from-blue-600/15 hover:to-violet-600/15 transition-all">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 flex items-center justify-center shrink-0 group-hover:bg-blue-600/30 transition-all">
                  <HelpCircle size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Support Hub</p>
                  <p className="text-slate-400 text-xs mt-0.5">Get help instantly</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => setSupportOpen(true)}
                className="bg-blue-600/20 border border-blue-600/40 text-blue-300 hover:bg-blue-600/30 text-[10px] font-black uppercase tracking-[0.1em] rounded-lg"
              >
                Contact Support
              </Button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-5 pb-5 border-t border-white/5 backdrop-blur-sm">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-all duration-200 group font-bold text-[13px] border border-transparent hover:border-rose-500/20"
            >
              <div className="p-2 rounded-lg bg-rose-500/10 group-hover:bg-rose-500/20 transition-all">
                <LogOut size={16} strokeWidth={2} />
              </div>
              <span>Sign Out</span>
            </button>
          </div>

        </div>
      </aside>

      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </>
  );
}
