import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, Monitor, Link2, MessageSquare, ShieldCheck } from 'lucide-react';


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg0">
      {/* Header */}
      <header className="bg-bg1 border-b border-bd sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center bg-[rgba(5,5,5,0.902)]">
          {/* Logo Container - Flexible for text or SVG logo */}
          <div className="flex items-center gap-3">
            {/* Logo Mark Container - Maintains aspect ratio for future SVG */}
            <div
              className="flex items-center justify-center rounded-full bg-accent"
              style={{
                width: 'var(--logo-size, 2.25rem)',
                height: 'var(--logo-size, 2.25rem)',
                minWidth: 'var(--logo-size, 2.25rem)',
                flexShrink: 0
              }}>

              <ShieldCheck
                className="text-white"
                strokeWidth={2.5}
                style={{
                  width: 'calc(var(--logo-size, 2.25rem) * 0.55)',
                  height: 'calc(var(--logo-size, 2.25rem) * 0.55)'
                }} />

            </div>
            {/* Brand Text - Flexible typography */}
            <span
              className="font-semibold text-t1"
              style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 'var(--brand-text-size, 1.25rem)',
                letterSpacing: 'var(--brand-letter-spacing, 0.08em)',
                lineHeight: 1
              }}>

              ChairIQ
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 text-t2 hover:text-t1 font-medium transition-colors">

              Dentist Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent2 font-medium transition-all"
              style={{ boxShadow: 'var(--shadow-button)' }}>

              Request Access
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Clean and Minimal */}
      <section className="relative overflow-hidden">
        <div className="bg-bg0 py-56 lg:py-72">
          <div className="max-w-6xl mx-auto px-8 sm:px-12 lg:px-16">
            <div className="text-center space-y-12">
              <h1 className="text-8xl sm:text-9xl lg:text-[10rem] font-semibold text-t1 leading-[0.95] tracking-[-0.02em] mb-16">
                Create. Send. Understood.
              </h1>
              
              <p className="text-2xl sm:text-3xl text-t2 font-normal leading-[1.7] max-w-3xl mx-auto">
                Build visual treatment plans, send via SMS, and help patients understand next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Merged and Simplified */}
      <section className="py-48 bg-bg1">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-40">
            <h2 className="text-6xl sm:text-7xl font-semibold text-t1 mb-8 leading-[1.15] tracking-[-0.015em]">Built for Dental Practices</h2>
            <p className="text-xl text-t2 font-normal leading-[1.7] mt-6">Purpose-built tools for chair-side communication</p>
          </div>
          
          {/* Feature Grid - No cards, borders, or shadows */}
          <div className="grid md:grid-cols-2 gap-x-24 gap-y-40 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-8">
                <Monitor className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">Visual Treatment Plans</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Chair-side ready visuals with procedure images and step-by-step explanations patients can review during consultation.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-8">
                <Send className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">SMS Delivery</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Send treatment plans directly to patients via text message. No app downloads, no logins—just instant access.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-8">
                <Link2 className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">Secure Patient Links</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Each patient gets a unique, secure link to their personalized treatment plan with no account required.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center space-y-6">
              <div className="flex justify-center mb-8">
                <MessageSquare className="w-12 h-12 text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">AI Chat Assistant</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Patients can ask questions about their treatment anytime. AI provides accurate, context-aware answers based on their plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-48 bg-bg0">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="text-center mb-40">
            <h2 className="text-6xl sm:text-7xl font-semibold text-t1 mb-8 leading-[1.15] tracking-[-0.015em]">How It Works</h2>
            <p className="text-xl text-t2 font-normal leading-[1.7] mt-6">Simple workflow, powerful results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-20 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/8 border border-accent/20 flex items-center justify-center mb-8">
                <span className="text-3xl font-semibold text-accent">1</span>
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">Create Plan</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Build a visual treatment plan with procedure details, images, and step-by-step explanations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/8 border border-accent/20 flex items-center justify-center mb-8">
                <span className="text-3xl font-semibold text-accent">2</span>
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">Send via SMS</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Text the plan to your patient instantly. They receive a secure link to view everything.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-accent/8 border border-accent/20 flex items-center justify-center mb-8">
                <span className="text-3xl font-semibold text-accent">3</span>
              </div>
              <h3 className="text-3xl font-semibold text-t1 leading-[1.3] tracking-[-0.01em] mb-6">Patient Reviews</h3>
              <p className="text-t2 text-lg font-normal leading-[1.7]">
                Patients explore their plan, ask questions via AI chat, and feel confident about next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 bg-bg1">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-6xl sm:text-7xl font-semibold text-t1 mb-8 leading-[1.15] tracking-[-0.015em]">
            Ready to improve patient understanding?
          </h2>
          <p className="text-xl text-t2 font-normal leading-[1.7] mb-12 mt-6">
            Join dental practices using ChairIQ to communicate treatment plans clearly and effectively.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-10 py-4 bg-accent text-white text-xl rounded-lg hover:bg-accent2 font-semibold transition-all inline-flex items-center gap-3"
            style={{ boxShadow: 'var(--shadow-button)' }}>

            Request Access
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg0 border-t border-bd py-12">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-full bg-accent"
                style={{
                  width: '2rem',
                  height: '2rem',
                  minWidth: '2rem',
                  flexShrink: 0
                }}>

                <ShieldCheck
                  className="text-white"
                  strokeWidth={2.5}
                  style={{
                    width: '1.1rem',
                    height: '1.1rem'
                  }} />

              </div>
              <span className="font-semibold text-t1 text-lg">ChairIQ</span>
            </div>
            <div className="flex gap-8 text-t2">
              <button onClick={() => navigate('/privacy')} className="hover:text-t1 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-t1 transition-colors">
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>);

};

export default Landing;