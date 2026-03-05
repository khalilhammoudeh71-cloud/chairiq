import React from 'react';

export default function Card({ children, className = '', accentColor, hover, padding, ...props }) {
  const accentStyle = accentColor ? { borderLeftColor: accentColor, borderLeftWidth: '3px' } : {};
  const paddingClass = padding || 'p-6';
  const hoverClass = hover ? 'hover:border-accent/30 transition-colors' : '';

  return (
    <div 
      className={`bg-bg1 border border-bd rounded-xl ${paddingClass} dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)] ${hoverClass} ${className}`}
      style={accentStyle}
      {...props}
    >
      {children}
    </div>
  );
}
