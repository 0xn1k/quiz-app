'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { analyticsAPI, testAPI } from '@/lib/api';
import Link from 'next/link';

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-gray-600">Track your progress and continue learning</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600">{stats?.totalTests || 0}</div>
            <div className="text-gray-600 mt-2">Tests Taken</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600">{stats?.avgScore || 0}%</div>
            <div className="text-gray-600 mt-2">Average Score</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600">{myTests.length}</div>
            <div className="text-gray-600 mt-2">Created Tests</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">
                  {user.isPremium ? '✨ Premium' : 'Free'}
                </div>
                <div className="text-gray-600 text-sm mt-1">Account Status</div>
              </div>
              {!user.isPremium && (
                <Link
                  href="/pricing"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/tests"
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="text-xl font-semibold mb-1">Browse Tests</h3>
            <p className="text-blue-100">Explore available tests</p>
          </Link>
          <Link
            href="/daily-quiz"
            className="bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition"
          >
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="text-xl font-semibold mb-1">Daily Quiz</h3>
            <p className="text-green-100">Practice daily questions</p>
          </Link>
          <Link
            href="/analytics"
            className="bg-purple-600 text-white p-6 rounded-lg shadow-md hover:bg-purple-700 transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-xl font-semibold mb-1">Analytics</h3>
            <p className="text-purple-100">View detailed insights</p>
          </Link>
        </div>

        {/* Recent Tests */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recent Test Results</h2>
            <Link href="/analytics" className="text-blue-600 hover:underline">
              View All →
            </Link>
          </div>
          {recentTests.length > 0 ? (
            <div className="space-y-3">
              {recentTests.map((test) => (
                <div
                  key={test._id}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold">Test #{test._id.slice(-6)}</div>
                    <div className="text-sm text-gray-600">
                      {new Date(test.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {test.percentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-gray-600">
                      {test.correctAnswers}/{test.totalQuestions}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No tests taken yet. Start practicing now!
            </p>
          )}
        </div>

        {/* My Created Tests */}
        {myTests.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">My Created Tests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myTests.map((test) => (
                <Link
                  key={test._id}
                  href={`/tests/${test._id}`}
                  className="p-4 border rounded-lg hover:border-blue-600 transition"
                >
                  <h3 className="font-semibold mb-2">{test.title}</h3>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{test.questions.length} questions</span>
                    <span>{test.category}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
