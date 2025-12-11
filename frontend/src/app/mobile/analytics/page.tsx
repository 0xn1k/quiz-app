'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { analyticsAPI } from '@/lib/api';
import { ArrowLeft, TrendingUp, Award, Target, Calendar, Flame } from 'lucide-react';

export default function MobileAnalyticsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await analyticsAPI.getAll({ limit: 20 });
      const data = response.data.analytics || [];
      setAnalytics(data);

      // Calculate stats
      const totalTests = data.length;
      const avgScore = totalTests > 0
        ? data.reduce((sum: number, a: any) => sum + a.percentage, 0) / totalTests
        : 0;
      const totalQuestions = data.reduce((sum: number, a: any) => sum + a.totalQuestions, 0);
      const correctAnswers = data.reduce((sum: number, a: any) => sum + a.correctAnswers, 0);
      const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      setStats({ totalTests, avgScore, totalQuestions, correctAnswers, accuracy });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading analytics...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-8 pb-6">
          <button onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold mb-1">Analytics</h1>
          <p className="text-indigo-100 text-sm">Track your progress</p>
        </div>

        <MobileContainer>
          {/* Streak Card */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 -mt-4 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-700">7</p>
                    <p className="text-sm text-orange-600">Day Streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600">Best: 15 days</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <TrendingUp className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats?.totalTests || 0}</p>
                <p className="text-sm text-slate-500">Total Tests</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <Award className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats?.avgScore?.toFixed(1) || 0}%</p>
                <p className="text-sm text-slate-500">Avg Score</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <Target className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats?.accuracy?.toFixed(1) || 0}%</p>
                <p className="text-sm text-slate-500">Accuracy</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <Calendar className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-slate-900">{stats?.totalQuestions || 0}</p>
                <p className="text-sm text-slate-500">Questions</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Trend</h3>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const value = Math.random() * 100;
                  return (
                    <div key={day}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">{day}</span>
                        <span className="font-semibold text-slate-900">{value.toFixed(0)}%</span>
                      </div>
                      <Progress value={value} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tests */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Recent Tests</h3>
              {analytics.length > 0 ? (
                <div className="space-y-3">
                  {analytics.slice(0, 5).map((test, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">Test #{test._id?.slice(-6)}</p>
                        <p className="text-sm text-slate-500">
                          {test.correctAnswers}/{test.totalQuestions} correct
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={
                            test.percentage >= 75
                              ? 'bg-green-100 text-green-700 border-green-300'
                              : test.percentage >= 50
                              ? 'bg-blue-100 text-blue-700 border-blue-300'
                              : 'bg-orange-100 text-orange-700 border-orange-300'
                          }
                        >
                          {test.percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">📊</div>
                  <p className="text-slate-500">No tests taken yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}