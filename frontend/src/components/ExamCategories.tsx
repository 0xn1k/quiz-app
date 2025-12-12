'use client';

import Link from 'next/link';

const examCategories = [
  { name: 'Banking & Insurance', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '🏦' },
  { name: 'SSC Exams', color: 'bg-green-50 text-green-700 border-green-200', icon: '📝' },
  { name: 'Regulatory', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '⚖️' },
  { name: 'UPSC', color: 'bg-red-50 text-red-700 border-red-200', icon: '🎯' },
  { name: 'MBA Exams', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '💼' },
  { name: 'Railway Exams', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '🚂' },
  { name: 'JAIIB-CAIIB Exams', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: '🏛️' },
  { name: 'Karnataka Exams', color: 'bg-pink-50 text-pink-700 border-pink-200', icon: '📍' },
  { name: 'Tamil Nadu Exams', color: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: '📍' },
  { name: 'Judiciary Exams', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⚖️' },
  { name: 'Law Entrance Exams', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: '📚' },
  { name: 'Agriculture Exams', color: 'bg-lime-50 text-lime-700 border-lime-200', icon: '🌾' },
  { name: 'Engineering Exams', color: 'bg-sky-50 text-sky-700 border-sky-200', icon: '⚙️' },
  { name: 'J&K Exams', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: '📍' },
  { name: 'UP Exams', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '📍' },
  { name: 'Rajasthan Exams', color: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200', icon: '📍' },
  { name: 'Uttarakhand Exams', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📍' },
  { name: 'Punjab Exams', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: '📍' },
  { name: 'Haryana Exams', color: 'bg-green-50 text-green-700 border-green-200', icon: '📍' },
  { name: 'Bihar Exams', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: '📍' },
  { name: 'MP Exams', color: 'bg-red-50 text-red-700 border-red-200', icon: '📍' },
  { name: 'Defence Exams', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: '🎖️' },
  { name: 'Teaching Exams', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '👨‍🏫' },
  { name: 'Himachal Pradesh Exams', color: 'bg-teal-50 text-teal-700 border-teal-200', icon: '📍' },
  { name: 'Chhattisgarh Exams', color: 'bg-pink-50 text-pink-700 border-pink-200', icon: '📍' },
  { name: 'SkillVertex Courses', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: '🎓' },
];

export default function ExamCategories() {
  return (
    <section className="py-12 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Exam Categories</h2>
          <p className="text-slate-600 text-lg">Choose your exam category and start preparing today</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {examCategories.map((category, index) => (
            <Link
              key={index}
              href={`/exams/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              className={`${category.color} border-2 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</span>
                <span className="font-semibold text-sm leading-tight">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
