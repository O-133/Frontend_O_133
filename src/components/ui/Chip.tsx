import React from 'react';
import { clsx } from 'clsx';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'primary';
  size?: 'sm' | 'md';
  className?: string;
}

export default function Chip({
  children,
  selected = false,
  onClick,
  variant = 'default',
  size = 'md',
  className,
}: ChipProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-150';

  const sizeStyles = {
    sm: 'px-3 py-1 text-caption',
    md: 'px-4 py-2 text-body-sm',
  };

  const variantStyles = {
    default: selected
      ? 'bg-primary-500 text-white shadow-button'
      : 'bg-gray-100 text-gray-600 active:bg-gray-200',
    primary: selected
      ? 'bg-primary-500 text-white shadow-button'
      : 'bg-primary-50 text-primary-600 active:bg-primary-100',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </button>
  );
}