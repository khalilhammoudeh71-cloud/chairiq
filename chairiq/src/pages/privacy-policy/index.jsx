import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ChairIQ</title>
        <meta name="description" content="ChairIQ's Privacy Policy - Learn how we collect, use, and protect your information." />
      </Helmet>
      
      {/* Header */}
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1A202C' }}>Privacy Policy</h1>
          <p><strong>Effective Date:</strong> February 6, 2026</p>

          <p style={{ marginTop: '1.5rem' }}>
            ChairIQ ("we," "us," "our") provides a software platform used by dental practices
            to share appointment-related and treatment-plan information with patients.
            This Privacy Policy explains how information is collected and used.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Information We Collect</h2>
          <ul style={{ marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>Patient contact information provided by the dental practice (name, phone number).</li>
            <li style={{ marginBottom: '0.5rem' }}>Treatment-plan and appointment-related data.</li>
            <li style={{ marginBottom: '0.5rem' }}>Device and usage information (browser, IP address, pages viewed).</li>
            <li style={{ marginBottom: '0.5rem' }}>SMS delivery and opt-out status.</li>
          </ul>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>SMS Messaging</h2>
          <p style={{ marginBottom: '1rem' }}>
            If you opt in through your dental provider, you may receive SMS messages related
            to appointments or treatment plans. Message frequency varies.
            Message and data rates may apply. Reply <strong>STOP</strong> to opt out.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Data Sharing</h2>
          <p style={{ marginBottom: '1rem' }}>
            We do not sell personal data. Information may be shared with the dental practice
            and trusted service providers required to operate the platform.
          </p>

          <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '1rem', color: '#1A202C' }}>Security</h2>
          <p style={{ marginBottom: '1rem' }}>
            Reasonable safeguards are used to protect information. No system is 100% secure.
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