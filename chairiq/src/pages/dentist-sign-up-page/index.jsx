import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
    confirmPassword: '',
    smsConsent: false
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
    <div className="min-h-screen bg-bg0">
      <header className="bg-bg0 border-b border-bd">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-2xl font-bold text-t1">ChairIQ</span>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-4 py-2 text-t2 hover:text-t1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {submitted ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-6">
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
                Create Your Account
              </h1>
              <p className="text-t2 text-base max-w-md mx-auto leading-relaxed">
                Sign up to start creating treatment plans your patients will actually understand.
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
                      Mobile Number (optional)
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

                <div className="space-y-3">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.smsConsent}
                      onChange={(e) => setFormData({ ...formData, smsConsent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 rounded border-bd accent-accent"
                    />
                    <span className="text-sm text-t2">I agree to receive SMS messages from ChairIQ.</span>
                  </label>
                  <p className="text-xs text-t3 leading-relaxed">
                    <span className="font-semibold text-t2">SMS Consent:</span> By providing your mobile number and opting in, you agree to receive SMS messages from ChairIQ related to appointments and treatment plans. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent is not a condition of purchase.
                  </p>
                  <p className="text-xs text-t3">
                    Support: <a href="mailto:support@chairiq.online" className="text-accent hover:underline">support@chairiq.online</a>
                  </p>
                  <p className="text-xs text-t3 flex gap-3">
                    <a href="/privacy-policy" className="text-accent hover:underline">Privacy Policy</a>
                    <a href="/terms-of-service" className="text-accent hover:underline">Terms</a>
                  </p>
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
  );
};

export default DentistSignUpPage;
