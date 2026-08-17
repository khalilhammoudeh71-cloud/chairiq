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
      style={{ color: 'var(--accent-ink)' }}
      className={`
        bg-accent hover:brightness-110 font-medium px-6 py-3 rounded-md
        focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/30
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100
        transition-colors duration-150
        flex items-center justify-center gap-2
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full" style={{ borderColor: 'var(--accent-ink)', borderTopColor: 'transparent' }}></span>
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
}
