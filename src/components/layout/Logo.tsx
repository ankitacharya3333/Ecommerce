import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function Logo({ className, variant = 'dark' }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="NOVA MARKET Home"
      className={cn(
        'group inline-flex items-center gap-2 font-semibold tracking-wider transition-opacity hover:opacity-90',
        className
      )}
    >
      <div
        className={cn(
          'w-7 h-7 rounded flex items-center justify-center font-bold text-sm tracking-tighter transition-transform group-hover:scale-105',
          variant === 'dark'
            ? 'bg-zinc-950 text-white'
            : 'bg-white text-zinc-950'
        )}
      >
        N
      </div>
      <span
        className={cn(
          'text-lg font-bold tracking-widest uppercase',
          variant === 'dark' ? 'text-zinc-900' : 'text-white'
        )}
      >
        Nova<span className="font-light text-zinc-400">Market</span>
      </span>
    </Link>
  );
}
