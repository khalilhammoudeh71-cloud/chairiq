import React from 'react';


/**
 * Card - Reusable card component with consistent styling
 * Minimal, clinical design for medical-grade interface
 */
export default function Card({ children, className = '', ...props }) {
  return (
    <div 
      className={`bg-bg1 border border-bd rounded p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}