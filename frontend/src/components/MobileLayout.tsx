'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  showHeader?: boolean;
  headerTitle?: string;
  headerAction?: ReactNode;
}

export function MobileLayout({ 
  children, 
  className,
  showHeader = false,
  headerTitle,
  headerAction
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-900">{headerTitle}</h1>
            {headerAction}
          </div>
        </header>
      )}
      <main className={cn("pb-safe", className)}>
        {children}
      </main>
    </div>
  );
}

export function MobileContainer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-md mx-auto px-4 py-6", className)}>
      {children}
    </div>
  );
}