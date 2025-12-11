'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MobileLayout } from '@/components/MobileLayout';

export default function SplashScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        if (user) {
          router.push('/mobile/home');
        } else {
          router.push('/mobile/login');
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

  return (
    <MobileLayout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="text-8xl mb-4 animate-bounce">🎯</div>
          <h1 className="text-4xl font-bold text-white mb-2">QuizApp</h1>
          <p className="text-white/90 text-lg">Master Your Knowledge</p>
          <div className="mt-8">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}