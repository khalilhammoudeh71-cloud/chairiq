import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, Monitor, Link2, MessageSquare, ShieldCheck } from 'lucide-react';
import HeroAnimation from '../components/HeroAnimation';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg0">
      <header className="sticky top-0 z-50 border-b" style={{ background: '#0a0c12', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
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
            <span
              className="font-semibold text-white"
              style={{
                fontSize: 'var(--brand-text-size, 1.25rem)',
                letterSpacing: 'var(--brand-letter-spacing, 0.04em)',
                lineHeight: 1
              }}>
              ChairIQ
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 font-medium transition-colors text-sm"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              Dentist Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-accent text-white rounded-md hover:brightness-110 font-medium transition-all text-sm">
              Request Access
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section relative overflow-hidden">
        <HeroAnimation />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center hero-content-wrap">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.05] mb-6" style={{ fontWeight: 800, letterSpacing: '-0.04em' }}>
              Patients get it.<br />You move on.
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed max-w-md mb-3" style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 400, letterSpacing: '-0.01em' }}>
              Treatment plans patients actually read.
            </p>
            <p className="text-base sm:text-lg leading-relaxed max-w-md mb-3" style={{ color: 'rgba(255,255,255,0.55)', fontWeight: 400, letterSpacing: '-0.01em' }}>
              Fewer callbacks. Faster case acceptance.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 400, maxWidth: '70%' }}>
              Stop re-explaining the same treatment plan.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="hero-cta-primary px-8 py-3.5 bg-accent text-white text-[15px] rounded-lg font-semibold inline-flex items-center gap-2">
                Request Access
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 text-[13px] rounded-lg font-medium inline-flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.55)' }}>
                Dentist Login
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-bg1">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-t1 tracking-[-0.02em] leading-tight mb-3">
              Built for Dental Practices
            </h2>
            <p className="text-t2 text-base leading-relaxed">
              Purpose-built tools for chair-side communication
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 max-w-4xl mx-auto">
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Monitor className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">Visual Treatment Plans</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Chair-side ready visuals with procedure images and step-by-step explanations patients can review during consultation.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Send className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">SMS Delivery</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Send treatment plans directly to patients via text message. No app downloads, no logins — just instant access.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Link2 className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">Secure Patient Links</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Each patient gets a unique, secure link to their personalized treatment plan with no account required.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">AI Chat Assistant</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Patients can ask questions about their treatment anytime. AI provides accurate, context-aware answers based on their plan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-t1 tracking-[-0.02em] leading-tight mb-3">
              How It Works
            </h2>
            <p className="text-t2 text-base leading-relaxed">
              Simple workflow, powerful results
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">1</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Create Plan</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Build a visual treatment plan with procedure details, images, and step-by-step explanations.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">2</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Send via SMS</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Text the plan to your patient instantly. They receive a secure link to view everything.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">3</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Patient Reviews</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Patients explore their plan, ask questions via AI chat, and feel confident about next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-bg1">
        <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-t1 tracking-[-0.02em] leading-tight mb-3">
            Ready to improve patient understanding?
          </h2>
          <p className="text-t2 text-base leading-relaxed mb-10">
            Join dental practices using ChairIQ to communicate treatment plans clearly and effectively.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-accent text-white text-sm rounded-md hover:brightness-110 font-medium transition-all inline-flex items-center gap-2">
            Request Access
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="bg-bg0 border-t border-bd py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex items-center justify-center rounded-full bg-accent"
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  minWidth: '1.75rem',
                  flexShrink: 0
                }}>
                <ShieldCheck
                  className="text-white"
                  strokeWidth={2.5}
                  style={{
                    width: '1rem',
                    height: '1rem'
                  }} />
              </div>
              <span className="font-semibold text-t1 text-sm">ChairIQ</span>
            </div>
            <div className="flex gap-6 text-t3 text-sm">
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
    </div>
  );
};

export default Landing;
