import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * AdminRoute - Protects admin-only routes
 * Redirects non-admin users to their appropriate dashboard
 */
export const AdminRoute = ({ children }) => {
  const { role, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect non-admin users
  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

/**
 * StudentRoute - Protects student-only routes
 * Redirects admin users to admin dashboard
 */
export const StudentRoute = ({ children }) => {
  const { role, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  return children;
};

/**
 * ProtectedRoute - General route protection
 * Redirects unauthenticated users to login
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
