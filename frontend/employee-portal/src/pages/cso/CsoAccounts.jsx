import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getCustomerById, clearUserState } from '../../redux/slices/userSlice';
import { getAllBranches } from '../../redux/slices/branchSlice';
import { createAccount, getAccountsByCustomer, clearAccountState } from '../../redux/slices/accountSlice';
import { 
  CreditCard, Search, ShieldCheck, ShieldAlert, AlertTriangle, 
  CheckCircle2, Loader2, Building, Plus, User, Info, AlertOctagon
} from 'lucide-react';

const SEEDED_BRANCHES = [
  { branchId: 1, branchName: 'Mumbai Main', branchCode: '100001' },
  { branchId: 2, branchName: 'Delhi Branch', branchCode: '110001' },
  { branchId: 3, branchName: 'Wardhman Nagar', branchCode: '030425' },
];

const CsoAccounts = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Redux States
  const { selectedCustomer, loading: userLoading } = useSelector((state) => state.users);
  const { branches, loading: branchLoading } = useSelector((state) => state.branches);
  const { accounts, selectedAccount, loading: accountLoading, error, success, successMessage } = useSelector((state) => state.accounts);

  // Component States
  const [customerId, setCustomerId] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [accountType, setAccountType] = useState('SAVINGS');
  
  const [clientError, setClientError] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [verifyingCustomer, setVerifyingCustomer] = useState(false);

  useEffect(() => {
    // Reset any shared states on layout mount and unmount
    dispatch(clearUserState());
    dispatch(clearAccountState());
    dispatch(getAllBranches());

    // Check if a prefilled customer ID was passed via router navigation state
    if (location.state?.prefilledCustomerId) {
      const preId = location.state.prefilledCustomerId.toString();
      setCustomerId(preId);
      setVerifyingCustomer(true);
      dispatch(getCustomerById(preId)).then((res) => {
        setVerifyingCustomer(false);
        if (res.meta.requestStatus === 'fulfilled') {
          dispatch(getAccountsByCustomer(res.payload.customerId));
        }
      });
    }
    
    return () => {
      dispatch(clearUserState());
      dispatch(clearAccountState());
    };
  }, [dispatch, location]);

  useEffect(() => {
    if (success) {
      setSuccessToast('Account opened successfully.');
      setAccountType('SAVINGS');
      setBranchCode('');
      if (selectedCustomer) {
        dispatch(getAccountsByCustomer(selectedCustomer.customerId));
      }
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, selectedCustomer, dispatch]);

  const handleVerifyCustomer = (e) => {
    e.preventDefault();
    setClientError('');
    setSuccessToast('');

    if (!customerId.trim()) {
      setClientError('Please enter a valid numeric Customer ID.');
      return;
    }

    setVerifyingCustomer(true);
    dispatch(getCustomerById(customerId)).then((res) => {
      setVerifyingCustomer(false);
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getAccountsByCustomer(res.payload.customerId));
      }
    });
  };

  const handleOpenAccount = (e) => {
    e.preventDefault();
    setClientError('');

    if (!selectedCustomer) {
      setClientError('Please verify a customer profile first.');
      return;
    }

    if (selectedCustomer.kycstatus !== true) {
      setClientError('Compliance Block: Customer KYC must be APPROVED before opening accounts.');
      return;
    }

    if (!branchCode) {
      setClientError('Please select a branch location for account bookkeeping.');
      return;
    }

    dispatch(createAccount({
      customerId: selectedCustomer.customerId,
      branchCode, // Passed branchCode instead of branchId
      accountType
    }));
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val || 0);
  };

  // Fallback to static seed branches list if endpoint returns 403 or empty
  const activeBranches = branches && branches.length > 0 ? branches : SEEDED_BRANCHES;

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase">Account Onboarding</h1>
            <p className="text-xs text-slate-400 mt-0.5">Open Savings or Current accounts for compliant customers.</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      {successToast && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold select-none">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {(clientError ) && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold select-none">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Compliance Block</p>
            <p className="opacity-95">{clientError }</p>
          </div>
        </div>
      )}

      {/* Work grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: CUSTOMER SELECTION & PROFILE VERIFICATION */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Customer lookup form */}
          <div className="glass-panel rounded-xl p-5 border border-slate-800/85 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customer Lookup</h3>
            <form onSubmit={handleVerifyCustomer} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="Enter customer ID..."
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border glass-input text-xs font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={verifyingCustomer || !customerId}
                className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-50 transition"
              >
                {verifyingCustomer ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Verify'}
              </button>
            </form>

            {/* Profile audit checks */}
            {selectedCustomer && (
              <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3 text-xs font-semibold">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span className="text-slate-200 uppercase truncate">{selectedCustomer.userDetails?.fullName}</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-400">
                  <div className="flex justify-between items-center">
                    <span>KYC Status:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      selectedCustomer.kycstatus === true
                        ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-450 border border-rose-500/20'
                    }`}>
                      {selectedCustomer.kycstatus === true ? 'APPROVED' : 'PENDING'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>PAN Card:</span>
                    <span className="font-mono text-slate-300">{selectedCustomer.kycDocs?.PAN || '—'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* List of customer's active account portfolios */}
          {selectedCustomer && (
            <div className="glass-panel rounded-xl p-5 border border-slate-800/85 space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Accounts ({accounts.length})</h3>
              {accounts.length === 0 ? (
                <p className="text-xs text-slate-500 italic font-medium">No account files found for this customer.</p>
              ) : (
                <div className="space-y-2.5 max-h-[30vh] overflow-y-auto pr-1">
                  {accounts.map((acc) => (
                    <div key={acc.accountNumber} className="p-3 bg-slate-900/35 border border-slate-855 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-250 font-mono tracking-wide">{acc.accountNumber}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          acc.accountStatus === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' 
                            : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                        }`}>
                          {acc.accountStatus}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                        <span>{acc.accountType}</span>
                        <span className="text-emerald-400 font-mono">{formatCurrency(acc.balance)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: ONBOARDING BOOKKEEPING FORM */}
        <div className="lg:col-span-2">
          {selectedCustomer ? (
            <div className="glass-panel rounded-xl p-6 border border-slate-800/85 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Plus className="w-5 h-5 text-indigo-400" />
                Open Core Ledger Account
              </h3>

              {selectedCustomer.kycstatus !== true ? (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-455 rounded-xl text-xs font-semibold space-y-2 flex items-start gap-2.5 leading-relaxed">
                  <AlertOctagon className="w-5 h-5 shrink-0 text-rose-400" />
                  <div>
                    <p className="font-bold text-rose-400">Compliance Audit Blocked</p>
                    <p className="opacity-95">
                      Customer KYC status is currently <strong>PENDING</strong>. Compliance rules mandate that a retail ledger account can only be opened for approved customer profiles. Please go to **KYC Audit** to verify Ramesh's identification papers first.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleOpenAccount} className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-450 mb-1.5 uppercase tracking-wider text-[10px]">Select Booking Branch Office</label>
                    <select
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                      required
                    >
                      <option value="" disabled className="bg-[#070b13]">Select booking branch location...</option>
                      {activeBranches.map((b) => (
                        <option key={b.branchCode} value={b.branchCode} className="bg-[#070b13]">
                          {b.branchName} ({b.branchCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-450 mb-1.5 uppercase tracking-wider text-[10px]">Account Scheme Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType('SAVINGS')}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          accountType === 'SAVINGS'
                            ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-600/5'
                            : 'bg-slate-900 border-slate-800 text-slate-455'
                        }`}
                      >
                        Savings Account
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('CURRENT')}
                        className={`py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                          accountType === 'CURRENT'
                            ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/50 shadow-md shadow-indigo-600/5'
                            : 'bg-slate-900 border-slate-800 text-slate-455'
                        }`}
                      >
                        Current Account
                      </button>
                    </div>
                  </div>

                  {/* confirm card details */}
                  <div className="bg-slate-900/35 border border-slate-850 p-4 rounded-xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-indigo-400" />
                      Account Activation Policy
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                      Onboarding accounts generates a 12-digit ledger sheet starting with status <strong>PENDING</strong>. The ledger automatically shifts to <strong>ACTIVE</strong> upon executing the initial deposit transaction.
                    </p>
                  </div>

                  <div className="pt-4  flex justify-end">
                    <button
                      type="submit"
                      disabled={accountLoading}
                      className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-indigo-650/10 flex items-center gap-1.5 transition   border-t border-slate-850"
                    >
                      {accountLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Onboard Account
                    </button>
                  </div>
                </form>
              )}

            </div>
          ) : (
            <div className="glass-panel rounded-xl p-12 border border-slate-800/85 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
              <CreditCard className="w-10 h-10 text-slate-650 mb-3" />
              <p className="text-sm font-semibold">Select and verify a customer profile to initialize account opening.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default CsoAccounts;
