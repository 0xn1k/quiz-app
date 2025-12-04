'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { analyticsAPI } from '@/lib/api';

export default function AnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [trends, setTrends] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user) {
      fetchAnalytics();
    }
  }, [user, loading]);

  const fetchAnalytics = async () => {
    try {
      const [analyticsRes, categoryRes, trendsRes] = await Promise.all([
        analyticsAPI.getAll(),
        analyticsAPI.getCategoryStats(),
        analyticsAPI.getTrends(30),
      ]);
      setAnalytics(analyticsRes.data.analytics);
      setCategoryStats(categoryRes.data.stats);
      setTrends(trendsRes.data.trends);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return null;

  const totalTests = analytics.length;
  const avgScore = totalTests > 0
    ? analytics.reduce((sum, a) => sum + a.percentage, 0) / totalTests
    : 0;
  const totalQuestions = analytics.reduce((sum, a) => sum + a.totalQuestions, 0);
  const correctAnswers = analytics.reduce((sum, a) => sum + a.correctAnswers, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Performance Analytics</h1>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-blue-600">{totalTests}</div>
            <div className="text-gray-600 mt-2">Total Tests</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-green-600">{avgScore.toFixed(1)}%</div>
            <div className="text-gray-600 mt-2">Average Score</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-purple-600">{totalQuestions}</div>
            <div className="text-gray-600 mt-2">Questions Attempted</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl font-bold text-orange-600">
              {totalQuestions > 0 ? ((correctAnswers / totalQuestions) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-gray-600 mt-2">Accuracy</div>
          </div>
        </div>

        {/* Category-wise Performance */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">Category-wise Performance</h2>
          {categoryStats.length > 0 ? (
            <div className="space-y-4">
              {categoryStats.map((stat) => (
                <div key={stat.category} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">{stat.category}</h3>
                    <span className="text-2xl font-bold text-blue-600">
                      {stat.averageScore.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{stat.totalTests} tests</span>
                    <span>
                      {stat.correctAnswers}/{stat.totalQuestions} correct
                    </span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${stat.averageScore}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">No category data available</p>
          )}
        </div>

        {/* Recent Test History */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Test History</h2>
          {analytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Score</th>
                    <th className="text-left py-3 px-4">Questions</th>
                    <th className="text-left py-3 px-4">Time Taken</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.map((test) => (
                    <tr key={test._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {new Date(test.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        {test.correctAnswers}/{test.totalQuestions}
                      </td>
                      <td className="py-3 px-4">{test.totalQuestions}</td>
                      <td className="py-3 px-4">
                        {Math.floor(test.timeTaken / 60)}m {test.timeTaken % 60}s
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            test.percentage >= 80
                              ? 'text-green-600'
                              : test.percentage >= 60
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {test.percentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              No test history available. Start taking tests!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
