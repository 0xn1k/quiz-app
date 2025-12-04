'use client';

import { useEffect, useState } from 'react';
import { questionAPI, filterAPI } from '@/lib/api';
import { Question } from '@/types';

export default function PYQsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchPYQs();
  }, [selectedYear, selectedCategory]);

  const fetchFilters = async () => {
    try {
      const [yearsRes, categoriesRes] = await Promise.all([
        filterAPI.getYears(),
        filterAPI.getCategories(),
      ]);
      setYears(yearsRes.data.years);
      setCategories(categoriesRes.data.categories);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const fetchPYQs = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedYear) params.year = selectedYear;
      if (selectedCategory) params.category = selectedCategory;
      const { data } = await questionAPI.getPYQs(params);
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching PYQs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">Past Year Questions (PYQs)</h1>
        <p className="text-gray-600 mb-8">
          Practice with real exam questions from previous years
        </p>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="mb-4">
            <h3 className="font-semibold mb-3">Filter by Year</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-4 py-2 rounded-lg ${
                  !selectedYear
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                All Years
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedYear === year
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-4 py-2 rounded-lg ${
                  !selectedCategory
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Questions */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question._id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                      {question.category}
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
                      {question.year}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        question.difficulty === 'easy'
                          ? 'bg-green-100 text-green-600'
                          : question.difficulty === 'medium'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                  <span className="text-gray-500">Q{index + 1}</span>
                </div>

                <h3 className="text-xl font-semibold mb-4">{question.question}</h3>

                <div className="space-y-2 mb-4">
                  {question.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-lg ${
                        option === question.answer
                          ? 'bg-green-50 border-2 border-green-600'
                          : 'bg-gray-50'
                      }`}
                    >
                      <span className="font-semibold mr-2">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {option}
                      {option === question.answer && (
                        <span className="float-right text-green-600 font-semibold">
                          ✓ Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Explanation:</h4>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}

                {question.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {question.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold mb-2">No PYQs Found</h2>
            <p className="text-gray-600">
              Try adjusting your filters to see more questions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
