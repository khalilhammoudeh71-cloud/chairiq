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
        setIsDentist(true);
      }
      
      setRoleChecking(false);
    };

    if (!authLoading) {
      checkRole();
    }
  }, [user, authLoading, requireDentist]);

  if (authLoading || roleChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg1">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-accent mx-auto mb-4" style={{ animation: 'spin 1s linear infinite' }} />
          <p className="text-t2">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dentist-login-authentication" state={{ from: location }} replace />;
  }

  if (requireDentist && !isDentist) {
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
}