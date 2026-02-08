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
        bg-bg1 hover:bg-bg3 text-t1 font-medium rounded border border-bd
        hover:border-accent/30
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-bg0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-bg1
        flex items-center justify-center gap-2
        ${sizeClasses}
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