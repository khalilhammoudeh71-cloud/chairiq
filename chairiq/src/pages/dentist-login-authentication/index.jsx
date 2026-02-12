import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function DentistLoginAuthentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Redirect if already authenticated as dentist
  useEffect(() => {
    const checkDentistAccess = async () => {
      if (isAuthenticated) {
        const isDentist = await authService?.isDentist();
        if (isDentist) {
          navigate('/create-patient-plan');
        }
      }
    };
    checkDentistAccess();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await authService?.signIn(email, password);
      
      if (signInError) {
        setError(signInError?.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      if (data?.user) {
        // Check if user is a dentist
        const isDentist = await authService?.isDentist();
        
        if (!isDentist) {
          await authService?.signOut();
          setError('Access denied. This portal is only for dentist administrators.');
          setLoading(false);
          return;
        }

        // Success - navigate to admin area
        navigate('/create-patient-plan');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg0 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4">
            <Lock className="w-8 h-8 text-bg0" />
          </div>
          <h1 className="text-3xl font-bold text-t1 mb-2">ChairIQ</h1>
          <p className="text-xl text-t2">Admin Access</p>
        </div>

        {/* Login Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-danger/10 border border-danger rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                <p className="text-sm text-danger">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-t2 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e?.target?.value)}
                className="input-field w-full"
                placeholder="dentist@chairiq.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-t2 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e?.target?.value)}
                  className="input-field w-full pr-12"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t1 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="mt-6 text-center text-sm text-t3">
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-accent hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}