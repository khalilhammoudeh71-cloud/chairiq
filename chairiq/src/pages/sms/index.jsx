import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function SmsDisclosure() {
  return (
    <>
      <Helmet>
        <title>SMS Program Disclosure | ChairIQ</title>
        <meta name="description" content="ChairIQ SMS Program Disclosure - Learn about our SMS messaging practices." />
      </Helmet>

      <header className="bg-bg0 border-b border-bd sticky top-0 z-40">
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#1A202C' }}>SMS Program Disclosure</h1>

          <p style={{ marginBottom: '1rem' }}>
            Opt-in occurs when patients provide their phone number to their dental provider and agree to receive messages related to their care.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>ChairIQ SMS Program:</h2>
          <p style={{ marginBottom: '1rem' }}>
            ChairIQ sends appointment-related and treatment-plan SMS messages only to existing dental patients who have explicitly opted in through their dental provider.
          </p>
          <p style={{ marginBottom: '1rem' }}>Message frequency varies.</p>
          <p style={{ marginBottom: '1rem' }}>Msg &amp; data rates may apply.</p>
          <p style={{ marginBottom: '1rem' }}>Reply <strong>STOP</strong> to opt out.</p>
          <p style={{ marginBottom: '1rem' }}>Reply <strong>HELP</strong> for help.</p>
          <p style={{ marginBottom: '1.5rem' }}>Consent is not a condition of purchase.</p>

          <p style={{ marginBottom: '2rem' }}>
            <strong>Support:</strong>{' '}
            <a href="mailto:support@chairiq.online" style={{ color: '#4A90E2', textDecoration: 'underline' }}>support@chairiq.online</a>
          </p>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <p style={{ marginBottom: '0.75rem' }}>
              <a href="/privacy-policy" style={{ color: '#4A90E2', textDecoration: 'underline', fontWeight: '600' }}>Privacy Policy</a>
            </p>
            <p>
              <a href="/terms-of-service" style={{ color: '#4A90E2', textDecoration: 'underline', fontWeight: '600' }}>Terms of Service</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
