import React from 'react';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-500 text-white shadow-button active:bg-primary-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none',
  secondary:
    'bg-primary-50 text-primary-600 active:bg-primary-100 disabled:bg-gray-100 disabled:text-gray-400',
  outline:
    'bg-white border border-gray-200 text-gray-700 active:bg-gray-50 disabled:border-gray-100 disabled:text-gray-300',
  ghost:
    'bg-transparent text-gray-500 active:bg-gray-50 disabled:text-gray-300',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-body-sm rounded-sm gap-1.5',
  md: 'h-11 px-4 text-body-md rounded-md gap-2',
  lg: 'h-[52px] px-5 text-body-lg rounded-md font-medium gap-2',
  xl: 'h-14 px-6 text-body-lg rounded-lg font-semibold gap-2',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      loading = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center transition-all duration-150 font-medium',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          loading && 'opacity-70 pointer-events-none',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;