import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2 text-sm font-medium gap-2',
    lg: 'px-5 py-2.5 text-base font-medium gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 dark:shadow-none border border-transparent focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    secondary:
      'bg-slate-800 hover:bg-slate-900 text-white shadow-sm border border-transparent dark:bg-slate-700 dark:hover:bg-slate-600 focus:ring-2 focus:ring-slate-700 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 dark:shadow-none border border-transparent focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 border border-transparent',
    success:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200 dark:shadow-none border border-transparent focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900',
  }[variant];

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <span className="inline-flex shrink-0">{icon}</span>
      )}
    </button>
  );
};

