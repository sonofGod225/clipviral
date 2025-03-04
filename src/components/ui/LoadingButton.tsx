import { ButtonHTMLAttributes } from 'react';
import { LuLoader2 } from 'react-icons/lu';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  className,
  ...props
}: LoadingButtonProps) => {
  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        'bg-purple-600 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <LuLoader2 className="h-4 w-4 animate-spin" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}; 