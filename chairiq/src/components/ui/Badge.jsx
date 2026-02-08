import React from 'react';


/**
 * Badge component with semantic theme tokens
 * Soft, professional styling for clinical interface
 */
export default function Badge({ 
  children, 
  variant = 'neutral',
  className = '',
  ...props 
}) {
  const variants = {
    neutral: 'bg-bg2 text-t2 border-bd',
    success: 'bg-success/6 text-success border-success/15',
    warning: 'bg-warning/6 text-warning border-warning/15',
    danger: 'bg-danger/6 text-danger border-danger/15',
    accent: 'bg-accent/6 text-accent border-accent/15'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1 px-3 py-1 
        text-sm font-medium rounded-md border
        ${variants?.[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
}