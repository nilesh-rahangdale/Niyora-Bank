import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../redux/slices/dashboardSlice';
import { 
  Building, CreditCard, DollarSign, FileQuestion, ArrowUpRight, 
  ArrowDownRight, Loader2, RefreshCcw, AlertTriangle, ShieldCheck
} from 'lucide-react';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const { managerData, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getManagerDashboard());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getManagerDashboard());
  };

  if (loading && !managerData) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading branch analytics...</p>
      </div>
    );
  }

  // Fallbacks if data doesn't exist
  const data = managerData || {
    branchName: 'Mumbai Main',
    branchIfsc: 'NIYO0100001',
    totalTellers: 0,
    totalCsos: 0,
    totalCashDeposit: 0,
    totalCashWithdrawal: 0,
    totalChequeDeposit: 0,
    totalChequeWithdrawal: 0,
    totalTransferDebit: 0,
    totalTransferCredit: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    rejectedComplaints: 0,
    totalAccounts: 0,
    accountsByType: { SAVINGS: 0, CURRENT: 0 },
    accountsByStatus: { ACTIVE: 0, PENDING: 0, CLOSED: 0 }
  };

  // Helper formatting values
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // 1. Account Types Distribution calculations
  const savingsCount = data.accountsByType?.SAVINGS || 0;
  const currentCount = data.accountsByType?.CURRENT || 0;
  const totalByType = savingsCount + currentCount || 1;
  const savingsPct = (savingsCount / totalByType) * 100;
  const currentPct = (currentCount / totalByType) * 100;

  // 2. Account Statuses calculations for Donut Chart
  const activeAccounts = data.accountsByStatus?.ACTIVE || 0;
  const pendingAccounts = data.accountsByStatus?.PENDING || 0;
  const closedAccounts = data.accountsByStatus?.CLOSED || 0;
  const totalByStatus = activeAccounts + pendingAccounts + closedAccounts || 1;

  const activePct = (activeAccounts / totalByStatus) * 100;
  const pendingPct = (pendingAccounts / totalByStatus) * 100;
  const closedPct = (closedAccounts / totalByStatus) * 100;

  const radius = 50;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  const activeStroke = circumference * (activePct / 100);
  const pendingStroke = circumference * (pendingPct / 100);
  const closedStroke = circumference * (closedPct / 100);

  // 3. Complaint ratios calculations
  const totalComplaints = data.totalComplaints || 0;
  const pendingComplaints = data.pendingComplaints || 0;
  const resolvedComplaints = data.resolvedComplaints || 0;
  const rejectedComplaints = data.rejectedComplaints || 0;

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase">{data.branchName}</h1>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
              <span className="font-mono text-indigo-400">{data.branchIfsc}</span>
              <span>•</span>
              <span>Assigned Managers Office</span>
            </div>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">Dashboard Load Warning</p>
            <p className="text-xs opacity-90">{error}</p>
          </div>
        </div>
      )}

      {/* CORE KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-xl p-5 border border-slate-800/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Branch Accounts</p>
              <h3 className="text-2xl font-bold text-white">{data.totalAccounts}</h3>
            </div>
            <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-indigo-400 font-semibold">{savingsCount} Savings</span>
            <span>•</span>
            <span className="text-cyan-400 font-semibold">{currentCount} Current</span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Branch Cash Deposits</p>
              <h3 className="text-2xl font-bold text-emerald-400">{formatCurrency(data.totalCashDeposit)}</h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cheques credited: <strong className="text-slate-200">{formatCurrency(data.totalChequeDeposit)}</strong></span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Cash Withdrawals</p>
              <h3 className="text-2xl font-bold text-rose-400">{formatCurrency(data.totalCashWithdrawal)}</h3>
            </div>
            <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-[10px] text-slate-400 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            <span>Cheques debited: <strong className="text-slate-200">{formatCurrency(data.totalChequeWithdrawal)}</strong></span>
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800/60">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Service Complaints</p>
              <h3 className="text-2xl font-bold text-white">{totalComplaints}</h3>
            </div>
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <FileQuestion className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-400">
            <span className="text-rose-400 font-bold">{pendingComplaints} Pending</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">{resolvedComplaints} Solved</span>
          </div>
        </div>
      </div>

      {/* DETAILED TRANSACTIONS & EMPLOYEES HEALTH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Ledger transfers summary */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 md:col-span-2 space-y-4">
          <h4 className="text-sm font-bold text-white">Branch Interbank Transfer Ledger</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Internal Transfer Debits</p>
                <p className="text-lg font-bold text-rose-400">{formatCurrency(data.totalTransferDebit)}</p>
              </div>
              <ArrowDownRight className="w-8 h-8 text-rose-500/20" />
            </div>
            <div className="p-4 bg-slate-900/40 border border-slate-800/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-500 uppercase font-semibold mb-1">Internal Transfer Credits</p>
                <p className="text-lg font-bold text-emerald-400">{formatCurrency(data.totalTransferCredit)}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-emerald-500/20" />
            </div>
          </div>
        </div>

        {/* Assigned team overview */}
        <div className="glass-card rounded-xl p-5 border border-slate-800/60 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Branch Staff Assignment</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Assigned personnel for cashier & customer support operations.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total Tellers</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{data.totalTellers}</p>
            </div>
            <div className="p-3 bg-slate-900/40 border border-slate-800/40 rounded-lg text-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total CSOs</span>
              <p className="text-xl font-bold text-cyan-400 mt-1">{data.totalCsos}</p>
            </div>
          </div>
        </div>

      </div>

      {/* SVG CUSTOM ANALYTICS VISUALIZATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        
        {/* visual 1: account status donut */}
        <div className="glass-panel rounded-xl p-5 border border-slate-850 md:col-span-2 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400 mb-4">Account Status Ratio</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto">
            {/* SVG circle */}
            <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#1e293b" strokeWidth={strokeWidth} />
                {activeAccounts > 0 && (
                  <circle 
                    cx="60" cy="60" r={radius} fill="transparent" 
                    stroke="#10b981" strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - activeStroke}
                    strokeLinecap="round"
                  />
                )}
                {pendingAccounts > 0 && (
                  <circle 
                    cx="60" cy="60" r={radius} fill="transparent" 
                    stroke="#f59e0b" strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (activeStroke + pendingStroke)}
                    strokeLinecap="round"
                  />
                )}
                {closedAccounts > 0 && (
                  <circle 
                    cx="60" cy="60" r={radius} fill="transparent" 
                    stroke="#ef4444" strokeWidth={strokeWidth} 
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (activeStroke + pendingStroke + closedStroke)}
                    strokeLinecap="round"
                  />
                )}
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white">{data.totalAccounts}</span>
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-semibold">Accounts</span>
              </div>
            </div>

            {/* Legend info */}
            <div className="space-y-3 w-full">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-slate-400">Active</span>
                </div>
                <span className="text-slate-200 font-bold">{activeAccounts} ({activePct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <span className="text-slate-400">Pending</span>
                </div>
                <span className="text-slate-200 font-bold">{pendingAccounts} ({pendingPct.toFixed(0)}%)</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                  <span className="text-slate-400">Closed</span>
                </div>
                <span className="text-slate-200 font-bold">{closedAccounts} ({closedPct.toFixed(0)}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* visual 2: account types & complaints breakdown */}
        <div className="glass-panel rounded-xl p-5 border border-slate-850 md:col-span-3 space-y-6">
          {/* Account type distribution bar */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Account Type Breakdown</h3>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-indigo-400">Savings: {savingsCount} ({savingsPct.toFixed(0)}%)</span>
              <span className="text-cyan-400">Current: {currentCount} ({currentPct.toFixed(0)}%)</span>
            </div>
            <div className="h-3 w-full bg-slate-900 rounded-full flex overflow-hidden border border-slate-800">
              <div className="bg-indigo-500 h-full" style={{ width: `${savingsPct}%` }} />
              <div className="bg-cyan-500 h-full" style={{ width: `${currentPct}%` }} />
            </div>
          </div>

          {/* complaints bar heights */}
          <div className="space-y-3 pt-3 border-t border-slate-800/40">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-slate-400">Complaints Volume Overview</h3>
            <div className="flex items-end gap-3 h-28 pt-4 justify-around bg-slate-950/20 border border-slate-900 rounded-xl px-2">
              {[
                { label: 'Pending', count: pendingComplaints, color: 'bg-rose-500/80 border-rose-400/40' },
                { label: 'Resolved', count: resolvedComplaints, color: 'bg-emerald-500/80 border-emerald-400/40' },
                { label: 'Rejected', count: rejectedComplaints, color: 'bg-slate-700/80 border-slate-600/40' },
              ].map((complaint) => {
                const max = Math.max(pendingComplaints, resolvedComplaints, rejectedComplaints, 1);
                const heightPct = (complaint.count / max) * 100;
                return (
                  <div key={complaint.label} className="flex flex-col items-center gap-2 w-1/4">
                    <span className="text-[10px] font-bold text-slate-350">{complaint.count}</span>
                    <div 
                      className={`w-full rounded-t-lg border-t border-x ${complaint.color} transition-all duration-500`}
                      style={{ height: `${Math.max(heightPct * 0.6, 6)}px` }}
                    />
                    <span className="text-[9px] text-slate-500 font-semibold tracking-wider uppercase mt-1">{complaint.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ManagerDashboard;
