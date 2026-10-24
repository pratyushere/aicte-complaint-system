import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading…', className }: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      <Loader2 className="w-8 h-8 text-navy-500 animate-spin mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
