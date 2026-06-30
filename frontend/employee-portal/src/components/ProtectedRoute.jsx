import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const ROLE_HOMES = {
  ROLE_ADMIN: '/admin/dashboard',
  ROLE_MANAGER: '/manager/dashboard',
  ROLE_TELLER: '/teller/transactions',
  ROLE_CSO: '/cso/customers',
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#070b13] text-slate-350">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
        <p className="text-sm font-medium tracking-wide animate-pulse">
          Validating credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving original location
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = user?.roles?.[0];

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Determine the default home page for this user's role
    const defaultHome = ROLE_HOMES[userRole] || '/login';
    
    // Redirect back to their dashboard with a clean alert message in state
    return (
      <Navigate 
        to={defaultHome} 
        replace 
        state={{ 
          alertMessage: `Access Denied: Your role (${userRole}) does not have permission to view '${location.pathname}'.` 
        }} 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
