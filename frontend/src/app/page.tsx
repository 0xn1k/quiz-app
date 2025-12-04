'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { filterAPI, testAPI } from '@/lib/api';
import { Test } from '@/types';

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
      setStats(statsRes.data);
      setTests(testsRes.data.tests);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Knowledge with Quiz App
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Practice with thousands of questions, track your progress, and ace your exams
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/tests"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Browse Tests
            </Link>
            <Link
              href="/daily-quiz"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition"
            >
              Daily Quiz
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalQuestions}</div>
              <div className="text-gray-600 mt-2">Total Questions</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalTests}</div>
              <div className="text-gray-600 mt-2">Available Tests</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.totalCategories}</div>
              <div className="text-gray-600 mt-2">Categories</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalPYQs}</div>
              <div className="text-gray-600 mt-2">Past Year Questions</div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Quiz App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">Vast Question Bank</h3>
            <p className="text-gray-600">
              Access thousands of questions across multiple categories and difficulty levels
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Performance Analytics</h3>
            <p className="text-gray-600">
              Track your progress with detailed analytics and performance insights
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Past Year Questions</h3>
            <p className="text-gray-600">
              Practice with real exam questions from previous years
            </p>
          </div>
        </div>
      </section>

      {/* Popular Tests */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Popular Tests</h2>
          <Link href="/tests" className="text-blue-600 hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tests.map((test) => (
            <Link
              key={test._id}
              href={`/tests/${test._id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold">{test.title}</h3>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                  {test.category}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{test.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
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
