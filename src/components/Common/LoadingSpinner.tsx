import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'white' | 'gray';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

const colorClasses = {
  blue: 'border-blue-600 border-t-transparent',
  white: 'border-white border-t-transparent',
  gray: 'border-gray-600 border-t-transparent'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'blue',
  className = ''
}) => {
  return (
    <div
      className={`border-2 rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};