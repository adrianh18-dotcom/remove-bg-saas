import React from 'react';

export const Card = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="rounded-xl shadow-lg border p-4 bg-white" {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
);
