import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getManagerDashboard } from '../../redux/slices/dashboardSlice';
import { Users, Search, Mail, Phone, Inbox, Calendar, Loader2, AlertTriangle } from 'lucide-react';

const BranchEmployees = () => {
  const dispatch = useDispatch();
  const { managerData, loading, error } = useSelector((state) => state.dashboard);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  useEffect(() => {
    if (!managerData) {
      dispatch(getManagerDashboard());
    }
  }, [dispatch, managerData]);

  if (loading && !managerData) {
    return (
      <div className="h-[60vh] w-full flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium">Loading branch personnel...</p>
      </div>
    );
  }

  const branchName = managerData?.branchName || 'My Branch';
  const tellers = managerData?.tellers || [];
  const csos = managerData?.csos || [];

  // Map into a unified roster format
  const roster = [
    ...tellers.map((t) => ({
      id: `teller-${t.tellerId}`,
      fullName: t.userDto?.fullName,
      email: t.userDto?.email,
      phoneNumber: t.userDto?.phoneNumber,
      status: t.userDto?.status || 'ACTIVE',
      roleLabel: 'Bank Teller',
      roleId: 'TELLER',
      detailInfo: t.cashDrawerId ? `Drawer Assigned: ${t.cashDrawerId}` : 'No Drawer Claimed',
      lastBalanced: t.lastBalanced,
    })),
    ...csos.map((c) => ({
      id: `cso-${c.csoId}`,
      fullName: c.userDto?.fullName,
      email: c.userDto?.email,
      phoneNumber: c.userDto?.phoneNumber,
      status: c.userDto?.status || 'ACTIVE',
      roleLabel: 'CSO Officer',
      roleId: 'CSO',
      detailInfo: 'Customer Onboarding Specialists',
      lastBalanced: null,
    }))
  ];

  // Filtering
  const filteredRoster = roster.filter((emp) => {
    const matchesSearch = 
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.phoneNumber?.includes(searchTerm);
      
    const matchesRole = 
      roleFilter === 'ALL' || 
      emp.roleId === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Employees Directory</h1>
        <p className="text-sm text-slate-400">
          Subordinate directory of cashier tellers and customer onboarding specialists assigned to{' '}
          <strong className="text-indigo-400">{branchName}</strong>.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>Error loading branch directory details: {error}</span>
        </div>
      )}

      {/* Roster Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee directory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs"
          />
        </div>

        {/* Roster Filtering Buttons */}
        <div className="flex gap-2 bg-slate-900/40 p-1 border border-slate-800 rounded-xl">
          {[
            { id: 'ALL', label: 'All Staff' },
            { id: 'TELLER', label: 'Tellers' },
            { id: 'CSO', label: 'CSOs' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setRoleFilter(btn.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === btn.id 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoster.length === 0 ? (
          <div className="col-span-full glass-panel rounded-xl p-10 border border-slate-850 text-center text-slate-500">
            <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold">No assigned personnel match current selection.</p>
          </div>
        ) : (
          filteredRoster.map((emp) => (
            <div key={emp.id} className="glass-card rounded-xl p-5 border border-slate-800/60 flex flex-col justify-between space-y-4">
              
              {/* Header profile details */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-850 to-slate-800 border border-slate-750 flex items-center justify-center font-bold text-slate-350 text-sm uppercase">
                    {emp.fullName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase">{emp.fullName}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold inline-block mt-1 ${
                      emp.roleId === 'TELLER'
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                        : 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                    }`}>
                      {emp.roleLabel}
                    </span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                  emp.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {emp.status}
                </span>
              </div>

              {/* Contact matrix */}
              <div className="space-y-2 border-t border-slate-800/40 pt-3 text-[11px] text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                  <span className="font-mono truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-550 shrink-0" />
                  <span>{emp.phoneNumber || '—'}</span>
                </div>
              </div>

              {/* Status details indicators */}
              <div className="bg-slate-900/40 border border-slate-800/40 p-2.5 rounded-lg text-[10px] text-slate-450 flex items-center gap-2">
                <Inbox className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate">{emp.detailInfo}</span>
              </div>

              {emp.roleId === 'TELLER' && emp.lastBalanced && (
                <div className="flex items-center gap-2 text-[9px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-550" />
                  <span>Balanced: {new Date(emp.lastBalanced).toLocaleString()}</span>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default BranchEmployees;
