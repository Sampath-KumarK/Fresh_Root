import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-stone-600">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the appropriate login page based on target role
    if (allowedRole === 'FARMER') {
      return <Navigate to="/farmer/login" state={{ from: location }} replace />;
    }
    if (allowedRole === 'ADMIN') {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Wrong role logged in: redirect to their respective dashboard or login
    if (allowedRole === 'FARMER') {
      return <Navigate to="/farmer/login" state={{ error: 'Farmer privileges required' }} replace />;
    }
    if (allowedRole === 'ADMIN') {
      return <Navigate to="/admin/login" state={{ error: 'Admin privileges required' }} replace />;
    }
    return <Navigate to="/login" state={{ error: 'Customer access required' }} replace />;
  }

  return <>{children}</>;
};
