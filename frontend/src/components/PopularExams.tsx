'use client';

import Link from 'next/link';

const popularExams = [
  { name: 'Banking & Insurance', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🏦' },
  { name: 'SSC Exams', color: 'bg-green-50 text-green-700 border-green-200', icon: '📝' },
  { name: 'UPSC', color: 'bg-red-50 text-red-700 border-red-200', icon: '🎯' },
  { name: 'Railway Exams', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🚂' },
  { name: 'Defence Exams', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: '🎖️' },
  { name: 'Teaching Exams', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '👨🏫' },
  { name: 'Engineering Exams', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: '⚙️' },
  { name: 'MBA Exams', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '💼' },
];

export default function PopularExams() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Exams</h2>
          <p className="text-slate-600">Most searched exam categories</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {popularExams.map((exam, index) => (
            <Link
              key={index}
              href={`/exams/${exam.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              className={`${exam.color} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <div className="flex flex-col items-center text-center gap-2">
                <span className="text-4xl group-hover:scale-110 transition-transform">{exam.icon}</span>
                <span className="font-semibold text-sm">{exam.name}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/exams" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            View All Exams
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
