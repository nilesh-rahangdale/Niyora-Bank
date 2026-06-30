import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerCustomer, getCustomerById, updateCustomerKyc, clearUserState } from '../../redux/slices/userSlice';
import { clearAccountState } from '../../redux/slices/accountSlice';
import { 
  UserCheck, Search, ShieldCheck, ShieldAlert, Plus, Copy,
  MapPin, FileText, CheckCircle2, Loader2, Calendar, User, Info, Check, AlertCircle, FileCheck, ArrowRight, Eye,EyeOff
} from 'lucide-react';

const DOC_LABELS = {
  PAN: 'PAN Card (Permanent Account Number)',
  AADHAR: 'Aadhaar Card (UIDAI)',
  PASSPORT: 'Indian Passport',
  VOTER_ID: 'Voter ID Card',
  DRIVING_LICENSE: 'Driving License',
  UTILITY_BILL: 'Utility Bill (Electricity/Water/Gas)',
  BANK_STATEMENT: 'Bank Statement / Passbook',
};

const POI_OPTIONS = ['PAN', 'AADHAR', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE'];
const POA_OPTIONS = ['AADHAR', 'PASSPORT', 'VOTER_ID', 'DRIVING_LICENSE', 'UTILITY_BILL', 'BANK_STATEMENT'];

const CsoCustomers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux states
  const { selectedCustomer, loading, error, success } = useSelector((state) => state.users);

  // Layout states
  const [activeTab, setActiveTab] = useState('REGISTER'); // REGISTER or LOOKUP
  const [searchId, setSearchId] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [clientError, setClientError] = useState('');

  // Register Form States
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('Male');
  const [maritalStatus, setMaritalStatus] = useState('UNMARRIED');
  const [address, setAddress] = useState('');
  
  // KYC docs POI / POA States
  const [poiType, setPoiType] = useState('PAN');
  const [poiNumber, setPoiNumber] = useState('');
  const [poaType, setPoaType] = useState('AADHAR');
  const [poaNumber, setPoaNumber] = useState('');

  // Registered customer metadata overlay state
  const [registeredCustomer, setRegisteredCustomer] = useState(null);

  // Portal password visibility toggle
  const [showRegPassword, setShowRegPassword] = useState(false);

  // KYC update form states (pre-filled from looked up customer)
  const [editFullName, setEditFullName] = useState('');
  const [editPhoneNumber, setEditPhoneNumber] = useState('');
  const [editFatherName, setEditFatherName] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editGender, setEditGender] = useState('Male');
  const [editMaritalStatus, setEditMaritalStatus] = useState('UNMARRIED');
  const [editAddress, setEditAddress] = useState('');
  const [editPoiType, setEditPoiType] = useState('PAN');
  const [editPoiNumber, setEditPoiNumber] = useState('');
  const [editPoaType, setEditPoaType] = useState('AADHAR');
  const [editPoaNumber, setEditPoaNumber] = useState('');
  const [showKycForm, setShowKycForm] = useState(false);

  useEffect(() => {
    dispatch(clearUserState());
    dispatch(clearAccountState());
    setSearchId('');
    setClientError('');
    setSuccessToast('');
    setRegisteredCustomer(null);
    setShowRegPassword(false);
    
    // Clear forms
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setFatherName('');
    setDob('');
    setGender('Male');
    setMaritalStatus('UNMARRIED');
    setAddress('');
    setPoiType('PAN');
    setPoiNumber('');
    setPoaType('AADHAR');
    setPoaNumber('');
    setShowKycForm(false);

    return () => {
      dispatch(clearUserState());
      dispatch(clearAccountState());
    };
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (success) {
      setSuccessToast('Customer operation completed successfully.');
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Sync edit form fields when a customer is loaded
  useEffect(() => {
    if (selectedCustomer) {
      setEditFullName(selectedCustomer.userDetails?.fullName || '');
      setEditPhoneNumber(selectedCustomer.userDetails?.phoneNumber || '');
      setEditFatherName(selectedCustomer.fatherName || '');
      setEditDob(selectedCustomer.dob || '');
      setEditGender(selectedCustomer.gender || 'Male');
      setEditMaritalStatus(selectedCustomer.maritalStatus || 'UNMARRIED');
      setEditAddress(selectedCustomer.address || '');
      
      const docKeys = Object.keys(selectedCustomer.kycDocs || {});
      const matchedPoi = docKeys.find(k => POI_OPTIONS.includes(k)) || 'PAN';
      const matchedPoa = docKeys.find(k => POA_OPTIONS.includes(k)) || 'AADHAR';

      setEditPoiType(matchedPoi);
      setEditPoiNumber(selectedCustomer.kycDocs?.[matchedPoi] || '');
      setEditPoaType(matchedPoa);
      setEditPoaNumber(selectedCustomer.kycDocs?.[matchedPoa] || '');
    }
  }, [selectedCustomer]);

  // Document validation helper
  const validateDoc = (type, value) => {
    if (type === 'PAN' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value.toUpperCase())) {
      return 'Invalid PAN card format (expected: ABCDE1234F).';
    }
    if (type === 'AADHAR' && !/^\d{12}$/.test(value)) {
      return 'Invalid Aadhaar number (expected: 12 numeric digits).';
    }
    if (!value.trim()) {
      return `Please enter a value for ${DOC_LABELS[type]}.`;
    }
    return null;
  };

  // Handle customer registration
  const handleRegister = (e) => {
    e.preventDefault();
    setClientError('');

    // Validations
    const poiErr = validateDoc(poiType, poiNumber);
    if (poiErr) {
      setClientError(poiErr);
      return;
    }
    const poaErr = validateDoc(poaType, poaNumber);
    if (poaErr) {
      setClientError(poaErr);
      return;
    }

    dispatch(registerCustomer({
      fullName,
      email,
      phoneNumber,
      password,
      fatherName,
      dob,
      gender,
      maritalStatus,
      address,
      kycDocs: {
        [poiType]: poiType === 'PAN' ? poiNumber.toUpperCase() : poiNumber,
        [poaType]: poaType === 'PAN' ? poaNumber.toUpperCase() : poaNumber,
      }
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setRegisteredCustomer(res.payload);
      }
    });
  };

  // Handle searching by Customer ID
  const handleLookup = (e) => {
    e.preventDefault();
    setClientError('');

    if (!searchId.trim()) {
      setClientError('Please enter a valid numeric Customer ID.');
      return;
    }

    dispatch(getCustomerById(searchId));
  };

  // Copy Customer ID Helper
  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id.toString());
    setSuccessToast('Customer ID copied to clipboard!');
    setTimeout(() => setSuccessToast(''), 2000);
  };

  // Reset Onboarding form for next user
  const handleResetForm = () => {
    setRegisteredCustomer(null);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setFatherName('');
    setDob('');
    setAddress('');
    setPoiNumber('');
    setPoaNumber('');
  };

  // Handle KYC status patch update
  const handleKycSubmit = (e) => {
    e.preventDefault();
    setClientError('');

    // Validations
    const poiErr = validateDoc(editPoiType, editPoiNumber);
    if (poiErr) {
      setClientError(poiErr);
      return;
    }
    const poaErr = validateDoc(editPoaType, editPoaNumber);
    if (poaErr) {
      setClientError(poaErr);
      return;
    }

    dispatch(updateCustomerKyc({
      customerId: selectedCustomer.customerId,
      kycData: {
        fullName: editFullName,
        phoneNumber: editPhoneNumber,
        fatherName: editFatherName,
        dob: editDob,
        gender: editGender,
        maritalStatus: editMaritalStatus,
        address: editAddress,
        kycDocs: {
          [editPoiType]: editPoiType === 'PAN' ? editPoiNumber.toUpperCase() : editPoiNumber,
          [editPoaType]: editPoaType === 'PAN' ? editPoaNumber.toUpperCase() : editPoaNumber,
        }
      }
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setShowKycForm(false);
        dispatch(getCustomerById(selectedCustomer.customerId)); // Reload customer profile
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Top header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-slate-800/60 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white uppercase">Customer KYC Desk</h1>
            <p className="text-xs text-slate-400 mt-0.5">Onboard customer profiles and run compliance audits.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-900/40 border border-slate-800 rounded-xl max-w-md select-none">
        {[
          { id: 'REGISTER', label: 'Onboard Customer', icon: Plus },
          { id: 'LOOKUP', label: 'Customer Files & KYC Audit', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-xs transition cursor-pointer flex-1 ${
                isSelected 
                  ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/15' 
                  : 'text-slate-450 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Toast notifications */}
      {successToast && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold select-none animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {(clientError || error) && (
        <div className="flex items-start gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold select-none">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Desk Verification Alert</p>
            <p className="opacity-95">{clientError || error}</p>
          </div>
        </div>
      )}

      {/* Main Forms workspace */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800/85">
        
        {/* TAB 1: CUSTOMER ONBOARDING FORM OR SUCCESS VIEW */}
        {activeTab === 'REGISTER' && (
          registeredCustomer ? (
            /* SUCCESS OVERLAY SUMMARY SUMMARY */
            <div className="space-y-6 max-w-2xl mx-auto py-6">
              
              <div className="text-center space-y-2 mb-6">
                <div className="w-12 h-12 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/5">
                  <Check className="w-6 h-6 stroke-[3px]" />
                </div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider">Customer Registered Successfully!</h3>
                <p className="text-xs text-slate-500">Retail customer metadata profile cleared for book ledger entries.</p>
              </div>

              {/* Data Summary Grid */}
              <div className="p-5 bg-slate-900/40 border border-slate-850 rounded-xl space-y-4 font-semibold text-xs">
                
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-0.5">Secure Customer ID</span>
                    <strong className="text-base font-mono text-indigo-400">
                      {registeredCustomer.customerId}
                    </strong>
                  </div>
                  <button
                    onClick={() => handleCopyId(registeredCustomer.customerId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-lg text-[10px] cursor-pointer transition"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy ID
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">Customer Name</span>
                    <span className="text-slate-200 text-sm uppercase">{registeredCustomer.userDetails?.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">Login Email</span>
                    <span className="text-slate-200 text-sm font-mono">{registeredCustomer.userDetails?.email}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">Mobile Contact</span>
                    <span className="text-slate-250 font-mono">{registeredCustomer.userDetails?.phoneNumber || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">KYC Compliance</span>
                    <span className="text-rose-400 flex items-center gap-1 mt-0.5">
                      <AlertCircle className="w-3.5 h-3.5" /> Pending Audit Verification
                    </span>
                  </div>
                </div>

              </div>

              {/* Navigation Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-850">
                <button
                  onClick={() => navigate('/cso/accounts', { state: { prefilledCustomerId: registeredCustomer.customerId } })}
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-2"
                >
                  Proceed to Account Onboarding
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleResetForm}
                  className="px-5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-xl text-xs font-bold cursor-pointer transition"
                >
                  Onboard Another Customer
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <User className="w-4.5 h-4.5 text-indigo-400" />
                  Customer Demographics
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Capture core retail customer information and security credentials.</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="10-digit mobile number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Father's Name</label>
                  <input
                    type="text"
                    placeholder="Father's Full Name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Portal Password</label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? "text" : "password"}
                      placeholder="Set initial password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 rounded-lg border glass-input text-xs font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Gender Selection</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  >
                    <option value="Male" className="bg-[#070b13]">Male</option>
                    <option value="Female" className="bg-[#070b13]">Female</option>
                    <option value="Other" className="bg-[#070b13]">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  >
                    <option value="UNMARRIED" className="bg-[#070b13]">Unmarried</option>
                    <option value="MARRIED" className="bg-[#070b13]">Married</option>
                  </select>
                </div>
              </div>

              <div className="text-xs font-semibold">
                <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[10px]">Residential Address</label>
                <textarea
                  placeholder="Full billing & mailing address details..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs h-20 resize-none"
                  required
                />
              </div>

              <div className="border-t border-slate-800/60 pt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <FileText className="w-4.5 h-4.5 text-indigo-400" />
                    Government KYC Identifiers
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Link customer's official Proof of Identity (POI) and Proof of Address (POA) documents.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* POI Card */}
                  <div className="p-4 bg-slate-900/35 border border-slate-855 rounded-xl space-y-3.5">
                    <span className="text-[10px] text-indigo-450 uppercase font-bold tracking-wider">1. Proof of Identity (POI)</span>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-500 text-[9px] uppercase tracking-wider mb-1">POI Document Type</label>
                        <select
                          value={poiType}
                          onChange={(e) => {
                            setPoiType(e.target.value);
                            setPoiNumber('');
                          }}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs"
                          required
                        >
                          {POI_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-[#070b13]">{DOC_LABELS[opt]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[9px] uppercase tracking-wider mb-1">POI Document ID Number</label>
                        <input
                          type="text"
                          placeholder="Enter Document number"
                          value={poiNumber}
                          onChange={(e) => setPoiNumber(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* POA Card */}
                  <div className="p-4 bg-slate-900/35 border border-slate-855 rounded-xl space-y-3.5">
                    <span className="text-[10px] text-indigo-455 uppercase font-bold tracking-wider">2. Proof of Address (POA)</span>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-500 text-[9px] uppercase tracking-wider mb-1">POA Document Type</label>
                        <select
                          value={poaType}
                          onChange={(e) => {
                            setPoaType(e.target.value);
                            setPoaNumber('');
                          }}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs"
                          required
                        >
                          {POA_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-[#070b13]">{DOC_LABELS[opt]}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[9px] uppercase tracking-wider mb-1">POA Document ID Number</label>
                        <input
                          type="text"
                          placeholder="Enter Document number"
                          value={poaNumber}
                          onChange={(e) => setPoaNumber(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs font-mono"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center gap-1.5 transition"
                >
                  {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register Customer Profile
                </button>
              </div>
            </form>
          )
        )}

        {/* TAB 2: LOOKUP AND AUDIT TICKET WORKSPACE */}
        {activeTab === 'LOOKUP' && (
          <div className="space-y-6">
            
            {/* Search filter form */}
            <form onSubmit={handleLookup} className="flex gap-2 max-w-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="number"
                  placeholder="Search by customer ID (e.g. 1)..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs font-mono"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchId}
                className="px-4 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer shadow-lg shadow-indigo-600/10 flex items-center gap-1.5 disabled:opacity-50 transition-all cursor-pointer"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
              </button>
            </form>

            {/* Profile Workspace */}
            {selectedCustomer ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                
                {/* profile card */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-3.5 border-b border-slate-800/80 pb-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg uppercase shrink-0">
                      {selectedCustomer.userDetails?.fullName?.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white uppercase tracking-wide">
                        {selectedCustomer.userDetails?.fullName}
                      </h2>
                      <span className="text-[10px] text-slate-500 font-mono">Customer ID: #{selectedCustomer.customerId}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Email Account</span>
                      <span className="text-slate-200 font-mono">{selectedCustomer.userDetails?.email}</span>
                    </div>
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Mobile Line</span>
                      <span className="text-slate-200 font-mono">{selectedCustomer.userDetails?.phoneNumber || '—'}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Father's Name</span>
                      <span className="text-slate-200">{selectedCustomer.fatherName || '—'}</span>
                    </div>
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Date of Birth</span>
                      <span className="text-slate-200 font-mono">{selectedCustomer.dob || '—'}</span>
                    </div>
                    <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1">Gender / Marital</span>
                      <span className="text-slate-200 font-mono">
                        {selectedCustomer.gender} / {selectedCustomer.maritalStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl text-xs font-semibold">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold block mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> Residential Address
                    </span>
                    <span className="text-slate-350 leading-relaxed font-medium">{selectedCustomer.address}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2 flex items-center gap-2">
                    <FileText className="w-4.5 h-4.5 text-indigo-400" /> Registered Identity Documents
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
                    {Object.keys(selectedCustomer.kycDocs || {}).length === 0 ? (
                      <p className="text-xs text-slate-500 italic col-span-2">No documents mapped to profile.</p>
                    ) : (
                      Object.entries(selectedCustomer.kycDocs || {}).map(([key, val]) => (
                        <div key={key} className="p-3.5 bg-slate-900/40 border border-slate-800/40 rounded-xl flex justify-between items-center">
                          <div>
                            <span className="text-[8px] text-indigo-400 uppercase tracking-wider block font-bold mb-1">{DOC_LABELS[key] || key}</span>
                            <strong className="text-slate-200 font-mono">{val}</strong>
                          </div>
                          <FileCheck className="w-6 h-6 text-indigo-500/25 shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* kyc column */}
                <div className="lg:col-span-1 glass-card border border-slate-800 p-5 rounded-xl flex flex-col justify-between space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                      <span className="text-xs font-bold text-white uppercase">Compliance Clearance</span>
                      <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 ${
                        selectedCustomer.kycstatus === true
                          ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                      }`}>
                        {selectedCustomer.kycstatus === true ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        {selectedCustomer.kycstatus === true ? 'APPROVED' : 'PENDING'}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-900/50 rounded-lg text-[10px] text-slate-400 space-y-2 leading-relaxed font-medium">
                      <h4 className="font-bold text-slate-500 uppercase tracking-widest text-[8px] flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-indigo-400" /> Onboarding Instructions
                      </h4>
                      <p className="text-slate-400 mt-1.5 leading-relaxed">
                        {selectedCustomer.kycstatus === true 
                          ? 'The customer KYC check is approved. You may proceed to account onboarding desks.' 
                          : 'KYC parameters are currently verification-pending. Documents must be verified to clear this account for transactions.'}
                      </p>
                    </div>
                  </div>

                  {!showKycForm ? (
                    <button
                      onClick={() => setShowKycForm(true)}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-lg shadow-indigo-650/10"
                    >
                      {selectedCustomer.kycstatus === true ? 'Update KYC Details' : 'Verify & Approve KYC Details'}
                    </button>
                  ) : (
                    <form onSubmit={handleKycSubmit} className="space-y-3.5 text-xs font-semibold pt-4 border-t border-slate-850">
                      
                      <div>
                        <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Audit Full Name</label>
                        <input
                          type="text"
                          value={editFullName}
                          onChange={(e) => setEditFullName(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Audit Phone Number</label>
                        <input
                          type="text"
                          value={editPhoneNumber}
                          onChange={(e) => setEditPhoneNumber(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs font-mono"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Father's Name</label>
                          <input
                            type="text"
                            value={editFatherName}
                            onChange={(e) => setEditFatherName(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">DOB</label>
                          <input
                            type="date"
                            value={editDob}
                            onChange={(e) => setEditDob(e.target.value)}
                            className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Gender</label>
                          <select
                            value={editGender}
                            onChange={(e) => setEditGender(e.target.value)}
                            className="w-full px-2 py-2 rounded-lg border glass-input text-xs"
                            required
                          >
                            <option value="Male" className="bg-[#070b13]">Male</option>
                            <option value="Female" className="bg-[#070b13]">Female</option>
                            <option value="Other" className="bg-[#070b13]">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Marital Status</label>
                          <select
                            value={editMaritalStatus}
                            onChange={(e) => setEditMaritalStatus(e.target.value)}
                            className="w-full px-2 py-2 rounded-lg border glass-input text-xs"
                            required
                          >
                            <option value="UNMARRIED" className="bg-[#070b13]">Unmarried</option>
                            <option value="MARRIED" className="bg-[#070b13]">Married</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-455 mb-1.5 uppercase tracking-wider text-[9px]">Audit Address</label>
                        <textarea
                          value={editAddress}
                          onChange={(e) => setEditAddress(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-lg border glass-input text-xs h-14 resize-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800/40">
                        {/* edit POI */}
                        <div className="space-y-2">
                          <label className="block text-indigo-400 text-[8px] uppercase tracking-wider font-bold">POI Document</label>
                          <select
                            value={editPoiType}
                            onChange={(e) => {
                              setEditPoiType(e.target.value);
                              setEditPoiNumber('');
                            }}
                            className="w-full px-2 py-1.5 rounded border glass-input text-[10px]"
                            required
                          >
                            {POI_OPTIONS.map(opt => (
                              <option key={opt} value={opt} className="bg-[#070b13]">{opt}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editPoiNumber}
                            onChange={(e) => setEditPoiNumber(e.target.value)}
                            className="w-full px-2 py-1.5 rounded border glass-input text-[10px] font-mono"
                            required
                          />
                        </div>

                        {/* edit POA */}
                        <div className="space-y-2">
                          <label className="block text-indigo-400 text-[8px] uppercase tracking-wider font-bold">POA Document</label>
                          <select
                            value={editPoaType}
                            onChange={(e) => {
                              setEditPoaType(e.target.value);
                              setEditPoaNumber('');
                            }}
                            className="w-full px-2 py-1.5 rounded border glass-input text-[10px]"
                            required
                          >
                            {POA_OPTIONS.map(opt => (
                              <option key={opt} value={opt} className="bg-[#070b13]">{opt}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            value={editPoaNumber}
                            onChange={(e) => setEditPoaNumber(e.target.value)}
                            className="w-full px-2 py-1.5 rounded border glass-input text-[10px] font-mono"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end text-[10px] pt-3 border-t border-slate-850">
                        <button
                          type="button"
                          onClick={() => setShowKycForm(false)}
                          className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-350 hover:bg-slate-800 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="px-3.5 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg cursor-pointer flex items-center gap-1 font-bold transition-all"
                        >
                          {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                          Verify & Clear KYC
                        </button>
                      </div>
                    </form>
                  )}

                </div>

              </div>
            ) : (
              <div className="p-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Enter a Customer ID above to search and audit their KYC file documentation.
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default CsoCustomers;
