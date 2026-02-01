import React from 'react';
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  unit?:string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, unit, helperText, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-body-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full h-[52px] px-4 rounded-md border text-body-lg text-gray-900',
            'placeholder:text-gray-300',
            'focus:outline-none focus:ring-2 focus:border-primary-500',
            'transition-all duration-150',
            error
              ? 'border-error-500 focus:ring-error-500/20'
              : 'border-gray-200 focus:ring-primary-500/20',
            className
          )}
          {...props}
        />
        {/* unit이 있을 때만 오른쪽에 표시 */}
        {unit && (
            <span className="absolute right-4 text-gray-400 text-sm pointer-events-none">
              {unit}
            </span>)}
        {(error || helperText) && (
          <p
            className={clsx(
              'mt-1.5 text-caption',
              error ? 'text-error-500' : 'text-gray-400'
            )}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;