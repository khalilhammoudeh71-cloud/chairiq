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
        w-full bg-bg1 text-t1
        border border-bd rounded px-4 py-3
        hover:border-accent/30
        focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
  );
}