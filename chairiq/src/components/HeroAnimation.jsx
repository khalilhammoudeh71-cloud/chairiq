import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-scan" aria-hidden="true">
      <div className="hero-scan-glow" />
      <div className="hero-scan-form">
        <div className="hero-scan-contour hsc-1" />
        <div className="hero-scan-contour hsc-2" />
        <div className="hero-scan-contour hsc-3" />
        <div className="hero-scan-contour hsc-4" />
        <div className="hero-scan-contour hsc-5" />
        <div className="hero-scan-contour hsc-6" />
        <div className="hero-scan-contour hsc-7" />
        <div className="hero-scan-core" />
        <div className="hero-scan-line" />
      </div>
    </div>
  );
};

export default HeroAnimation;
