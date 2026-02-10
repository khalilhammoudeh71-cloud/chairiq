import React from 'react';

const HeroAnimation = () => {
  return (
    <div className="hero-geo" aria-hidden="true">
      <div className="hero-geo-glow" />
      <div className="hero-geo-form">
        <div className="hero-geo-facet hero-geo-f1" />
        <div className="hero-geo-facet hero-geo-f2" />
        <div className="hero-geo-facet hero-geo-f3" />
        <div className="hero-geo-facet hero-geo-f4" />
        <div className="hero-geo-facet hero-geo-f5" />
        <div className="hero-geo-ridge hero-geo-r1" />
        <div className="hero-geo-ridge hero-geo-r2" />
        <div className="hero-geo-ridge hero-geo-r3" />
        <div className="hero-geo-light" />
      </div>
    </div>
  );
};

export default HeroAnimation;
