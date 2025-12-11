'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WifiOff, ServerCrash, AlertCircle, FileQuestion } from 'lucide-react';

interface ErrorStateProps {
  type: 'no-internet' | 'server-error' | 'not-found' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
}

export function ErrorState({ type, title, message, onRetry, onGoBack }: ErrorStateProps) {
  const getErrorContent = () => {
    switch (type) {
      case 'no-internet':
        return {
          icon: <WifiOff className="w-16 h-16 text-slate-400" />,
          emoji: '📡',
          title: title || 'No Internet Connection',
          message: message || 'Please check your internet connection and try again.',
          showRetry: true,
        };
      case 'server-error':
        return {
          icon: <ServerCrash className="w-16 h-16 text-slate-400" />,
          emoji: '⚠️',
          title: title || 'Server Error',
          message: message || 'Something went wrong on our end. Please try again later.',
          showRetry: true,
        };
      case 'not-found':
        return {
          icon: <FileQuestion className="w-16 h-16 text-slate-400" />,
          emoji: '🔍',
          title: title || 'Not Found',
          message: message || 'The page you are looking for does not exist.',
          showRetry: false,
        };
      case 'empty':
        return {
          icon: <AlertCircle className="w-16 h-16 text-slate-400" />,
          emoji: '📭',
          title: title || 'No Data Available',
          message: message || 'There is no data to display at the moment.',
          showRetry: false,
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-slate-400" />,
          emoji: '❓',
          title: title || 'Something Went Wrong',
          message: message || 'An unexpected error occurred.',
          showRetry: true,
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-slate-200">
        <CardContent className="p-8 text-center">
          <div className="text-7xl mb-4">{content.emoji}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{content.title}</h2>
          <p className="text-slate-600 mb-6 leading-relaxed">{content.message}</p>
          
          <div className="flex flex-col gap-3">
            {content.showRetry && onRetry && (
              <Button
                onClick={onRetry}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                Try Again
              </Button>
            )}
            {onGoBack && (
              <Button
                onClick={onGoBack}
                variant="outline"
                className="w-full h-12 rounded-xl border-slate-300"
              >
                Go Back
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Empty state for lists
export function EmptyList({ 
  icon = '📝', 
  title = 'No Items', 
  message = 'There are no items to display.',
  actionLabel,
  onAction
}: {
  icon?: string;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6">{message}</p>
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

// Loading skeleton
export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="border-slate-200">
          <CardContent className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}