import React from 'react';


/**
 * PageShell - Container for page content with consistent background, padding, and max width
 * Uses semantic theme tokens: bg-bg0, consistent padding, max width constraint
 */
export default function PageShell({ children, className = '', maxWidth = '7xl' }) {
  const maxWidthClasses = {
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl'
  };

  return (
    <div className={`${maxWidthClasses?.[maxWidth]} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
}