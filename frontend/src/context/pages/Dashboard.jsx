import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import { api } from '../../services/api';
import { useUI }  from '../../context/UIContext';
import {
  Users, Zap, CheckCircle2,
  Download, ArrowUpRight,
  Loader2, TrendingUp, Activity, BarChart2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

const BAR_DATA = [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85];
const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function exportToCSV(data, filename) {
  if (!data?.length) return;
  const keys = Object.keys(data[0]);
  const csv  = [keys.join(','), ...data.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

export default function Dashboard() {
  const { dateRange, addToast } = useUI();
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [executing, setExecuting] = useState(false);

  const leadsValue = Number(stats?.leadsValue ?? 0);
  const dealsValue = Number(stats?.dealsValue ?? 0);
  const totalValue = leadsValue + dealsValue;

  useEffect(() => {
    api.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [dateRange]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = [
        { metric: 'Customers',      value: stats?.customers || 0, period: `Last ${dateRange} days` },
        { metric: 'Active Leads',   value: stats?.leads     || 0, period: `Last ${dateRange} days` },
        { metric: 'Pipeline Value', value: totalValue, period: `Last ${dateRange} days` },
        { metric: 'Pending Tasks',  value: stats?.tasks     || 0, period: `Last ${dateRange} days` },
      ];
      exportToCSV(payload, `clientflow-dashboard-${Date.now()}.csv`);
      addToast('Export complete! File downloaded.', 'success');
    } catch {
      addToast('Export failed. Please try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleExecuteStrategy = async () => {
    // Prevent multiple simultaneous clicks
    if (executing) return;
    
    setExecuting(true);
    console.log('Executing strategy...');
    
    try {
      // Call backend strategy execution endpoint
      const response = await api.executeStrategy();
      
      // Show success message
      addToast(response.message || 'Strategy executed successfully! Velocity optimized.', 'success');
      console.log('Strategy execution completed:', response);
    } catch (error) {
      console.error('Strategy execution error:', error);
      addToast(error.response?.data?.message || 'Strategy execution failed. Please try again.', 'error');
    } finally {
      setExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F5F7FB]">
        <Loader2 className="animate-spin text-blue-600" size={36} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FB]">
      <Sidebar />
      <div className="flex flex-col flex-1 lg:pl-80 min-h-screen">
        <Topbar />

        <main className="flex-1 p-6 lg:p-10 space-y-8">

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-[3px] bg-blue-600 rounded-full" />
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Performance Pulse</p>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none">Overview</h1>
              <p className="text-slate-400 font-semibold mt-3 max-w-md leading-relaxed text-sm">
                Showing data for the last <span className="text-blue-600 font-black">{dateRange} days</span>.
                All primary KPIs are trending above quarterly benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="dark"
                size="md"
                leftIcon={<Download size={16} />}
                loading={exporting}
                onClick={handleExport}
              >
                Export Intelligence
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard label="Total Customers"     value={stats?.customers || 0} icon={Users}        trend="up"   trendValue={0}  iconBg="bg-blue-50"   iconColor="text-blue-600" />
            <StatCard label="Pipeline Liquidity"  value={`${totalValue.toLocaleString()} DH`} icon={Zap} trend="up" trendValue={0} iconBg="bg-violet-50" iconColor="text-violet-600" />
            <StatCard label="Pending Milestones"  value={stats?.tasks || 0}       icon={CheckCircle2} trend="down" trendValue={0}  iconBg="bg-rose-50"   iconColor="text-rose-500" />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Bar Chart */}
            <div className="xl:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart2 size={18} className="text-slate-400" />
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Performance</h3>
                  </div>
                  <p className="text-slate-400 text-sm font-semibold">Revenue across 12-month fiscal period</p>
                </div>
                <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> FY 2026</span>
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> FY 2025</span>
                </div>
              </div>
              
              <div className="flex items-end gap-2 h-64 border-b border-slate-100 pb-4 px-2">
                {BAR_DATA.map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                    <div className="w-full flex items-end justify-center gap-1.5 h-full pb-2">
                      {/* 2025 Bar (Past year reference - faded) */}
                      <div 
                        className="flex-1 rounded-t-lg bg-slate-200 group-hover:bg-slate-300 transition-all duration-300 shadow-sm" 
                        style={{ height: `${Math.max(10, h * 0.65)}%` }}
                        title={`FY 2025: ${Math.round(h * 0.65 * 1000)}k`}
                      />
                      {/* 2026 Bar (Current year - prominent) */}
                      <div 
                        className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-500 group-hover:from-blue-700 group-hover:to-blue-600 shadow-lg shadow-blue-500/30 transition-all duration-300" 
                        style={{ height: `${h}%` }}
                        title={`FY 2026: ${h * 1000}k`}
                      />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-slate-600">{MONTHS[i][0]}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between mt-6 px-2">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">YTD Revenue</p>
                  <p className="text-3xl font-black text-slate-900">{totalValue.toLocaleString()} DH</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Growth vs LY</p>
                  <p className="text-3xl font-black text-emerald-500">+24.5%</p>
                </div>
              </div>
            </div>

            {/* Accelerator Card */}
            <div className="relative bg-slate-950 rounded-[2rem] p-8 flex flex-col justify-between overflow-hidden shadow-2xl shadow-slate-900/30">
              <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-10 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl mb-8 shadow-xl shadow-blue-600/30">
                  <Activity size={12} /> Accelerator Status
                </span>
                <h3 className="text-3xl font-black text-white leading-[1.15] tracking-tight mb-5">
                  Strategic goals are <span className="text-blue-400">on track</span>.
                </h3>
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  Waiting for initial data sets to process pipeline velocity.
                </p>
              </div>

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    <div className="w-9 h-9 rounded-xl border-2 border-slate-950 bg-blue-600 flex items-center justify-center text-[10px] font-black text-white ring-1 ring-white/5">0</div>
                  </div>
                  <p className="text-slate-400 text-xs font-bold">No reps active</p>
                </div>

                <Button
                  variant="secondary"
                  fullWidth
                  size="lg"
                  rightIcon={<ArrowUpRight size={18} />}
                  className="bg-white text-slate-900 hover:bg-slate-50 shadow-xl border-none"
                  onClick={handleExecuteStrategy}
                  loading={executing}
                >
                  <span className="uppercase tracking-widest text-[12px]">Execute Strategy</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-50">
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Recent Activity</h3>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Live feed from your workspace</p>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">View All</Button>
            </div>
            <div className="divide-y divide-slate-50">
              <div className="px-8 py-10 text-center">
                <p className="text-slate-400 text-sm font-bold mt-2">No recent activity.</p>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
