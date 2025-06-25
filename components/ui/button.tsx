import React from 'react';

export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button className="px-4 py-2 bg-black text-white rounded hover:opacity-90" {...props}>
    {children}
  </button>
);
