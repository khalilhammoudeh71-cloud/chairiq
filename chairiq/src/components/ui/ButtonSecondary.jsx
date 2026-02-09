import React from 'react';

export default function ButtonSecondary({ 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  size = 'default',
  ...props 
}) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    default: 'px-6 py-3'
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        bg-bg0 hover:bg-bg2 text-t1 font-medium rounded-md border border-bd
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg0
        transition-colors duration-150
        flex items-center justify-center gap-2
        ${sizeClasses[size] || sizeClasses.default}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-t1 border-t-transparent rounded-full"></span>
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}
