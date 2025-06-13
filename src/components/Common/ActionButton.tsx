import React, { useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Check } from 'lucide-react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => Promise<void> | void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  showSuccessState?: boolean;
}

const variantClasses = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white'
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  showSuccessState = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    setIsLoading(true);
    try {
      await onClick();
      
      if (showSuccessState) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const baseClasses = `
    inline-flex items-center justify-center space-x-2 rounded-lg font-medium 
    transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const currentVariant = showSuccess ? 'success' : variant;

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`
        ${baseClasses}
        ${variantClasses[currentVariant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <LoadingSpinner size="sm" color="white" />
          <span>Procesando...</span>
        </>
      ) : showSuccess ? (
        <>
          <Check className="w-4 h-4" />
          <span>¡Completado!</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};