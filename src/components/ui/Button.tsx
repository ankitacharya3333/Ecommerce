import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none';

    const variants = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 active:bg-zinc-950 border border-transparent shadow-xs',
      secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 active:bg-zinc-300 border border-zinc-200',
      outline: 'bg-transparent text-zinc-900 border border-zinc-300 hover:bg-zinc-50 active:bg-zinc-100',
      ghost: 'bg-transparent text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 active:bg-zinc-200',
    };

    const sizes = {
      sm: 'text-xs h-8 px-3 rounded-md gap-1.5',
      md: 'text-sm h-10 px-4 rounded-md gap-2',
      lg: 'text-base h-12 px-6 rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
