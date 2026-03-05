import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Eye, EyeOff, ShieldCheck, Sparkles, Users, BarChart3 } from 'lucide-react';
import { authService } from '../../services/authService';

const DentistSignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    practiceName: '',
    email: '',
    phone: '',
    location: '',
    password: '',
    confirmPassword: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    const { data, error: signUpError } = await authService.signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      practiceName: formData.practiceName,
      phone: formData.phone,
      location: formData.location
    });

    setSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-shrink-0 flex-col justify-between p-10 xl:p-12" style={{ background: 'linear-gradient(135deg, #0c0e14 0%, #1a1d2e 100%)' }}>
        <div>
          <div
            className="flex items-center space-x-3 cursor-pointer mb-16"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">ChairIQ</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
            Treatment plans patients actually read.
          </h2>
          <p className="text-white/60 text-base leading-relaxed mb-12">
            Join dental practices using visual, AI-powered treatment plans to boost case acceptance and patient understanding.
          </p>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">AI-Powered Content</p>
                <p className="text-white/50 text-sm">Auto-generate patient-friendly explanations for any procedure</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Better Patient Engagement</p>
                <p className="text-white/50 text-sm">Visual step-by-step guides patients can review anytime</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Track Engagement</p>
                <p className="text-white/50 text-sm">See which patients viewed their plans and for how long</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-white/30 text-xs">
          © {new Date().getFullYear()} ChairIQ. All rights reserved.
        </p>
      </div>

      <div className="flex-1 bg-bg0 flex flex-col">
        <header className="lg:hidden bg-bg0 border-b border-bd">
          <div className="px-4 sm:px-6 py-4 flex justify-between items-center">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-t1">ChairIQ</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-4 py-2 text-t2 hover:text-t1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </header>

        <div className="hidden lg:flex justify-end px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 text-t2 hover:text-t1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-0">
          <div className="w-full max-w-xl">
            {submitted ? (
              <div className="text-center py-12 lg:py-16">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #0c0e14 0%, #1a1d2e 100%)' }}>
                  <CheckCircle className="w-10 h-10 text-accent" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-4">
                  Check Your Email
                </h1>
                <p className="text-t2 text-lg max-w-md mx-auto mb-3 leading-relaxed">
                  We sent a verification link to <span className="text-t1 font-medium">{formData.email}</span>.
                </p>
                <p className="text-t3 text-sm mb-10 max-w-sm mx-auto">
                  Click the link in the email to verify your account. Once verified, you can log in immediately.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="btn-primary px-8 py-3 text-[15px] font-semibold"
                >
                  Go to Login
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-10">
                  <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-3">
                    Join ChairIQ
                  </h1>
                  <p className="text-t2 text-base max-w-md mx-auto leading-relaxed">
                    Start delivering visual treatment plans in minutes
                  </p>
                </div>

                <div className="card p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-t2 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                        placeholder="Dr. Jane Smith"
                      />
                    </div>

                    <div>
                      <label htmlFor="practiceName" className="block text-sm font-medium text-t2 mb-1.5">
                        Practice Name *
                      </label>
                      <input
                        type="text"
                        id="practiceName"
                        name="practiceName"
                        value={formData.practiceName}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                        placeholder="Smith Dental Care"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-t2 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field w-full"
                        placeholder="dr.smith@example.com"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-t2 mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-t2 mb-1.5">
                          Practice Location
                        </label>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="input-field w-full"
                          placeholder="City, State"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-t2 mb-1.5">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          minLength={6}
                          className="input-field w-full pr-10"
                          placeholder="At least 6 characters"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-t3 hover:text-t2"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-t2 mb-1.5">
                        Confirm Password *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="input-field w-full"
                        placeholder="Re-enter your password"
                      />
                    </div>

                    {error && (
                      <p className="text-danger text-sm py-1">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full py-3.5 text-base font-semibold mt-2 disabled:opacity-50"
                    >
                      {submitting ? 'Creating Account...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-t3 text-sm pt-2">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => navigate('/login')}
                        className="text-accent hover:underline font-medium"
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:block text-center pb-4">
          <p className="text-t3 text-xs">Powered by ChairIQ</p>
        </div>
      </div>
    </div>
  );
};

export default DentistSignUpPage;
