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
        bg-accent hover:bg-accent2 text-t1 font-medium px-6 py-3 rounded
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg0
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
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