import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function SmsConsent() {
  return (
    <>
      <Helmet>
        <title>SMS Consent & Communication Policy | ChairIQ</title>
        <meta name="description" content="ChairIQ SMS Consent & Communication Policy - Learn about SMS messaging from your dental provider." />
      </Helmet>

      <header className="bg-bg0 border-b border-bd sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-t1">ChairIQ</span>
            </Link>
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-accent hover:text-accent-hover"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <div className="bg-bg0 min-h-screen">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-10">
            SMS Consent & Communication Policy
          </h1>

          <div className="space-y-6 text-t2 text-base sm:text-lg leading-relaxed">
            <p>
              By providing your mobile phone number to your dental provider, you consent to receive SMS (text) messages from ChairIQ on behalf of your provider. These messages may include appointment reminders, treatment plan notifications, and important healthcare updates.
            </p>

            <p>Message frequency may vary.</p>

            <p>Message and data rates may apply.</p>

            <p>
              You may opt out at any time by replying <strong className="text-t1">STOP</strong> to any message.
            </p>

            <p>
              For assistance, reply <strong className="text-t1">HELP</strong> or contact support at{' '}
              <a href="mailto:support@chairiq.online" className="text-accent hover:underline">
                support@chairiq.online
              </a>.
            </p>

            <div>
              <p className="mb-1">Your information is handled in accordance with our Privacy Policy:</p>
              <a
                href="https://chairiq.online/privacy-policy"
                className="text-accent hover:underline break-all"
              >
                https://chairiq.online/privacy-policy
              </a>
            </div>

            <div>
              <p className="mb-1">Terms of Service:</p>
              <a
                href="https://chairiq.online/terms-of-service"
                className="text-accent hover:underline break-all"
              >
                https://chairiq.online/terms-of-service
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
