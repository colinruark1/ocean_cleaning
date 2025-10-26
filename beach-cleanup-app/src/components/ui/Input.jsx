import { forwardRef } from 'react';

/**
 * Input component with label and error handling
 * @param {Object} props
 * @param {string} [props.label] - Input label
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {React.ReactNode} [props.leftIcon] - Icon on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon on the right
 * @param {string} [props.className] - Additional CSS classes
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1" style={{color: 'var(--color-text-primary)'}}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--color-text-tertiary)'}}>
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border rounded-lg transition-all duration-200
            focus:ring-2 focus:ring-ocean-500 focus:border-transparent
            disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
          `}
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            color: 'var(--color-text-primary)',
            borderColor: hasError ? '#EF4444' : 'var(--color-border)',
            '--tw-placeholder-opacity': '1'
          }}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{color: 'var(--color-text-tertiary)'}}>
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && !error && (
        <p className="mt-1 text-sm" style={{color: 'var(--color-text-secondary)'}}>{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * Textarea component
 */
export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className = '',
  rows = 4,
  ...props
}, ref) => {
  const hasError = !!error;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium mb-1" style={{color: 'var(--color-text-primary)'}}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`
          w-full px-4 py-2 border rounded-lg transition-all duration-200
          focus:ring-2 focus:ring-ocean-500 focus:border-transparent
          disabled:cursor-not-allowed
          ${hasError ? 'border-red-500 focus:ring-red-500' : ''}
        `}
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          color: 'var(--color-text-primary)',
          borderColor: hasError ? '#EF4444' : 'var(--color-border)'
        }}
        {...props}
      />
      {helperText && !error && (
        <p className="mt-1 text-sm" style={{color: 'var(--color-text-secondary)'}}>{helperText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
