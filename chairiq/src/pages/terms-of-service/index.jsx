import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | ChairIQ</title>
        <meta name="description" content="ChairIQ's Terms & Conditions - Learn about the terms of using our platform." />
      </Helmet>
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-text-1">ChairIQ</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-bg-0 min-h-screen">
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6', color: '#4A5568' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1A202C' }}>Terms & Conditions</h1>
          <p><strong>Effective Date:</strong> February 6, 2026</p>

          <p style={{ marginTop: '1.5rem' }}>
            By accessing or using ChairIQ, you agree to these Terms.
            ChairIQ is a software platform used by dental practices
            to share appointment and treatment-plan information.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>No Medical Advice</h2>
          <p style={{ marginBottom: '1rem' }}>
            ChairIQ does not provide medical or dental advice.
            All clinical decisions are made by your dental provider.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>SMS Terms</h2>
          <p style={{ marginBottom: '1rem' }}>
            By providing your mobile phone number through your dental provider, you expressly consent to receive SMS messages from ChairIQ related to appointments, treatment plans, and care coordination. Message frequency varies. Message and data rates may apply. Reply <strong>STOP</strong> to opt out at any time or <strong>HELP</strong> for assistance.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Acceptable Use</h2>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Do not misuse the platform or attempt unauthorized access.</li>
            <li style={{ marginBottom: '0.5rem' }}>Do not interfere with system operation.</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Limitation of Liability</h2>
          <p style={{ marginBottom: '1rem' }}>
            ChairIQ is provided "as is" without warranties.
            Liability is limited to the fullest extent permitted by law.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Contact</h2>
          <p style={{ marginBottom: '2rem' }}>
            Email: <a href="mailto:support@chairiq.online" style={{ color: '#4A90E2', textDecoration: 'underline' }}>support@chairiq.online</a>
          </p>
        </div>
      </div>
    </>
  );
}