import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  className?: string;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ 
  variant = 'default', 
  className = '', 
  children 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
  const variantClasses = {
    default: 'bg-blue-900/50 text-blue-300 border border-blue-500/30',
    secondary: 'bg-gray-700/50 text-gray-300 border border-gray-500/30',
    success: 'bg-green-900/50 text-green-300 border border-green-500/30',
    warning: 'bg-orange-900/50 text-orange-300 border border-orange-500/30',
    destructive: 'bg-red-900/50 text-red-300 border border-red-500/30',
    outline: 'border border-gray-600 text-gray-400'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
};