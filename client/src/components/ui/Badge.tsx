import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
}

export function Badge({
  children,
  className,
  dot,
  pulse = false,
  size = 'sm',
}: BadgeProps) {
  const sizeClasses = {
    xs: 'px-1.5 py-0.2 text-[10px] gap-1',
    sm: 'px-2 py-0.5 text-xs gap-1.5',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md font-medium whitespace-nowrap tracking-wide transition-colors',
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}
