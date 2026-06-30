import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBranches, registerBranch, clearBranchState } from '../../redux/slices/branchSlice';
import { getAllManagers, getAllTellers, getAllCsos } from '../../redux/slices/userSlice';
import { 
  Building2, Plus, Users, User, Phone, MapPin, 
  Search, CheckCircle2, AlertCircle, X, ShieldAlert, Loader2
} from 'lucide-react';

const BranchesList = () => {
  const dispatch = useDispatch();

  // Redux States
  const { branches, loading: branchLoading, error: branchError, success } = useSelector((state) => state.branches);
  const { managersList, tellersList, csosList, loading: userLoading } = useSelector((state) => state.users);

  // Component States
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form Fields
  const [bankName, setBankName] = useState('Niyora Bank');
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [branchIfsc, setBranchIfsc] = useState('');
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    dispatch(getAllBranches());
    dispatch(getAllManagers());
    dispatch(getAllTellers());
    dispatch(getAllCsos());

    return () => {
      dispatch(clearBranchState());
    };
  }, [dispatch]);

  // Set default selection when branches load
  useEffect(() => {
    if (branches.length > 0 && !selectedBranch) {
      setSelectedBranch(branches[0]);
    }
  }, [branches, selectedBranch]);

  const validateForm = () => {
    // Code validation: exactly 6 digits
    if (!/^\d{6}$/.test(branchCode)) {
      return 'Branch Code must be exactly 6 digits.';
    }
    // IFSC validation: 11 chars (4 letters + 0 + 6 alphanumeric)
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(branchIfsc)) {
      return 'Branch IFSC must be 11 characters (e.g. NIYO0100001: 4 upper letters, 0, and 6 alphanumeric).';
    }
    return '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const errorMsg = validateForm();
    if (errorMsg) {
      setValidationError(errorMsg);
      return;
    }

    dispatch(registerBranch({
      bankName,
      branchName,
      branchCode,
      branchIfsc,
      address,
      contactNumber,
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        // Reset form
        setBranchName('');
        setBranchCode('');
        setBranchIfsc('');
        setAddress('');
        setContactNumber('');
        setShowAddForm(false);
        // Refresh selected branch to show the newly added one
        setSelectedBranch(res.payload);
      }
    });
  };

  // Filtered lists
  const filteredBranches = branches.filter((b) =>
    b.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.branchCode.includes(searchTerm) ||
    b.branchIfsc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Find assigned personnel for the selected branch
  const assignedManager = selectedBranch
    ? managersList.find((mgr) => Number(mgr.branchId) === Number(selectedBranch.branchId))
    : null;

  const assignedTellers = selectedBranch
    ? tellersList.filter((tel) => Number(tel.branchId) === Number(selectedBranch.branchId))
    : [];

  const assignedCsos = selectedBranch
    ? csosList.filter((cso) => Number(cso.branchId) === Number(selectedBranch.branchId))
    : [];

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">Branch Management</h1>
          <p className="text-sm text-slate-400">Add, view, and assign corporate banking locations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10 transition"
        >
          <Plus className="w-4 h-4" />
          Register Branch
        </button>
      </div>

      {/* Main split dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: BRANCHES LIST */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search branches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs"
            />
          </div>

          <div className="glass-panel rounded-xl overflow-hidden border border-slate-800/85 max-h-[60vh] overflow-y-auto">
            {branchLoading && branches.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
                Loading branches...
              </div>
            ) : filteredBranches.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No branches configured.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {filteredBranches.map((branch) => {
                  const isSelected = selectedBranch?.branchId === branch.branchId;
                  return (
                    <button
                      key={branch.branchId}
                      onClick={() => setSelectedBranch(branch)}
                      className={`w-full p-4 text-left transition-all flex items-start justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-indigo-600/10 border-l-2 border-indigo-500' 
                          : 'hover:bg-slate-800/20 border-l-2 border-transparent'
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase">{branch.branchName}</h4>
                        <span className="text-[10px] text-indigo-400 font-mono tracking-wide">{branch.branchIfsc}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-semibold text-slate-400 font-mono">
                        {branch.branchCode}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: DETAIL WORKSPACE PANEL */}
        <div className="lg:col-span-2">
          {selectedBranch ? (
            <div className="glass-panel rounded-xl p-6 border border-slate-800/85 space-y-6">
              
              {/* Header card details */}
              <div className="border-b border-slate-800/80 pb-5">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white uppercase">{selectedBranch.branchName}</h2>
                    <span className="text-xs text-slate-500">{selectedBranch.bankName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">IFSC Code</p>
                    <span className="text-xs font-mono font-bold text-slate-200">{selectedBranch.branchIfsc}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Branch Code</p>
                    <span className="text-xs font-mono font-bold text-slate-200">{selectedBranch.branchCode}</span>
                  </div>
                  <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/40 col-span-2">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-semibold">Contact line</p>
                    <span className="text-xs font-bold text-slate-250 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-500" /> {selectedBranch.contactNumber}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{selectedBranch.address}</span>
                </div>
              </div>

              {/* Personnel Assignment list details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  Assigned Branch Personnel
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Branch Manager */}
                  <div className="p-4 bg-slate-900/35 border border-slate-850 rounded-xl">
                    <p className="text-[10px] text-indigo-400 uppercase tracking-wider font-bold mb-3">Branch Manager</p>
                    {assignedManager ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs uppercase">
                          {assignedManager.userDto?.fullName?.charAt(0)}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-white block">{assignedManager.userDto?.fullName}</span>
                          <span className="text-[10px] text-slate-500 block">{assignedManager.userDto?.email}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No manager assigned to branch.</p>
                    )}
                  </div>

                  {/* CSOs count */}
                  <div className="p-4 bg-slate-900/35 border border-slate-850 rounded-xl space-y-3">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold">CSO Officers</p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded font-semibold">
                        Count: {assignedCsos.length}
                      </span>
                    </div>
                    {assignedCsos.length > 0 ? (
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {assignedCsos.map((cso) => (
                          <div key={cso.csoId} className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">{cso.userDto?.fullName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">{cso.userDto?.email}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No CSOs assigned to branch.</p>
                    )}
                  </div>

                  {/* Tellers list */}
                  <div className="p-4 bg-slate-900/35 border border-slate-850 rounded-xl space-y-3 md:col-span-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Bank Tellers</p>
                      <span className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded font-semibold">
                        Count: {assignedTellers.length}
                      </span>
                    </div>
                    {assignedTellers.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-1">
                        {assignedTellers.map((teller) => (
                          <div key={teller.tellerId} className="p-2.5 bg-slate-950/40 border border-slate-900 rounded-lg flex items-center justify-between text-xs">
                            <div>
                              <span className="text-slate-300 font-semibold block">{teller.userDto?.fullName}</span>
                              <span className="text-[10px] text-slate-500 font-mono">{teller.userDto?.email}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-indigo-400 block font-mono">Drawer: {teller.cashDrawerId || 'None'}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500">No tellers assigned to branch.</p>
                    )}
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel rounded-xl p-10 border border-slate-850 text-center text-slate-500 h-64 flex flex-col items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-600 mb-3" />
              <p className="text-sm font-semibold">Select a branch to view detailed configurations.</p>
            </div>
          )}
        </div>

      </div>

      {/* REGISTER NEW BRANCH MODAL DIALOG OVERLAY */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-800 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Register New Branch Office
              </h3>
              <button 
                onClick={() => {
                  setShowAddForm(false);
                  setValidationError('');
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error alerts inside form */}
            {(validationError || branchError) && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Validation Issue</p>
                  <p className="opacity-95">{validationError || branchError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Branch Location Name</label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    placeholder="e.g. Mumbai Main"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Branch Code (6-digit)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={branchCode}
                    onChange={(e) => setBranchCode(e.target.value)}
                    placeholder="e.g. 100001"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input font-mono text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">IFSC Code (11-char)</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={branchIfsc}
                    onChange={(e) => setBranchIfsc(e.target.value.toUpperCase())}
                    placeholder="e.g. NIYO0100001"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Contact Phone Number</label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="e.g. 022-12345678"
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street details, City, Pin"
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs h-20 resize-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-850">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={branchLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {branchLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register Location
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BranchesList;
