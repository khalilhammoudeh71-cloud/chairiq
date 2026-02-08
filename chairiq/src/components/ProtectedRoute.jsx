import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, requireDentist = false }) {
  const { user, loading: authLoading } = useAuth();
  const [roleChecking, setRoleChecking] = useState(true);
  const [isDentist, setIsDentist] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkRole = async () => {
      if (!user) {
        setRoleChecking(false);
        return;
      }

      if (requireDentist) {
        const dentistStatus = await authService?.isDentist();
        setIsDentist(dentistStatus);
      } else {
        setIsDentist(true); // If dentist not required, allow access
      }
      
      setRoleChecking(false);
    };

    if (!authLoading) {
      checkRole();
    }
  }, [user, authLoading, requireDentist]);

  // Show loading spinner while checking authentication and role
  if (authLoading || roleChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to login
  if (!user) {
    return <Navigate to="/dentist-login-authentication" state={{ from: location }} replace />;
  }

  // Authenticated but not dentist when dentist required - redirect to access denied
  if (requireDentist && !isDentist) {
    return <Navigate to="/access-denied" replace />;
  }

  // Authorized - render children
  return <>{children}</>;
}