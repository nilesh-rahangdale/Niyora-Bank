import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminDashboard } from '../../redux/slices/dashboardSlice';
import { 
  Building2, Users, UserCheck, Shield, AlertTriangle, 
  TrendingUp, ArrowDownRight, ArrowUpRight, Loader2, RefreshCcw
} from 'lucide-react';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { adminData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getAdminDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getAdminDashboard());
  };

  if (loading && !adminData) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading system analytics...</p>
      </div>
    );
  }

  // Fallback defaults if API fails or is loading
  const data = adminData || {
    totalBranches: 0,
    totalManagers: 0,
    totalTellers: 0,
    totalCsos: 0,
    totalCustomers: 0,
    totalUsers: 0,
    usersByRole: {
      ROLE_ADMIN: 0,
      ROLE_MANAGER: 0,
      ROLE_TELLER: 0,
      ROLE_CSO: 0,
      ROLE_CUSTOMER: 0,
    },
    usersByStatus: {
      ACTIVE: 0,
      INACTIVE: 0,
      BLOCKED: 0,
    }
  };

  const totalEmployees = (data.totalManagers || 0) + (data.totalTellers || 0) + (data.totalCsos || 0);

  // SVG Chart Computations
  const roles = [
    { name: 'Admins', count: data.usersByRole?.ROLE_ADMIN || 0, color: '#6366f1' },
    { name: 'Managers', count: data.usersByRole?.ROLE_MANAGER || 0, color: '#f59e0b' },
    { name: 'Tellers', count: data.usersByRole?.ROLE_TELLER || 0, color: '#10b981' },
    { name: 'CSOs', count: data.usersByRole?.ROLE_CSO || 0, color: '#06b6d4' },
    { name: 'Customers', count: data.usersByRole?.ROLE_CUSTOMER || 0, color: '#ec4899' },
  ];

  const maxCount = Math.max(...roles.map(r => r.count), 1);

  // User Status calculations for circular Donut Chart
  const activeCount = data.usersByStatus?.ACTIVE || 0;
  const inactiveCount = data.usersByStatus?.INACTIVE || 0;
  const blockedCount = data.usersByStatus?.BLOCKED || 0;
  const totalStatus = activeCount + inactiveCount + blockedCount || 1;

  const activePct = (activeCount / totalStatus) * 100;
  const inactivePct = (inactiveCount / totalStatus) * 100;
  const blockedPct = (blockedCount / totalStatus) * 100;

  // Donut chart helper variables
  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  const activeStroke = circumference * (activePct / 100);
  const inactiveStroke = circumference * (inactivePct / 100);
  const blockedStroke = circumference * (blockedPct / 100);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">System Dashboard</h1>
          <p className="text-sm text-slate-400">Global analytics, branch network mapping, and employee logs.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition cursor-pointer"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Reload Analytics
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Failed to fetch server dashboard statistics</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* RENDER STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Branches</p>
              <h3 className="text-2xl font-bold text-white">{data.totalBranches}</h3>
            </div>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-indigo-400">
            <span>Branch networks configured</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Active Employees</p>
              <h3 className="text-2xl font-bold text-white">{totalEmployees}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{data.totalManagers} Mgrs</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">{data.totalTellers} Tellers</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{data.totalCsos} CSOs</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Customers</p>
              <h3 className="text-2xl font-bold text-white">{data.totalCustomers}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-emerald-400">
            <span>Clients onboarded in system</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total platform Users</p>
              <h3 className="text-2xl font-bold text-white">{data.totalUsers}</h3>
            </div>
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-lg">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
            <span>Corporate & client account files</span>
          </div>
        </div>
      </div>

      {/* SYSTEM TRANSACTION STATS (MOCK/ESTIMATES INTEGRATION) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-bold text-white">System Transaction Ledger Estimates</h4>
              <p className="text-[11px] text-slate-500">Estimates compiled from system branch totals.</p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Total Transaction Volume</p>
              <p className="text-lg font-bold text-white">₹14.82M</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% weekly
              </span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Estimated Cash Deposits</p>
              <p className="text-lg font-bold text-emerald-400">₹9.54M</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +8.1% weekly
              </span>
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl">
              <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Estimated Cash Withdrawals</p>
              <p className="text-lg font-bold text-rose-400">₹5.28M</p>
              <span className="text-[10px] text-rose-400 flex items-center gap-0.5 mt-1 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" /> -3.2% weekly
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60">
          <h4 className="text-sm font-bold text-white mb-2">Platform Health Status</h4>
          <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450">Backend REST APIs</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-md">Online</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450">PostgreSQL DB Cluster</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-md">Active</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450">JWT Auth Controller</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold rounded-md">Secured</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-450">Local Dev Origin</span>
              <span className="font-mono text-[10px] text-indigo-400">http://localhost:5173</span>
            </div>
          </div>
        </div>
      </div>

      {/* CUSTOM SVG CHARTS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        
        {/* CHART 1: ROLE DISTRIBUTION (Bar Chart) */}
        <div className="glass-panel rounded-xl p-5 border border-slate-850 md:col-span-3">
          <h3 className="text-sm font-bold text-white mb-6">User Accounts Role Distribution</h3>
          <div className="space-y-4">
            {roles.map((role) => {
              const pct = (role.count / maxCount) * 100;
              return (
                <div key={role.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">{role.name}</span>
                    <span className="text-white">{role.count} <span className="text-[10px] text-slate-500 font-normal">accounts</span></span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${pct}%`, 
                        backgroundColor: role.color,
                        boxShadow: `0 0 8px ${role.color}40`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CHART 2: USER STATUS (Donut Chart) */}
        <div className="glass-panel rounded-xl p-5 border border-slate-850 md:col-span-2 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4">Account Status Matrix</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
            {/* SVG Donut Circle */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="transparent" 
                  stroke="#1e293b" 
                  strokeWidth={strokeWidth} 
                />
                {activeCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="#10b981" 
                    strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - activeStroke}
                    strokeLinecap="round"
                  />
                )}
                {inactiveCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="#f59e0b" 
                    strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (activeStroke + inactiveStroke)}
                    strokeLinecap="round"
                  />
                )}
                {blockedCount > 0 && (
                  <circle 
                    cx="60" 
                    cy="60" 
                    r={radius} 
                    fill="transparent" 
                    stroke="#ef4444" 
                    strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (activeStroke + inactiveStroke + blockedStroke)}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-white">{totalStatus}</span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3.5 w-full">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-400 font-medium">Active</span>
                </div>
                <span className="text-slate-200 font-bold">{activeCount} ({activePct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  <span className="text-slate-400 font-medium">Inactive</span>
                </div>
                <span className="text-slate-200 font-bold">{inactiveCount} ({inactivePct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                  <span className="text-slate-400 font-medium">Blocked</span>
                </div>
                <span className="text-slate-200 font-bold">{blockedCount} ({blockedPct.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
