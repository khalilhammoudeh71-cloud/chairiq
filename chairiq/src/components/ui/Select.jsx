import React from "react";

export default function Select({ 
  children,
  className = '', 
  error = false,
  ...props 
}) {
  return (
    <select
      className={`
        w-full bg-bg0 text-t1
        border border-bd rounded-md px-4 py-3
        focus:outline-none focus:border-accent
        disabled:opacity-40 disabled:cursor-not-allowed
        transition-colors duration-150
        ${error ? 'border-danger' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}
