import React from 'react';
import { cn } from '../../utils/cn';

/**
 * LoadingSpinner - Reusable loading spinner component
 * Provides consistent loading states across the application
 */
export default function LoadingSpinner({ 
  size = 'default',
  variant = 'accent',
  className,
  fullScreen = false,
  text = null
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    accent: 'text-accent',
    t1: 'text-t1',
    t2: 'text-t2',
    t3: 'text-t3'
  };

  const spinner = (
    <svg 
      className={cn(
        'animate-spin',
        sizeClasses?.[size],
        colorClasses?.[variant],
        className
      )}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-bg0/80 flex flex-col items-center justify-center z-50">
        {spinner}
        {text && (
          <p className="mt-4 text-t2 text-sm">{text}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {spinner}
      {text && (
        <p className="mt-2 text-t2 text-sm">{text}</p>
      )}
    </div>
  );
}