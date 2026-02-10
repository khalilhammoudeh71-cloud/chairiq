import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-container" aria-hidden="true">
      <div className="hero-ambient hero-ambient-1" />
      <div className="hero-ambient hero-ambient-2" />

      <div className="hero-scene">
        <div className="hero-plan">
          <div className="hero-plan-bar">
            <div className="hero-plan-dot" />
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
          <div className="hero-plan-sep" />
          <div className="hero-plan-foot">
            <div className="hero-plan-text hero-plan-text-s" style={{ background: 'rgba(255,255,255,0.22)' }} />
            <div className="hero-plan-total">$1,545</div>
          </div>
          <div className="hero-send-indicator">
            <div className="hero-send-dot" />
            <span>Sending...</span>
          </div>
        </div>

        <div className="hero-transit">
          <div className="hero-transit-dot hero-transit-dot-1" />
          <div className="hero-transit-dot hero-transit-dot-2" />
          <div className="hero-transit-dot hero-transit-dot-3" />
        </div>

        <div className="hero-device">
          <div className="hero-device-notch" />
          <div className="hero-device-screen">
            <div className="hero-msg hero-msg-1">
              <div className="hero-msg-from">ChairIQ</div>
              <div className="hero-msg-body hero-msg-body-w" />
              <div className="hero-msg-body hero-msg-body-s" />
            </div>
            <div className="hero-msg hero-msg-2 hero-msg-link">
              <div className="hero-msg-link-icon" />
              <div className="hero-msg-body hero-msg-body-m" />
            </div>
            <div className="hero-msg hero-msg-3 hero-msg-summary">
              <div className="hero-summary-row">
                <div className="hero-summary-dot" />
                <div className="hero-msg-body hero-msg-body-m" />
                <div className="hero-summary-amt">$850</div>
              </div>
              <div className="hero-summary-row">
                <div className="hero-summary-dot hero-summary-dot-b" />
                <div className="hero-msg-body hero-msg-body-s" />
                <div className="hero-summary-amt">$420</div>
              </div>
              <div className="hero-summary-row">
                <div className="hero-summary-dot hero-summary-dot-g" />
                <div className="hero-msg-body hero-msg-body-m" />
                <div className="hero-summary-amt">$275</div>
              </div>
              <div className="hero-summary-sep" />
              <div className="hero-summary-row">
                <div className="hero-msg-body hero-msg-body-s" style={{ background: 'rgba(255,255,255,0.22)' }} />
                <div className="hero-summary-total">$1,545</div>
              </div>
              <div className="hero-summary-btn">Review Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroAnimation;
