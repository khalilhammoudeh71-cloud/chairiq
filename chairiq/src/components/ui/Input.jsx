import React from "react";


export default function Input({ 
  className = '', 
  error = false,
  ...props 
}) {
  return (
    <input
      className={`
        w-full bg-bg1 text-t1 placeholder:text-t3
        border border-bd rounded px-4 py-3
        hover:border-accent/30
        focus:outline-none focus:ring-2 focus:ring-ring focus:border-accent
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  );
}