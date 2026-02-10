import React, { useState, useEffect } from 'react';

const slides = [
  '/assets/images/slides/dental-1.jpg',
  '/assets/images/slides/dental-2.jpg',
  '/assets/images/slides/dental-3.jpg',
  '/assets/images/slides/dental-4.jpg',
];

const HeroAnimation = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-slides" aria-hidden="true">
      {slides.map((src, i) => (
        <div
          key={i}
          className={`hero-slide ${i === active ? 'hero-slide-active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="hero-slides-overlay" />
    </div>
  );
};

export default HeroAnimation;
