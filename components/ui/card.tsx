import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`border-b pb-4 mb-4 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-bold ${className}`}>{children}</h2>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`${className}`}>{children}</div>
);
