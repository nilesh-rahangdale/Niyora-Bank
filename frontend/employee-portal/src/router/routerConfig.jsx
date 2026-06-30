import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/DashboardLayout';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import BranchesList from '../pages/admin/BranchesList';
import UsersList from '../pages/admin/UsersList';

// Manager Pages
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import BranchEmployees from '../pages/manager/BranchEmployees';
import BranchComplaints from '../pages/manager/BranchComplaints';

// CSO Pages
import CsoCustomers from '../pages/cso/CsoCustomers';
import CsoAccounts from '../pages/cso/CsoAccounts';
import CsoComplaints from '../pages/cso/CsoComplaints';

// Teller Pages
import TellerTransactions from '../pages/teller/TellerTransactions';
import TellerCashDrawer from '../pages/teller/TellerCashDrawer';

// Helper component to handle role-based navigation home page routing from "/"
const RootRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  const userRole = user?.roles?.[0];

  if (userRole === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (userRole === 'ROLE_MANAGER') return <Navigate to="/manager/dashboard" replace />;
  if (userRole === 'ROLE_TELLER') return <Navigate to="/teller/transactions" replace />;
  if (userRole === 'ROLE_CSO') return <Navigate to="/cso/customers" replace />;

  return <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public Pages */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <RootRedirect /> : <Login />
        } 
      />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Root Path Evaluator */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <RootRedirect />
          </ProtectedRoute>
        } 
      />

      {/* Admin Modules */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="branches" element={<BranchesList />} />
        <Route path="users" element={<UsersList />} />
      </Route>

      {/* Manager Modules */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={['ROLE_MANAGER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ManagerDashboard />} />
        <Route path="employees" element={<BranchEmployees />} />
        <Route path="complaints" element={<BranchComplaints />} />
      </Route>

      {/* CSO Modules */}
      <Route
        path="/cso"
        element={
          <ProtectedRoute allowedRoles={['ROLE_CSO']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="customers" replace />} />
        <Route path="customers" element={<CsoCustomers />} />
        <Route path="accounts" element={<CsoAccounts />} />
        <Route path="complaints" element={<CsoComplaints />} />
      </Route>

      {/* Teller Modules */}
      <Route
        path="/teller"
        element={
          <ProtectedRoute allowedRoles={['ROLE_TELLER']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="transactions" replace />} />
        <Route path="transactions" element={<TellerTransactions />} />
        <Route path="cash-drawer" element={<TellerCashDrawer />} />
      </Route>

      {/* Fallback route redirection */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
