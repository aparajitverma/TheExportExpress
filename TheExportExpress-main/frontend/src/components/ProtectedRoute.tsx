import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is admin but accessing wrong route (e.g. a customer route that requires a specific non-admin role they don't have)
    // and they are an admin type, redirect to admin dashboard.
    if ([UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.CONTENT_EDITOR].includes(user.role)) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Otherwise (e.g. a regular user trying to access a route with specific roles they don't have, or an admin trying a non-admin specific role route)
    // redirect to home page.
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 