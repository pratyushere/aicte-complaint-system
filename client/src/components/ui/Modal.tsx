import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const maxWidthMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog (Bottom Sheet on mobile, centered modal on tablet/desktop) */}
      <div
        className={cn(
          'relative w-full rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden z-10',
          'animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200 max-h-[92vh] sm:max-h-[85vh] flex flex-col',
          maxWidthMap[maxWidth],
        )}
      >
        {/* Mobile Drag Pill */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center bg-slate-50/60">
          <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 bg-slate-50/60 shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate leading-snug">{title}</h3>
            {subtitle && <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer touch-manipulation"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
