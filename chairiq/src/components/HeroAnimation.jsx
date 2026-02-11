import React, { useState, useEffect } from 'react';

const slides = [
  '/assets/images/slides/hero-1.jpg',
  '/assets/images/slides/hero-2.jpg',
  '/assets/images/slides/hero-3.jpg',
  '/assets/images/slides/hero-4.jpg',
];

const INTERVAL = 8000;

const HeroAnimation = () => {
  const [active, setActive] = useState(0);
  const [motionOk, setMotionOk] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionOk(!mq.matches);
    const handler = (e) => setMotionOk(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!motionOk) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, [motionOk]);

  return (
    <div className="hero-bg-slideshow" aria-hidden="true">
      {slides.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`hero-bg-slide${i === active ? ' hero-bg-slide--active' : ''}`}
          draggable={false}
        />
      ))}
      <div className="hero-bg-overlay" />
    </div>
  );
};

export default HeroAnimation;
