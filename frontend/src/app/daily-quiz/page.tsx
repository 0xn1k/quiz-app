'use client';

import { useEffect, useState } from 'react';
import { questionAPI } from '@/lib/api';
import { Question } from '@/types';

export default function DailyQuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyQuestions();
  }, []);

  const fetchDailyQuestions = async () => {
    try {
      const { data } = await questionAPI.getDaily({ count: 10 });
      setQuestions(data.questions);
    } catch (error) {
      console.error('Error fetching daily questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = () => {
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowResult(false);
    setScore(0);
    fetchDailyQuestions();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No questions available</h2>
          <button
            onClick={fetchDailyQuestions}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (currentQuestion >= questions.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-blue-600 mb-2">
            {score}/{questions.length}
          </div>
          <p className="text-gray-600 mb-6">
            You scored {((score / questions.length) * 100).toFixed(1)}%
          </p>
          <button
            onClick={handleRestart}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Try Another Quiz
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Progress */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-blue-600 font-semibold">Score: {score}</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              {question.category}
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

          <h2 className="text-2xl font-semibold mb-6">{question.question}</h2>

          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && setSelectedAnswer(option)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  showResult
                    ? option === question.answer
                      ? 'border-green-600 bg-green-50'
                      : option === selectedAnswer
                      ? 'border-red-600 bg-red-50'
                      : 'border-gray-200'
                    : selectedAnswer === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-semibold mr-3">
                  {String.fromCharCode(65 + index)}.
                </span>
                {option}
                {showResult && option === question.answer && (
                  <span className="float-right text-green-600">✓</span>
                )}
                {showResult && option === selectedAnswer && option !== question.answer && (
                  <span className="float-right text-red-600">✗</span>
                )}
              </button>
            ))}
          </div>

          {showResult && question.explanation && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-2">Explanation:</h3>
              <p className="text-gray-700">{question.explanation}</p>
            </div>
          )}

          {!showResult ? (
            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'View Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
