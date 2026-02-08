import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Icon and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-danger/10 rounded-full mb-4">
            <ShieldAlert className="w-10 h-10 text-danger" />
          </div>
          <h1 className="text-3xl font-bold text-text-1 mb-2">Access Restricted</h1>
          <p className="text-lg text-text-2">Insufficient permissions for this resource</p>
        </div>

        {/* Main Content Card */}
        <div className="card p-8">
          <div className="space-y-6">
            {/* Explanation */}
            <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
              <p className="text-sm text-danger">
                The page you are trying to access requires dentist-level administrative privileges.
                Your current account does not have the necessary permissions to view this content.
              </p>
            </div>

            {/* Why This Happened */}
            <div>
              <h2 className="text-lg font-semibold text-text-1 mb-3">Why am I seeing this?</h2>
              <ul className="space-y-2 text-sm text-text-2">
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-1">•</span>
                  <span>You are not signed in with a dentist administrator account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-1">•</span>
                  <span>Your account does not have the required role permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-danger mt-1">•</span>
                  <span>This area is restricted to authorized dental professionals only</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dentist-login-authentication')}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                Sign In as Admin
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn-secondary w-full py-3 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Return to Patient Portal
              </button>
            </div>

            {/* Contact Information */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-text-2 mb-2">
                <span className="font-medium">Need access?</span>
              </p>
              <p className="text-sm text-text-3">
                Contact your practice administrator to request dentist-level access to admin features.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="mt-6 text-center text-sm text-text-3">
          <p>This security restriction protects sensitive patient and practice information.</p>
        </div>
      </div>
    </div>
  );
}