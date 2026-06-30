import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTellerById, setCashDrawer, setLastBalanced, clearUserState } from '../../redux/slices/userSlice';
import { 
  Inbox, Calendar, ShieldCheck, ShieldAlert, Loader2, 
  CheckCircle2, RefreshCw, AlertTriangle
} from 'lucide-react';

const TellerCashDrawer = () => {
  const dispatch = useDispatch();
  
  // Redux States
  const { user } = useSelector((state) => state.auth);
  const { currentTeller, loading, error, success } = useSelector((state) => state.users);

  // Component Local States
  const [drawerIdInput, setDrawerIdInput] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [clientError, setClientError] = useState('');

  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      dispatch(getTellerById(userId));
    }

    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch, userId]);

  useEffect(() => {
    if (success) {
      setSuccessToast('Drawer state updated successfully.');
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Date formatter helper: yyyy-MM-ddTHH:mm:ss
  const formatLocalDateTime = (date) => {
    const pad = (num) => String(num).padStart(2, '0');
    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());
    const ss = pad(date.getSeconds());
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  };

  const handleClaimDrawer = (e) => {
    e.preventDefault();
    setClientError('');

    if (!drawerIdInput.trim()) {
      setClientError('Please enter a valid Drawer ID.');
      return;
    }

    dispatch(setCashDrawer(drawerIdInput)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setDrawerIdInput('');
        if (userId) dispatch(getTellerById(userId));
      }
    });
  };

  const handleBalanceDrawer = () => {
    setClientError('');
    const nowString = formatLocalDateTime(new Date());

    dispatch(setLastBalanced(nowString)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        if (userId) dispatch(getTellerById(userId));
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col gap-1.5 border-b border-slate-800/60 pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-white">Drawer Operations</h1>
        <p className="text-sm text-slate-400">
          Manage cash drawers, track drawer balance, and perform end-of-day reconciliation.
        </p>
      </div>

      {/* Success alerts */}
      {successToast && (
        <div className="flex items-center gap-2.5 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error alerts */}
      {(clientError || error) && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Drawer Alert</p>
            <p className="opacity-95">{clientError || error}</p>
          </div>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Current Drawer State */}
        <div className="glass-panel rounded-xl p-6 border border-slate-800/85 space-y-6">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Inbox className="w-4 h-4 text-indigo-400" />
            Current Drawer Status
          </h3>

          {loading && !currentTeller ? (
            <div className="py-10 text-center text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
              Loading drawer logs...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Drawer ID</span>
                  <strong className="text-sm font-mono text-white">
                    {currentTeller?.cashDrawerId || 'UNASSIGNED'}
                  </strong>
                </div>

                <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Status</span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${
                    currentTeller?.cashDrawerId 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {currentTeller?.cashDrawerId ? 'ACTIVE DESK' : 'LOCKED'}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Last Reconciliation</span>
                  <strong className="text-xs text-slate-200">
                    {currentTeller?.lastBalanced 
                      ? new Date(currentTeller.lastBalanced).toLocaleString() 
                      : 'Never Balanced'}
                  </strong>
                </div>
                <Calendar className="w-8 h-8 text-slate-500/25" />
              </div>

              {currentTeller?.cashDrawerId && (
                <button
                  onClick={handleBalanceDrawer}
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/10"
                >
                  {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  Balance Drawer Now (Reconcile)
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Card: Claim / Register Drawer */}
        <div className="glass-panel rounded-xl p-6 border border-slate-800/85 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              Claim Cash Drawer
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Before running cashier transactions, you must claim an active drawer. This registers your profile's transaction logs to this drawer identifier.
            </p>

            <form onSubmit={handleClaimDrawer} className="space-y-4 text-xs font-semibold pt-4">
              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Secure Drawer ID</label>
                <input
                  type="text"
                  placeholder="e.g. DRAWER-A01"
                  value={drawerIdInput}
                  onChange={(e) => setDrawerIdInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-1.5"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Register Drawer Assignment
              </button>
            </form>
          </div>

          <div className="p-3 bg-slate-900/35 border border-slate-850 rounded-xl text-[10px] text-slate-500 flex items-center gap-2 mt-6">
            <AlertTriangle className="w-4 h-4 shrink-0 text-slate-650" />
            <span>Note: Claiming a drawer overwrites any current drawer mapping.</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TellerCashDrawer;
