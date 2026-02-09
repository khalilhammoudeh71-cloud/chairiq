import React from "react";

export default function Textarea({ 
  className = '', 
  error = false,
  ...props 
}) {
  return (
    <textarea
      className={`
        w-full bg-bg0 text-t1 placeholder:text-t3
        border border-bd rounded-md px-4 py-3
        focus:outline-none focus:border-accent
        disabled:opacity-40 disabled:cursor-not-allowed
        resize-none
        transition-colors duration-150
        ${error ? 'border-danger' : ''}
        ${className}
      `}
      {...props}
    />
  );
}
