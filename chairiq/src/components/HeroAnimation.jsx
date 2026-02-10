import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-container" aria-hidden="true">
      <div className="hero-ambient hero-ambient-1" />

      <div className="hero-scene">
        <div className="hero-plan ha-plan">
          <div className="hero-plan-bar">
            <div className="hero-plan-indicator" />
            <div className="hero-plan-title" />
          </div>
          <div className="hero-plan-sep" />
          <div className="hero-plan-line">
            <div className="hero-plan-bullet" />
            <div className="hero-plan-text hero-plan-text-w" />
            <div className="hero-plan-amt">$850</div>
          </div>
          <div className="hero-plan-line">
            <div className="hero-plan-bullet hero-plan-bullet-b" />
            <div className="hero-plan-text hero-plan-text-m" />
            <div className="hero-plan-amt">$420</div>
          </div>
          <div className="hero-plan-line">
            <div className="hero-plan-bullet hero-plan-bullet-g" />
            <div className="hero-plan-text hero-plan-text-w" />
            <div className="hero-plan-amt">$275</div>
          </div>
          <div className="hero-plan-badge">3 Procedures</div>
          <div className="hero-plan-sep" />
          <div className="hero-plan-foot">
            <div className="hero-plan-text hero-plan-text-s" style={{ background: 'rgba(255,255,255,0.22)' }} />
            <div className="hero-plan-total">$1,545</div>
          </div>
          <div className="hero-send-btn ha-send">Send via SMS</div>
        </div>

        <div className="hero-device ha-device">
          <div className="hero-device-notch" />
          <div className="hero-device-screen">
            <div className="hero-phone-header ha-ph-1">
              <div className="hero-phone-logo" />
              <span>ChairIQ</span>
            </div>
            <div className="hero-phone-sep ha-ph-1" />
            <div className="hero-phone-item ha-ph-2">
              <div className="hero-phone-dot" />
              <div className="hero-phone-label" style={{ width: '70%' }} />
              <div className="hero-phone-price">$850</div>
            </div>
            <div className="hero-phone-item ha-ph-2">
              <div className="hero-phone-dot hero-phone-dot-b" />
              <div className="hero-phone-label" style={{ width: '55%' }} />
              <div className="hero-phone-price">$420</div>
            </div>
            <div className="hero-phone-item ha-ph-3">
              <div className="hero-phone-dot hero-phone-dot-g" />
              <div className="hero-phone-label" style={{ width: '65%' }} />
              <div className="hero-phone-price">$275</div>
            </div>
            <div className="hero-phone-sep ha-ph-3" />
            <div className="hero-phone-total-row ha-ph-4">
              <span className="hero-phone-total-label">Total</span>
              <span className="hero-phone-total-value">$1,545</span>
            </div>
            <div className="hero-phone-status ha-ph-4">
              <div className="hero-phone-status-dot" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
