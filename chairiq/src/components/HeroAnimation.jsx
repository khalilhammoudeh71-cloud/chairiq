import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-demo-container" aria-hidden="true">
      <div className="hero-demo-glow hero-demo-glow-1" />
      <div className="hero-demo-glow hero-demo-glow-2" />

      <div className="hero-demo-scene">
        <div className="hero-card hero-card-1">
          <div className="hero-card-header">
            <div className="hero-card-dot hero-card-dot-blue" />
            <div className="hero-card-title-bar" />
          </div>
          <div className="hero-card-row">
            <div className="hero-card-icon-sm" />
            <div className="hero-card-line hero-card-line-long" />
          </div>
          <div className="hero-card-row">
            <div className="hero-card-icon-sm" />
            <div className="hero-card-line hero-card-line-med" />
          </div>
          <div className="hero-card-row">
            <div className="hero-card-icon-sm hero-card-icon-green" />
            <div className="hero-card-line hero-card-line-short" />
          </div>
          <div className="hero-card-badge">3 Procedures</div>
        </div>

        <div className="hero-card hero-card-2">
          <div className="hero-card-header">
            <div className="hero-card-dot hero-card-dot-green" />
            <div className="hero-card-title-bar hero-card-title-bar-wide" />
          </div>
          <div className="hero-card-body-block" />
          <div className="hero-card-row">
            <div className="hero-card-line hero-card-line-long" />
          </div>
          <div className="hero-card-row">
            <div className="hero-card-line hero-card-line-med" />
          </div>
          <div className="hero-card-badge hero-card-badge-green">Sent via SMS</div>
        </div>

        <div className="hero-phone">
          <div className="hero-phone-notch" />
          <div className="hero-phone-screen">
            <div className="hero-sms-bubble hero-sms-bubble-1 hero-sms-incoming">
              <div className="hero-sms-label">ChairIQ</div>
              <div className="hero-sms-text-line" />
              <div className="hero-sms-text-line hero-sms-text-short" />
            </div>
            <div className="hero-sms-bubble hero-sms-bubble-2 hero-sms-link">
              <div className="hero-sms-link-icon" />
              <div className="hero-sms-text-line hero-sms-text-med" />
            </div>
            <div className="hero-sms-bubble hero-sms-bubble-3 hero-sms-plan-card">
              <div className="hero-plan-header">
                <div className="hero-plan-title-bar" />
                <div className="hero-plan-status">Pending</div>
              </div>
              <div className="hero-plan-divider" />
              <div className="hero-plan-row">
                <div className="hero-plan-dot" />
                <div className="hero-sms-text-line hero-sms-text-med" />
                <div className="hero-plan-cost">$850</div>
              </div>
              <div className="hero-plan-row">
                <div className="hero-plan-dot hero-plan-dot-blue" />
                <div className="hero-sms-text-line hero-sms-text-short" />
                <div className="hero-plan-cost">$420</div>
              </div>
              <div className="hero-plan-row">
                <div className="hero-plan-dot hero-plan-dot-green" />
                <div className="hero-sms-text-line hero-sms-text-med" />
                <div className="hero-plan-cost">$275</div>
              </div>
              <div className="hero-plan-divider" />
              <div className="hero-plan-total-row">
                <div className="hero-sms-text-line hero-sms-text-short" style={{ background: 'rgba(255,255,255,0.25)' }} />
                <div className="hero-plan-total">$1,545</div>
              </div>
              <div className="hero-plan-accept-btn">Review Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
