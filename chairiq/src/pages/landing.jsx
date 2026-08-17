import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowRight, Monitor, Link2, MessageSquare, ChevronDown } from 'lucide-react';
import HeroAnimation from '../components/HeroAnimation';

const FadeInSection = ({ children, className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-in-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`fade-in-section ${className}`}>
      {children}
    </div>
  );
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg0">
      <header className="sticky top-0 z-50 border-b" style={{ background: '#04070a', borderColor: 'rgba(94,217,234,0.10)' }}>
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="ChairIQ"
              style={{
                width: 'var(--logo-size, 2.25rem)',
                height: 'var(--logo-size, 2.25rem)',
                minWidth: 'var(--logo-size, 2.25rem)',
                flexShrink: 0,
                borderRadius: '8px'
              }}
            />
            <span
              className="font-bold"
              style={{
                fontSize: 'var(--brand-text-size, 1.25rem)',
                letterSpacing: 'var(--brand-letter-spacing, 0.02em)',
                lineHeight: 1
              }}>
              <span className="text-white">Chair</span><span style={{ color: '#22d3e0' }}>IQ</span>
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
              className="px-5 py-2.5 bg-accent text-accent-foreground rounded-md hover:brightness-110 font-medium transition-all text-sm">
              Request Access
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section relative overflow-hidden">
        <HeroAnimation />
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center hero-content-wrap">
          <div className="max-w-lg">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white leading-[1.08] mb-5" style={{ fontWeight: 700, letterSpacing: '-0.025em' }}>
              Patients get it.<br />You move on.
            </h1>
            <p className="text-lg sm:text-xl leading-snug max-w-md mb-4" style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 400, letterSpacing: '-0.01em' }}>
              Treatment plans patients actually read.
            </p>
            <p className="text-[15px] sm:text-base leading-relaxed max-w-md mb-2" style={{ color: 'rgba(255,255,255,0.52)', fontWeight: 400, letterSpacing: '0' }}>
              Fewer callbacks. Faster case acceptance.
            </p>
            <p className="text-[13px] sm:text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.38)', fontWeight: 400, letterSpacing: '0', maxWidth: '70%' }}>
              Stop re-explaining the same treatment plan.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="hero-cta-primary px-8 py-3.5 bg-accent text-accent-foreground text-[15px] rounded-lg font-semibold inline-flex items-center gap-2">
                Request Access
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 text-[13px] rounded-lg font-medium inline-flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.18)' }}>
                Dentist Login
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 scroll-indicator">
          <span className="text-[11px] font-medium tracking-wide uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>Learn more</span>
          <ChevronDown className="w-4 h-4 animate-bounce motion-reduce:animate-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-bg1">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <FadeInSection>
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-t1 tracking-[-0.02em] leading-tight mb-3">
              Built for Dental Practices
            </h2>
            <p className="text-t2 text-base leading-relaxed">
              Purpose-built tools for chair-side communication
            </p>
          </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 gap-x-12 gap-y-12 max-w-4xl mx-auto">
            <FadeInSection><div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Monitor className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">Visual Treatment Plans</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Chair-side ready visuals with procedure images and step-by-step explanations patients can review during consultation.
              </p>
            </div></FadeInSection>

            <FadeInSection><div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Send className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">SMS &amp; Email Delivery</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Send treatment plans directly to patients via text message or email. No app downloads, no logins — just instant access.
              </p>
            </div></FadeInSection>

            <FadeInSection><div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Link2 className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">Secure Patient Links</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Each patient gets a unique, secure link to their personalized treatment plan with no account required.
              </p>
            </div></FadeInSection>

            <FadeInSection><div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <MessageSquare className="w-5 h-5 text-accent flex-shrink-0" strokeWidth={1.8} />
                <h3 className="text-base font-semibold text-t1">AI Chat Assistant</h3>
              </div>
              <p className="text-t2 text-sm leading-relaxed">
                Patients can ask questions about their treatment anytime. AI provides accurate, context-aware answers based on their plan.
              </p>
            </div></FadeInSection>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
          <FadeInSection>
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-t1 tracking-[-0.02em] leading-tight mb-3">
              How It Works
            </h2>
            <p className="text-t2 text-base leading-relaxed">
              Simple workflow, powerful results
            </p>
          </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <FadeInSection><div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">1</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Create Plan</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Build a visual treatment plan with procedure details, images, and step-by-step explanations.
              </p>
            </div></FadeInSection>

            <FadeInSection><div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">2</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Share via SMS or Email</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Send the plan to your patient instantly. They receive a secure link to view everything.
              </p>
            </div></FadeInSection>

            <FadeInSection><div className="text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <span className="text-sm font-bold text-accent">3</span>
              </div>
              <h3 className="text-base font-semibold text-t1">Patient Reviews</h3>
              <p className="text-t2 text-sm leading-relaxed">
                Patients explore their plan, ask questions via AI chat, and feel confident about next steps.
              </p>
            </div></FadeInSection>
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
            className="px-8 py-3 bg-accent text-accent-foreground text-sm rounded-md hover:brightness-110 font-medium transition-all inline-flex items-center gap-2">
            Request Access
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <footer className="bg-bg0 border-t border-bd py-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="ChairIQ"
                style={{
                  width: '1.75rem',
                  height: '1.75rem',
                  minWidth: '1.75rem',
                  flexShrink: 0,
                  borderRadius: '6px'
                }}
              />
              <span className="font-semibold text-sm"><span className="text-t1">Chair</span><span className="text-accent">IQ</span></span>
            </div>
            <div className="flex gap-6 text-t3 text-sm">
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-t1 transition-colors">
                Privacy Policy
              </button>
              <button onClick={() => navigate('/terms-of-service')} className="hover:text-t1 transition-colors">
                Terms of Service
              </button>
              <button onClick={() => navigate('/sms')} className="hover:text-t1 transition-colors">
                SMS
              </button>
              <button onClick={() => navigate('/sms-consent')} className="hover:text-t1 transition-colors">
                SMS Consent
              </button>
            </div>
          </div>
          <div className="mt-6 pt-5 border-t border-bd">
            <div className="max-w-2xl mx-auto text-center space-y-1">
              <p className="text-t3 text-[10px] leading-snug font-medium uppercase tracking-wider">SMS Compliance</p>
              <p className="text-t3 text-[10px] leading-relaxed">
                By providing your phone number and opting in, you agree to receive SMS messages from ChairIQ related to treatment plan information. Message frequency varies. Msg &amp; data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent is not a condition of purchase.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
