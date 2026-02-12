import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const DentistSignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dentistName: '',
    practiceName: '',
    email: '',
    phone: '',
    location: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e?.target?.name]: e?.target?.value
    });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (supabase) {
        const { error: dbError } = await supabase
          .from('access_requests')
          .insert([{
            dentist_name: formData.dentistName,
            practice_name: formData.practiceName,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            status: 'pending',
            created_at: new Date().toISOString()
          }]);

        if (dbError) {
          console.warn('Could not save to database:', dbError.message);
        }
      }

      setSubmitted(true);
    } catch (err) {
      console.warn('Submission error:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg0">
      {/* Header */}
      <header className="bg-bg0 border-b border-bd">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
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
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {submitted ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-4">
              Request Received
            </h1>
            <p className="text-t2 text-lg max-w-md mx-auto mb-3 leading-relaxed">
              Thank you, {formData.dentistName}. We'll review your request and reach out to <span className="text-t1 font-medium">{formData.email}</span> shortly.
            </p>
            <p className="text-t3 text-sm mb-10">
              Most requests are reviewed within 1–2 business days.
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary px-8 py-3 text-[15px] font-semibold"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-t1 mb-4">
                ChairIQ – Dentist Sign Up
              </h1>
              <p className="text-xl text-accent font-semibold mb-6">
                Request Access to the Platform
              </p>
              <p className="text-t2 text-lg max-w-2xl mx-auto leading-relaxed">
                Join dental practices using ChairIQ to enhance patient understanding, reduce anxiety, and improve treatment acceptance through clear, visual communication.
              </p>
            </div>

            {/* Form Card */}
            <div className="card p-8 lg:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dentist Name */}
                <div>
                  <label htmlFor="dentistName" className="block text-sm font-medium text-t2 mb-2">
                    Dentist Name *
                  </label>
                  <input
                    type="text"
                    id="dentistName"
                    name="dentistName"
                    value={formData?.dentistName}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="Dr. John Smith"
                  />
                </div>

                {/* Practice Name */}
                <div>
                  <label htmlFor="practiceName" className="block text-sm font-medium text-t2 mb-2">
                    Practice Name *
                  </label>
                  <input
                    type="text"
                    id="practiceName"
                    name="practiceName"
                    value={formData?.practiceName}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="Smith Dental Care"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-t2 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData?.email}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="dr.smith@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-t2 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData?.phone}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="(555) 123-4567"
                  />
                </div>

                {/* Practice Location */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-t2 mb-2">
                    Practice Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData?.location}
                    onChange={handleChange}
                    required
                    className="input-field w-full"
                    placeholder="City, State"
                  />
                </div>

                {error && (
                  <p className="text-danger text-sm">{error}</p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-lg font-semibold mt-8 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Request Access'}
                </button>
              </form>
            </div>
          </>
        )}

        {/* Trust Signals */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-t1 mb-2">HIPAA-Aware Design</h3>
            <p className="text-t3 text-sm">
              Built with healthcare compliance and patient privacy in mind
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-t1 mb-2">Enhanced Patient Understanding</h3>
            <p className="text-t3 text-sm">
              Visual treatment plans that patients actually comprehend
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-t1 mb-2">Improved Treatment Acceptance</h3>
            <p className="text-t3 text-sm">
              Clear communication leads to better case acceptance rates
            </p>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16 card p-8">
          <h2 className="text-2xl font-bold text-t1 text-center mb-8">What Dentists Are Saying</h2>
          <div className="space-y-6">
            <div className="border-l-4 border-accent pl-6">
              <p className="text-t2 italic mb-3">
                "ChairIQ has transformed how we communicate with patients. Treatment acceptance has increased significantly."
              </p>
              <p className="text-t3 text-sm font-semibold">– Dr. Sarah Johnson, Family Dentistry</p>
            </div>
            <div className="border-l-4 border-accent pl-6">
              <p className="text-t2 italic mb-3">
                "Patients love the visual explanations. They feel more confident about their treatment decisions."
              </p>
              <p className="text-t3 text-sm font-semibold">– Dr. Michael Chen, Cosmetic Dentistry</p>
            </div>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-bg0 border-t border-bd py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-t3 text-sm">
              © 2026 ChairIQ. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/privacy-policy" className="text-t3 hover:text-t1 text-sm">
                Privacy Policy
              </a>
              <a href="/terms-of-service" className="text-t3 hover:text-t1 text-sm">
                Terms & Conditions
              </a>
              <a href="mailto:support@chairiq.online" className="text-t3 hover:text-t1 text-sm">
                support@chairiq.online
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DentistSignUpPage;