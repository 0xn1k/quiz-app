'use client';

import { useState, useEffect } from 'react';
import { questionAPI, analyticsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function QuizPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await questionAPI.getDaily({ limit: 10 });
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setAnswers({ ...answers, [currentIndex]: optionIndex });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answerIndex) {
        correct++;
      }
    });

    const percentage = (correct / questions.length) * 100;

    try {
      await analyticsAPI.submit({
        totalQuestions: questions.length,
        correctAnswers: correct,
        wrongAnswers: questions.length - correct,
        percentage,
        timeTaken: 0,
        category: 'Mixed'
      });
    } catch (error) {
      console.error('Failed to submit analytics:', error);
    }

    setShowResult(true);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="text-5xl mb-4">📚</div>
        <p className="text-slate-600 text-lg">Loading questions...</p>
      </div>
    </div>
  );

  if (showResult) {
    const correct = questions.filter((q, idx) => answers[idx] === q.answerIndex).length;
    const percentage = (correct / questions.length) * 100;

    return (
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-3xl mx-auto pt-8">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-semibold text-slate-900">Quiz Complete! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8">
                <div className="text-7xl font-semibold text-indigo-600 mb-3">
                  {percentage.toFixed(1)}%
                </div>
                <p className="text-xl text-slate-700 font-medium">
                  {correct} out of {questions.length} correct
                </p>
              </div>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={idx} className="p-5 border border-slate-200 rounded-xl bg-white">
                    <p className="font-medium text-slate-900 mb-3 leading-relaxed">Q{idx + 1}: {q.question || q.questionText}</p>
                    <div className={`p-3 rounded-lg ${answers[idx] === q.answerIndex ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`font-medium ${answers[idx] === q.answerIndex ? 'text-green-700' : 'text-red-700'}`}>
                        {answers[idx] === q.answerIndex ? '✓ Your answer: ' : '✗ Your answer: '}
                        {q.options[answers[idx]]?.text || 'Not answered'}
                      </p>
                    </div>
                    {answers[idx] !== q.answerIndex && (
                      <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-700 font-medium">
                          ✓ Correct answer: {q.options[q.answerIndex]?.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={() => router.push('/dashboard')} className="flex-1 rounded-xl h-12 bg-indigo-600 hover:bg-indigo-700">
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 rounded-xl h-12 border-slate-300">
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-semibold text-slate-900">
                Question {currentIndex + 1} of {questions.length}
              </CardTitle>
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {Object.keys(answers).length} answered
              </span>
            </div>
            <div className="mt-4 bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-8 py-8">
            <div>
              <p className="text-xl md:text-2xl text-slate-900 mb-6 leading-relaxed font-medium">
                {currentQuestion.question || currentQuestion.questionText}
              </p>
              <div className="space-y-3">
                {currentQuestion.options?.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-5 text-left text-lg border-2 rounded-xl transition-all min-h-[56px] ${
                      answers[currentIndex] === idx
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm ring-2 ring-indigo-100'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-medium text-slate-700">{opt.text || opt}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                variant="outline"
                className="rounded-xl h-12 px-6 border-slate-300"
              >
                ← Previous
              </Button>
              {currentIndex === questions.length - 1 ? (
                <Button onClick={handleSubmit} className="rounded-xl h-12 px-8 bg-green-600 hover:bg-green-700">
                  Submit Quiz ✓
                </Button>
              ) : (
                <Button onClick={handleNext} className="rounded-xl h-12 px-6 bg-indigo-600 hover:bg-indigo-700">
                  Next →
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
