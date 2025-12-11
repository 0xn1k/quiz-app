'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { analyticsAPI, testAPI } from '@/lib/api';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recentTests, setRecentTests] = useState<any[]>([]);
  const [myTests, setMyTests] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, loading]);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, testsRes] = await Promise.all([
        analyticsAPI.getAll({ limit: 5 }),
        testAPI.getMyTests(),
      ]);
      setRecentTests(analyticsRes.data.analytics);
      setMyTests(testsRes.data.tests);
      
      // Calculate stats
      const totalTests = analyticsRes.data.analytics.length;
      const avgScore = totalTests > 0
        ? analyticsRes.data.analytics.reduce((sum: number, a: any) => sum + a.percentage, 0) / totalTests
        : 0;
      setStats({ totalTests, avgScore: avgScore.toFixed(1) });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">Welcome back, {user.name}! 👋</h1>
          <p className="text-slate-500 text-lg">Track your progress and continue learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-4xl font-semibold text-indigo-600 mb-1">{stats?.totalTests || 0}</div>
              <div className="text-slate-500 text-sm font-medium">Tests Taken</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-4xl font-semibold text-green-600 mb-1">{stats?.avgScore || 0}%</div>
              <div className="text-slate-500 text-sm font-medium">Average Score</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="text-4xl font-semibold text-purple-600 mb-1">{myTests.length}</div>
              <div className="text-slate-500 text-sm font-medium">Created Tests</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-slate-900">
                    {user.isPremium ? '✨ Premium' : '🎓 Free'}
                  </div>
                  <div className="text-slate-500 text-sm mt-1">Account Status</div>
                </div>
                {!user.isPremium && (
                  <Button asChild size="sm" className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                    <Link href="/pricing">Upgrade</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Link
            href="/questions"
            className="group bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2">Question Bank</h3>
            <p className="text-indigo-100 leading-relaxed">Browse and practice questions</p>
          </Link>
          <Link
            href="/quiz"
            className="group bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Take Quiz</h3>
            <p className="text-green-100 leading-relaxed">Start a practice session</p>
          </Link>
          <Link
            href="/analytics"
            className="group bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all"
          >
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-purple-100 leading-relaxed">Track your progress</p>
          </Link>
        </div>

        <Card className="mb-10 rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold text-slate-900">Recent Test Results</CardTitle>
              <Link href="/analytics" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View All →
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div
                  key={test._id}
                  className="flex justify-between items-center p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Test #{test._id.slice(-6)}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-semibold text-indigo-600">
                      {test.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-500 mt-1">
                      {test.correctAnswers}/{test.totalQuestions} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📝</div>
              <p className="text-slate-500 text-lg">No tests taken yet. Start practicing now!</p>
            </div>
          )}
          </CardContent>
        </Card>

        {myTests.length > 0 && (
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-slate-900">My Created Tests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTests.map((test) => (
                <Link
                  key={test._id}
                  href={`/tests/${test._id}`}
                  className="p-5 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-slate-900 mb-2">{test.title}</h3>
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>📝 {test.questions.length} questions</span>
                    <span>🏷️ {test.category}</span>
                  </div>
                </Link>
              ))}
            </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
