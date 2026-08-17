import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function DentistLoginAuthentication() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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
        const isDentist = await authService?.isDentist();
        
        if (!isDentist) {
          await authService?.signOut();
          setError('Access denied. This portal is only for dentist administrators.');
          setLoading(false);
          return;
        }

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
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #04070a 0%, #0d161c 50%, #04070a 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #22d3e0 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.05]"
            style={{ background: 'radial-gradient(circle, var(--accent) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center px-12 max-w-lg">
          <img
            src="/logo.png"
            alt="ChairIQ"
            className="w-20 h-20 rounded-2xl mb-8"
          />

          <h2 className="text-4xl font-bold mb-4 tracking-tight">
            <span className="text-white">Chair</span><span style={{ color: '#22d3e0' }}>IQ</span>
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: 'rgba(237,244,246,0.8)' }}>
            Treatment plans patients actually read
          </p>

          <div className="w-16 h-px mb-8" style={{ background: 'rgba(94,217,234,0.25)' }} />

          <div className="space-y-4 text-sm" style={{ color: 'rgba(147,166,174,0.9)' }}>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" style={{ background: 'var(--accent)' }} />
              <span>Visual step-by-step treatment education</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
              <span>AI-powered patient communication</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />
              <span>Share plans via SMS or email in seconds</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 text-xs tracking-wide" style={{ color: 'rgba(91,109,118,0.9)' }}>
          Powered by ChairIQ
        </div>
      </div>

      <div className="w-full lg:w-1/2 bg-bg0 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <img
              src="/logo.png"
              alt="ChairIQ"
              className="w-14 h-14 rounded-xl mb-4 inline-block"
            />
            <h1 className="text-2xl font-bold"><span className="text-t1">Chair</span><span className="text-accent">IQ</span></h1>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-t1 mb-1">Welcome back</h1>
            <p className="text-t2">Dentist Portal</p>
          </div>

          <div className="card">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-danger/10 border border-danger rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-danger">{error}</p>
                </div>
              )}

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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

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

          <div className="mt-8 text-center text-xs text-t3 lg:hidden">
            Powered by ChairIQ
          </div>
        </div>
      </div>
    </div>
  );
}
