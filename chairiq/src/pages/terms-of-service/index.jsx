import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms & Conditions | ChairIQ</title>
        <meta name="description" content="ChairIQ's Terms & Conditions - Learn about the terms of using our platform." />
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
          <h1 className="text-3xl sm:text-4xl font-bold text-t1 mb-2">Terms & Conditions</h1>
          <p className="text-t2 mb-10"><strong className="text-t1">Effective Date:</strong> February 6, 2026</p>

          <div className="space-y-8 text-t2 text-base sm:text-lg leading-relaxed">
            <p>
              By accessing or using ChairIQ, you agree to these Terms.
              ChairIQ is a software platform used by dental practices
              to share appointment and treatment-plan information.
            </p>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">No Medical Advice</h2>
              <p>
                ChairIQ does not provide medical or dental advice.
                All clinical decisions are made by your dental provider.
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">SMS Terms</h2>
              <p>
                By opting in to receive SMS messages from ChairIQ, you agree to receive appointment reminders and treatment plan information via text message. Message frequency varies. Msg & data rates may apply. Reply <strong className="text-t1">STOP</strong> to opt out at any time. Reply <strong className="text-t1">HELP</strong> for help. Consent is not a condition of purchase.
              </p>
              <p className="mt-3">
                <strong className="text-t1">Support:</strong> <a href="mailto:support@chairiq.online" className="text-accent hover:underline">support@chairiq.online</a>
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Acceptable Use</h2>
              <ul className="list-disc ml-6 space-y-2">
                <li>Do not misuse the platform or attempt unauthorized access.</li>
                <li>Do not interfere with system operation.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-t1 mb-3">Limitation of Liability</h2>
              <p>
                ChairIQ is provided "as is" without warranties.
                Liability is limited to the fullest extent permitted by law.
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