import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logoutUser } from '../redux/slices/authSlice';
import { getTellerById, getCsoById } from '../redux/slices/userSlice';
import { getManagerDashboard } from '../redux/slices/dashboardSlice';
import Logo from './Logo';
import { 
  LayoutDashboard, GitBranch, Users, LogOut, ShieldAlert,
  FileQuestion, UserCheck, CreditCard, DollarSign, Inbox, 
  Menu, X, Shield, Bell, Building
} from 'lucide-react';

const SIDEBAR_ITEMS = {
  ROLE_ADMIN: [
    { label: 'System Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Branch Management', path: '/admin/branches', icon: GitBranch },
    { label: 'User Management', path: '/admin/users', icon: Users },
  ],
  ROLE_MANAGER: [
    { label: 'Branch Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Employees Directory', path: '/manager/employees', icon: Users },
    { label: 'Complaints Ledger', path: '/manager/complaints', icon: FileQuestion },
  ],
  ROLE_CSO: [
    { label: 'Customer Files & KYC', path: '/cso/customers', icon: UserCheck },
    { label: 'Account Onboarding', path: '/cso/accounts', icon: CreditCard },
    { label: 'Support Complaints', path: '/cso/complaints', icon: FileQuestion },
  ],
  ROLE_TELLER: [
    { label: 'Teller Transactions', path: '/teller/transactions', icon: DollarSign },
    { label: 'Drawer Operations', path: '/teller/cash-drawer', icon: Inbox },
  ],
};

const ROLE_LABELS = {
  ROLE_ADMIN: 'System Admin',
  ROLE_MANAGER: 'Branch Manager',
  ROLE_CSO: 'CSO Officer',
  ROLE_TELLER: 'Bank Teller',
};

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useSelector((state) => state.auth);
  const { currentTeller, currentCso } = useSelector((state) => state.users);
  const { managerData } = useSelector((state) => state.dashboard);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const userRole = user?.roles?.[0];
  const menuItems = SIDEBAR_ITEMS[userRole] || [];

  // Fetch role-specific details on layout mount
  useEffect(() => {
    if (user?.id) {
      if (userRole === 'ROLE_MANAGER' && !managerData) {
        dispatch(getManagerDashboard());
      } else if (userRole === 'ROLE_TELLER' && !currentTeller) {
        dispatch(getTellerById(user.id));
      } else if (userRole === 'ROLE_CSO' && !currentCso) {
        dispatch(getCsoById(user.id));
      }
    }
  }, [dispatch, user, userRole, managerData, currentTeller, currentCso]);

  // Listen to redirect alerts passed via router navigation state
  useEffect(() => {
    if (location.state?.alertMessage) {
      setToastMessage(location.state.alertMessage);
      
      // Clear location state history so the alert doesn't persist on manual refreshes
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const getBranchId = () => {
    if (userRole === 'ROLE_MANAGER') return managerData?.branchId;
    if (userRole === 'ROLE_TELLER') return currentTeller?.branchId;
    if (userRole === 'ROLE_CSO') return currentCso?.branchId;
    return null;
  };

  const resolvedBranchId = getBranchId();

  return (
    <div className="min-h-screen bg-[#070b13] flex text-slate-100 font-sans relative overflow-hidden">
      {/* Background glow effects */}
      <div className="glow-spot-blue top-[-100px] left-[-100px]"></div>
      <div className="glow-spot-emerald bottom-[-150px] right-[-100px]"></div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-slate-800/80 
        flex flex-col transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/80">
          <Logo iconSize="w-7 h-7" textSize="text-xs" />
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30 border border-transparent'}
                `}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer (User Action Profile) */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center font-bold text-white text-sm shadow-md shadow-indigo-600/10">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName}</p>
              <span className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-400 font-medium inline-block mt-0.5">
                {ROLE_LABELS[userRole] || 'Employee'}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-350 border border-rose-900/20 hover:border-rose-500/30 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* MAIN VIEW CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Main Header */}
        <header className="h-20 border-b border-slate-800/80 bg-[#070b13]/60 backdrop-blur-md flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Branch indicator */}
            {resolvedBranchId && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-slate-400">
                <Building className="w-3.5 h-3.5 text-indigo-400" />
                <span>Branch Assignment ID: <strong className="text-slate-200">{resolvedBranchId}</strong></span>
              </div>
            )}
          </div>

          {/* Header Action Badges */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/40 cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
            </button>
            
            <div className="h-6 w-[1px] bg-slate-800"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400 hidden md:inline">Status: <span className="text-emerald-400">Secure</span></span>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse"></div>
            </div>
          </div>
        </header>

        {/* Main Canvas Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 relative z-10">
          {/* STATE TOAST ALERT FOR REDIRECTION ACCESS VIOLATIONS */}
          {toastMessage && (
            <div className="flex items-start justify-between gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm mb-6 animate-pulse">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Security Shield Block</p>
                  <p className="text-xs opacity-90">{toastMessage}</p>
                </div>
              </div>
              <button 
                onClick={() => setToastMessage(null)}
                className="text-rose-400 hover:text-white text-xs font-bold px-2 py-1 rounded hover:bg-rose-500/20 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Render target children pages */}
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
