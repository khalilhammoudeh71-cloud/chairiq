import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-container" aria-hidden="true">
      <div className="hero-ambient hero-ambient-1" />

      <div className="hero-scene">
        <div className="hero-plan ha-step-1">
          <div className="hero-plan-bar">
            <div className="hero-plan-indicator" />
            <div className="hero-plan-title" />
          </div>
          <div className="hero-plan-sep" />
          <div className="hero-plan-line">
            <div className="hero-plan-bullet" />
            <div className="hero-plan-text" style={{ width: '70%' }} />
            <div className="hero-plan-amt">$850</div>
          </div>
          <div className="hero-plan-line">
            <div className="hero-plan-bullet" />
            <div className="hero-plan-text" style={{ width: '55%' }} />
            <div className="hero-plan-amt">$420</div>
          </div>
          <div className="hero-plan-line">
            <div className="hero-plan-bullet" />
            <div className="hero-plan-text" style={{ width: '65%' }} />
            <div className="hero-plan-amt">$275</div>
          </div>
          <div className="hero-plan-badge">3 Procedures</div>
          <div className="hero-plan-sep" />
          <div className="hero-plan-foot">
            <div className="hero-plan-text" style={{ width: '40%', background: 'rgba(255,255,255,0.22)' }} />
            <div className="hero-plan-total">$1,545</div>
          </div>
          <div className="hero-send-btn">Send via SMS</div>
        </div>

        <div className="hero-device ha-step-2">
          <div className="hero-device-notch" />
          <div className="hero-device-screen">
            <div className="hero-phone-header">
              <div className="hero-phone-logo" />
              <span>ChairIQ</span>
            </div>
            <div className="hero-phone-sep" />
            <div className="hero-phone-content ha-step-3">
              <div className="hero-phone-item">
                <div className="hero-phone-bullet" />
                <div className="hero-phone-label" style={{ width: '70%' }} />
                <div className="hero-phone-price">$850</div>
              </div>
              <div className="hero-phone-item">
                <div className="hero-phone-bullet" />
                <div className="hero-phone-label" style={{ width: '55%' }} />
                <div className="hero-phone-price">$420</div>
              </div>
              <div className="hero-phone-item">
                <div className="hero-phone-bullet" />
                <div className="hero-phone-label" style={{ width: '65%' }} />
                <div className="hero-phone-price">$275</div>
              </div>
              <div className="hero-phone-sep" />
              <div className="hero-phone-total-row">
                <span className="hero-phone-total-label">Total</span>
                <span className="hero-phone-total-value">$1,545</span>
              </div>
              <div className="hero-phone-status">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
