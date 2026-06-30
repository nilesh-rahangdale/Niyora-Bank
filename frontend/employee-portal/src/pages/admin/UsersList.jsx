import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBranches } from '../../redux/slices/branchSlice';
import { 
  getAllAdmins, getAllManagers, getAllTellers, getAllCsos,
  registerAdmin, registerManager, registerTeller, registerCso,
  updateAdmin, updateManager, updateTeller, updateCso,
  changePassword, deleteUser, clearUserState
} from '../../redux/slices/userSlice';
import { 
  Users, Plus, Search, Edit2, Key, Trash2, X, 
  ShieldAlert, Loader2, CheckCircle2, UserCheck, Shield, 
  Building, UserX, Eye, EyeOff
} from 'lucide-react';

const TABS = [
  { id: 'ROLE_ADMIN', label: 'Administrators' },
  { id: 'ROLE_MANAGER', label: 'Branch Managers' },
  { id: 'ROLE_TELLER', label: 'Bank Tellers' },
  { id: 'ROLE_CSO', label: 'CSO Officers' },
];

const UsersList = () => {
  const dispatch = useDispatch();

  // Redux States
  const { branches } = useSelector((state) => state.branches);
  const { 
    adminsList, managersList, tellersList, csosList, 
    loading: userLoading, error: userError, success 
  } = useSelector((state) => state.users);

  // Component Navigation States
  const [activeTab, setActiveTab] = useState('ROLE_ADMIN');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals Controller
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Focus User State
  const [selectedUser, setSelectedUser] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [successToast, setSuccessToast] = useState('');

  // Registration & Edit Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [branchId, setBranchId] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  
  // Role-Specific fields
  const [adminLevel, setAdminLevel] = useState('STANDARD');
  const [permissions, setPermissions] = useState('READ_WRITE');
  const [cashDrawerId, setCashDrawerId] = useState('');

  // Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!showAddModal) {
      setShowPassword(false);
    }
  }, [showAddModal]);

  useEffect(() => {
    if (!showPasswordModal) {
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  }, [showPasswordModal]);

  useEffect(() => {
    dispatch(getAllBranches());
    loadActiveTabUsers();

    return () => {
      dispatch(clearUserState());
    };
  }, [dispatch, activeTab]);

  // Handle toast notifications
  useEffect(() => {
    if (success) {
      setSuccessToast('Operation completed successfully.');
      const timer = setTimeout(() => setSuccessToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const loadActiveTabUsers = () => {
    if (activeTab === 'ROLE_ADMIN') dispatch(getAllAdmins());
    if (activeTab === 'ROLE_MANAGER') dispatch(getAllManagers());
    if (activeTab === 'ROLE_TELLER') dispatch(getAllTellers());
    if (activeTab === 'ROLE_CSO') dispatch(getAllCsos());
  };

  // Reset Form
  const resetForm = () => {
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setPassword('');
    setBranchId('');
    setStatus('ACTIVE');
    setAdminLevel('STANDARD');
    setPermissions('READ_WRITE');
    setCashDrawerId('');
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setValidationError('');
    setSelectedUser(null);
  };

  // Submit User Registration
  const handleRegister = (e) => {
    e.preventDefault();
    setValidationError('');

    const userData = { email, fullName, phoneNumber, password };

    if (activeTab === 'ROLE_ADMIN') {
      dispatch(registerAdmin(userData)).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowAddModal(false);
          resetForm();
          dispatch(getAllAdmins());
        }
      });
    } else if (activeTab === 'ROLE_MANAGER') {
      if (!branchId) return setValidationError('Please select a branch.');
      dispatch(registerManager({ branchId, managerData: userData })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowAddModal(false);
          resetForm();
          dispatch(getAllManagers());
        }
      });
    } else if (activeTab === 'ROLE_TELLER') {
      if (!branchId) return setValidationError('Please select a branch.');
      dispatch(registerTeller({ branchId, tellerData: userData })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowAddModal(false);
          resetForm();
          dispatch(getAllTellers());
        }
      });
    } else if (activeTab === 'ROLE_CSO') {
      if (!branchId) return setValidationError('Please select a branch.');
      dispatch(registerCso({ branchId, csoData: userData })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowAddModal(false);
          resetForm();
          dispatch(getAllCsos());
        }
      });
    }
  };

  // Populate Edit Modal
  const openEditModal = (userWrapper) => {
    setSelectedUser(userWrapper);
    const uDto = userWrapper.userDto || userWrapper.userDetails || userWrapper;
    setFullName(uDto.fullName || '');
    setEmail(uDto.email || '');
    setPhoneNumber(uDto.phoneNumber || '');
    setStatus(uDto.status || 'ACTIVE');
    setBranchId(userWrapper.branchId || '');
    
    if (activeTab === 'ROLE_ADMIN') {
      setAdminLevel(userWrapper.adminLevel || 'STANDARD');
      setPermissions(userWrapper.permissions || 'READ_WRITE');
    } else if (activeTab === 'ROLE_TELLER') {
      setCashDrawerId(userWrapper.cashDrawerId || '');
    }

    setShowEditModal(true);
  };

  // Submit User profile update
  const handleUpdate = (e) => {
    e.preventDefault();
    setValidationError('');

    const commonUpdateDto = { fullName, email, phoneNumber, status, branchId: branchId ? Number(branchId) : null };

    if (activeTab === 'ROLE_ADMIN') {
      const updateDto = { ...commonUpdateDto, adminLevel, permissions };
      dispatch(updateAdmin({ adminId: selectedUser.userId, adminData: updateDto })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowEditModal(false);
          resetForm();
          dispatch(getAllAdmins());
        }
      });
    } else if (activeTab === 'ROLE_MANAGER') {
      dispatch(updateManager({ managerId: selectedUser.managerId, managerData: commonUpdateDto })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowEditModal(false);
          resetForm();
          dispatch(getAllManagers());
        }
      });
    } else if (activeTab === 'ROLE_TELLER') {
      const updateDto = { ...commonUpdateDto, cashDrawerId };
      dispatch(updateTeller({ tellerId: selectedUser.tellerId, tellerData: updateDto })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowEditModal(false);
          resetForm();
          dispatch(getAllTellers());
        }
      });
    } else if (activeTab === 'ROLE_CSO') {
      dispatch(updateCso({ csoId: selectedUser.csoId, csoData: commonUpdateDto })).then((res) => {
        if (res.meta.requestStatus === 'fulfilled') {
          setShowEditModal(false);
          resetForm();
          dispatch(getAllCsos());
        }
      });
    }
  };

  // Submit Password Change
  const handlePasswordReset = (e) => {
    e.preventDefault();
    setValidationError('');

    if (newPassword !== confirmNewPassword) {
      return setValidationError('Passwords do not match.');
    }

    const uDto = selectedUser.userDto || selectedUser.userDetails || selectedUser;
    const targetUserId = uDto.id;

    dispatch(changePassword({ 
      id: targetUserId, 
      oldPassword, 
      newPassword, 
      confirmNewPassword 
    })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setShowPasswordModal(false);
        resetForm();
      }
    });
  };

  // Submit Delete Request
  const handleDelete = () => {
    const uDto = selectedUser.userDto || selectedUser.userDetails || selectedUser;
    const targetUserId = uDto.id;

    dispatch(deleteUser(targetUserId)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        setShowDeleteModal(false);
        resetForm();
        loadActiveTabUsers();
      }
    });
  };

  // Filter current active list
  const getActiveList = () => {
    if (activeTab === 'ROLE_ADMIN') return adminsList;
    if (activeTab === 'ROLE_MANAGER') return managersList;
    if (activeTab === 'ROLE_TELLER') return tellersList;
    if (activeTab === 'ROLE_CSO') return csosList;
    return [];
  };

  const currentList = getActiveList();

  const filteredUsers = currentList.filter((item) => {
    const uDto = item.userDto || item.userDetails || item;
    return (
      uDto.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uDto.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uDto.phoneNumber?.includes(searchTerm)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-sm text-slate-400">Manage internal employees, assign branches, and change credentials.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-lg shadow-indigo-600/10 transition"
        >
          <Plus className="w-4 h-4" />
          Create User
        </button>
      </div>

      {successToast && (
        <div className="flex items-center gap-2.5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs list */}
      <div className="border-b border-slate-800/80 flex overflow-x-auto gap-4 scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              resetForm();
            }}
            className={`py-3.5 text-xs font-semibold tracking-wide border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'border-indigo-500 text-indigo-400' 
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Control bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search corporate files by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border glass-input text-xs"
        />
      </div>

      {/* Main tables list card */}
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800/85">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-900/35 border-b border-slate-800/80 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-4 px-6">Name Details</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Phone</th>
                <th className="py-4 px-6">Branch Assignment</th>
                <th className="py-4 px-6">Account Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {userLoading && currentList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
                    Fetching employee records...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No matching personnel found in this role.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const uDto = item.userDto || item.userDetails || item;
                  // Resolve branch name
                  const userBranch = branches.find((b) => Number(b.branchId) === Number(item.branchId));
                  return (
                    <tr key={uDto.id} className="hover:bg-slate-800/10 text-slate-300">
                      <td className="py-4 px-6">
                        <span className="font-bold text-white block">{uDto.fullName}</span>
                        {activeTab === 'ROLE_ADMIN' && (
                          <span className="text-[9px] text-indigo-400 font-semibold uppercase">{item.adminLevel || 'STANDARD'}</span>
                        )}
                        {activeTab === 'ROLE_TELLER' && (
                          <span className="text-[9px] text-emerald-400 font-semibold uppercase">Drawer: {item.cashDrawerId || 'None'}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 font-mono text-slate-400">{uDto.email}</td>
                      <td className="py-4 px-6">{uDto.phoneNumber || '—'}</td>
                      <td className="py-4 px-6">
                        {activeTab === 'ROLE_ADMIN' ? (
                          <span className="text-slate-500 italic">Global Domain</span>
                        ) : userBranch ? (
                          <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                            <Building className="w-3.5 h-3.5" />
                            <span>{userBranch.branchName}</span>
                          </div>
                        ) : (
                          <span className="text-rose-400 font-semibold flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5" /> Unassigned
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          uDto.status === 'ACTIVE' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : uDto.status === 'INACTIVE'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {uDto.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-lg cursor-pointer transition"
                          title="Edit Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(item);
                            setShowPasswordModal(true);
                          }}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-lg cursor-pointer transition"
                          title="Change Password"
                        >
                          <Key className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(item);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 bg-slate-900 border border-slate-800 hover:border-rose-900 hover:bg-rose-950/15 text-slate-350 hover:text-rose-400 rounded-lg cursor-pointer transition"
                          title="Delete User"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE USER MODAL DIALOG */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" />
                Register Staff - {TABS.find((t) => t.id === activeTab)?.label}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Validation alerts */}
            {(validationError || userError) && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Credentials Issue</p>
                  <p className="opacity-95">{validationError || userError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@niyorabank.com"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Initial Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3 pr-10 py-2.5 rounded-lg border glass-input text-xs font-mono"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* DYNAMIC BRANCH SELECTION DROPDOWN (ONLY FOR MGR, TELLER, CSO) */}
              {activeTab !== 'ROLE_ADMIN' && (
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Corporate Branch Assignment</label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  >
                    <option value="">-- Choose Corporate Branch --</option>
                    {branches.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>
                        {branch.branchName} ({branch.branchCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 ">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {userLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Register Staff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROFILE DETAILS MODAL */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-indigo-400" />
                Update Profile details
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {userError && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Update Failure</p>
                  <p className="opacity-95">{userError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Profile Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="BLOCKED">BLOCKED</option>
                  </select>
                </div>
              </div>

              {/* Role-Specific details */}
              {activeTab === 'ROLE_ADMIN' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Admin Level</label>
                    <input
                      type="text"
                      value={adminLevel}
                      onChange={(e) => setAdminLevel(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Permissions</label>
                    <input
                      type="text"
                      value={permissions}
                      onChange={(e) => setPermissions(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                      required
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ROLE_TELLER' && (
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Cash Drawer ID</label>
                  <input
                    type="text"
                    value={cashDrawerId}
                    onChange={(e) => setCashDrawerId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    placeholder="e.g. DRAWER-001"
                  />
                </div>
              )}

              {activeTab !== 'ROLE_ADMIN' && (
                <div>
                  <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Branch Assignment</label>
                  <select
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border glass-input text-xs"
                    required
                  >
                    <option value="">-- Choose Corporate Branch --</option>
                    {branches.map((branch) => (
                      <option key={branch.branchId} value={branch.branchId}>
                        {branch.branchName} ({branch.branchCode})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 ">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {userLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-slate-800">
            <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                Change Account Credentials
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(validationError || userError) && (
              <div className="flex items-start gap-3 p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs mb-4">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Security Alert</p>
                  <p className="opacity-95">{validationError || userError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Current Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg border glass-input text-xs font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg border glass-input text-xs font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase tracking-wider text-[10px]">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 rounded-lg border glass-input text-xs font-mono"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 ">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={userLoading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  {userLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Change Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-sm glass-panel rounded-2xl p-6 border border-slate-800 text-center">
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full w-fit mx-auto mb-4">
              <UserX className="w-6 h-6" />
            </div>
            
            <h3 className="text-sm font-bold text-white mb-2">Delete Corporate Profile</h3>
            <p className="text-xs text-slate-400 mb-6">
              Are you sure you want to delete the employee record for{' '}
              <strong className="text-slate-200">
                {selectedUser.userDto?.fullName || selectedUser.fullName}
              </strong>
              ? This action cannot be undone.
            </p>

            {userError && (
              <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-lg mb-4">
                {userError}
              </p>
            )}

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 rounded-xl cursor-pointer text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={userLoading}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center gap-1.5 cursor-pointer text-xs font-semibold shadow-lg shadow-rose-600/10"
              >
                {userLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Confirm Deletion
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersList;
