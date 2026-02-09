import React from 'react';

export default function ButtonPrimary({ 
  children, 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        bg-accent hover:brightness-110 text-white font-medium px-6 py-3 rounded-md
        focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100
        transition-colors duration-150
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}
