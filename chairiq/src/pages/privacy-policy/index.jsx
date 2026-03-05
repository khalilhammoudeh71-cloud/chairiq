import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ChairIQ</title>
        <meta name="description" content="ChairIQ's Privacy Policy - Learn how we collect, use, and protect your information." />
      </Helmet>
      
      <header className="bg-bg0 border-b-2 border-accent/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-t1">ChairIQ</span>
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-accent hover:text-accent2 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-bg0 min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-2">Privacy Policy</h1>
          <p className="text-t2 mb-10"><strong className="text-t1">Effective Date:</strong> February 6, 2026</p>

          <div className="space-y-8 text-t2 text-base sm:text-lg leading-relaxed">
            <p>
              ChairIQ ("we," "us," "our") provides a software platform used by dental practices
              to share appointment-related and treatment-plan information with patients.
              This Privacy Policy explains how information is collected and used.
            </p>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Information We Collect</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Patient contact information provided by the dental practice (name, phone number).</li>
                <li>Treatment-plan and appointment-related data.</li>
                <li>Device and usage information (browser, IP address, pages viewed).</li>
                <li>SMS delivery and opt-out status.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">SMS Messaging</h2>
              <p>
                If you opt in through your dental provider, you may receive SMS messages related
                to appointments or treatment plans. Message frequency varies.
                Message and data rates may apply. Reply <strong className="text-t1">STOP</strong> to opt out.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Data Sharing</h2>
              <p>
                We do not sell personal data. Information may be shared with the dental practice
                and trusted service providers required to operate the platform.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Security</h2>
              <p>
                Reasonable safeguards are used to protect information. No system is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">SMS Privacy</h2>
              <p>
                If you opt in to receive SMS messages, we use your phone number to send appointment-related and treatment plan messages. We do not sell your phone number. We may use service providers (e.g., SMS carriers and messaging platforms) to deliver messages. You can opt out anytime by replying STOP.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Contact</h2>
              <p>
                Email: <a href="mailto:support@chairiq.online" className="text-accent hover:underline">support@chairiq.online</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}