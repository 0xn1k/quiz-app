'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { filterAPI, testAPI } from '@/lib/api';
import { Test } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  const [stats, setStats] = useState<any>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, testsRes] = await Promise.all([
        filterAPI.getStats(),
        testAPI.getAll({ limit: 6 }),
      ]);
      // Extract only the numeric values we need from the stats response
      const statsData = statsRes.data;
      setStats({
        totalQuestions: statsData.totalQuestions || 0,
        totalTests: statsData.totalTests || 0,
        totalCategories: statsData.totalCategories || 0,
        totalPYQs: statsData.pyqCount || statsData.totalPYQs || 0,
      });
      setTests(testsRes.data.tests || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Set default stats on error
      setStats({
        totalQuestions: 0,
        totalTests: 0,
        totalCategories: 0,
        totalPYQs: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-semibold text-slate-900 mb-6 leading-tight">
            Master Your Knowledge<br/>with Quiz App 🎯
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Practice with thousands of questions, track your progress, and ace your exams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-xl h-12 px-8">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-xl h-12 px-8">
              <Link href="/questions">Browse Questions</Link>
            </Button>
          </div>
        </div>
      </section>

      {stats && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl font-semibold text-indigo-600 mb-2">{stats.totalQuestions}</div>
              <div className="text-slate-500 font-medium">Total Questions</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl font-semibold text-green-600 mb-2">{stats.totalTests}</div>
              <div className="text-slate-500 font-medium">Available Tests</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl font-semibold text-purple-600 mb-2">{stats.totalCategories}</div>
              <div className="text-slate-500 font-medium">Categories</div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center hover:shadow-md transition-shadow">
              <div className="text-4xl font-semibold text-orange-600 mb-2">{stats.totalPYQs}</div>
              <div className="text-slate-500 font-medium">Past Year Questions</div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-slate-900 mb-12">Why Choose Quiz App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Vast Question Bank</h3>
            <p className="text-slate-600 leading-relaxed">
              Access thousands of questions across multiple categories and difficulty levels
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Performance Analytics</h3>
            <p className="text-slate-600 leading-relaxed">
              Track your progress with detailed analytics and performance insights
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Past Year Questions</h3>
            <p className="text-slate-600 leading-relaxed">
              Practice with real exam questions from previous years
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">Popular Tests</h2>
          <Link href="/tests" className="text-indigo-600 hover:text-indigo-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link
              key={test._id}
              href={`/tests/${test._id}`}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-slate-900">{test.title}</h3>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {test.category}
                </span>
              </div>
              <p className="text-slate-600 mb-4 leading-relaxed">{test.description}</p>
              <div className="flex justify-between text-sm text-slate-500">
                <span>⏱️ {test.duration} mins</span>
                <span>📝 {test.questions.length} questions</span>
                <span>🎯 {test.totalMarks} marks</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
