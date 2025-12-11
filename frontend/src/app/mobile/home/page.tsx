'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI } from '@/lib/api';
import { 
  BookOpen, 
  TrendingUp, 
  Award, 
  Clock,
  ChevronRight,
  Flame
} from 'lucide-react';

const EXAM_CATEGORIES = [
  { id: 'upsc', name: 'UPSC (PRE)', icon: '🏛️', color: 'bg-blue-500' },
  { id: 'bank', name: 'BANK', icon: '🏦', color: 'bg-green-500' },
  { id: 'railway', name: 'RAILWAY', icon: '🚂', color: 'bg-orange-500' },
  { id: 'ssc', name: 'SSC', icon: '📋', color: 'bg-purple-500' },
  { id: 'gate', name: 'GATE', icon: '🎓', color: 'bg-indigo-500' },
  { id: 'state-pcs', name: 'STATE PCS', icon: '🏢', color: 'bg-pink-500' },
];

export default function MobileHomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/mobile/login');
    } else if (user) {
      fetchStats();
    }
  }, [user, loading]);

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getAll({ limit: 10 });
      const analytics = response.data.analytics || [];
      
      // Calculate streak (simplified)
      setStreak(analytics.length > 0 ? Math.min(analytics.length, 7) : 0);
      
      // Calculate stats
      const totalTests = analytics.length;
      const avgScore = totalTests > 0
        ? analytics.reduce((sum: number, a: any) => sum + a.percentage, 0) / totalTests
        : 0;
      
      setStats({ totalTests, avgScore: avgScore.toFixed(1) });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (!user) return null;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-8 pb-6 rounded-b-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">Hello, {user.name}! 👋</h1>
              <p className="text-indigo-100 text-sm">Ready to learn today?</p>
            </div>
            <Link href="/mobile/profile">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                👤
              </div>
            </Link>
          </div>

          {/* Streak Widget */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">{streak} Day Streak</p>
                    <p className="text-indigo-100 text-xs">Keep it going!</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        <MobileContainer>
          {/* Daily Quiz Banner */}
          <Link href="/mobile/daily-quiz">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg mb-6 -mt-4">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5" />
                      <Badge className="bg-white/20 text-white border-0">Today</Badge>
                    </div>
                    <h3 className="text-xl font-bold mb-1">Daily Quiz</h3>
                    <p className="text-green-100 text-sm">Complete today's challenge</p>
                  </div>
                  <div className="text-5xl">🎯</div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats?.totalTests || 0}</p>
                <p className="text-xs text-slate-500">Tests Taken</p>
              </CardContent>
            </Card>
            <Card className="border-slate-200">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-slate-900">{stats?.avgScore || 0}%</p>
                <p className="text-xs text-slate-500">Avg Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Exam Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Exam Categories</h2>
            <div className="grid grid-cols-2 gap-3">
              {EXAM_CATEGORIES.map((category) => (
                <Link key={category.id} href={`/mobile/category/${category.id}`}>
                  <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className={`w-12 h-12 ${category.color} rounded-xl flex items-center justify-center text-2xl mb-3`}>
                        {category.icon}
                      </div>
                      <h3 className="font-semibold text-slate-900 text-sm mb-1">{category.name}</h3>
                      <div className="flex items-center text-xs text-slate-500">
                        <BookOpen className="w-3 h-3 mr-1" />
                        <span>Practice</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 mb-6">
            <Link href="/mobile/quiz-config">
              <Card className="border-slate-200 hover:border-indigo-300 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Quick Test</p>
                      <p className="text-xs text-slate-500">Start a practice session</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/mobile/analytics">
              <Card className="border-slate-200 hover:border-indigo-300 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Analytics</p>
                      <p className="text-xs text-slate-500">Track your progress</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Premium Banner */}
          {!user.isPremium && (
            <Link href="/mobile/subscription">
              <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold mb-1">Upgrade to Premium</h3>
                      <p className="text-amber-100 text-sm mb-3">Unlock all features</p>
                      <Button size="sm" className="bg-white text-orange-600 hover:bg-white/90">
                        Learn More
                      </Button>
                    </div>
                    <div className="text-5xl">✨</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}
        </MobileContainer>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 safe-area-inset-bottom">
          <div className="max-w-md mx-auto flex items-center justify-around">
            <Link href="/mobile/home" className="flex flex-col items-center gap-1 text-indigo-600">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            <Link href="/mobile/quiz-config" className="flex flex-col items-center gap-1 text-slate-400">
              <Clock className="w-6 h-6" />
              <span className="text-xs">Quiz</span>
            </Link>
            <Link href="/mobile/analytics" className="flex flex-col items-center gap-1 text-slate-400">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs">Stats</span>
            </Link>
            <Link href="/mobile/profile" className="flex flex-col items-center gap-1 text-slate-400">
              <Award className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}