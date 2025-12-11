'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { questionAPI } from '@/lib/api';

export default function MobileSolutionsPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading solutions...</p>
          </div>
        </div>
      </MobileLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Solutions Available</h2>
            <Button onClick={() => router.back()} className="mt-4 rounded-xl">
              Go Back
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const currentQuestion = questions[currentIndex];
  const userAnswer = 1; // Mock user answer
  const isCorrect = userAnswer === currentQuestion.answerIndex;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Detailed Solutions</h1>
            <Badge variant="outline" className="font-semibold">
              {currentIndex + 1}/{questions.length}
            </Badge>
          </div>
        </div>

        <MobileContainer>
          <Card className="border-slate-200 mb-4">
            <CardContent className="p-5">
              {/* Question */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-slate-500">Question {currentIndex + 1}</h3>
                  {isCorrect ? (
                    <Badge className="bg-green-100 text-green-700 border-green-300">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 border-red-300">
                      <XCircle className="w-3 h-3 mr-1" />
                      Incorrect
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-slate-900 leading-relaxed font-medium">
                  {currentQuestion.question || currentQuestion.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {currentQuestion.options?.map((opt: any, idx: number) => {
                  const isUserAnswer = idx === userAnswer;
                  const isCorrectAnswer = idx === currentQuestion.answerIndex;
                  
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 ${
                        isCorrectAnswer
                          ? 'border-green-500 bg-green-50'
                          : isUserAnswer && !isCorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          isCorrectAnswer
                            ? 'border-green-600 bg-green-600'
                            : isUserAnswer && !isCorrect
                            ? 'border-red-600 bg-red-600'
                            : 'border-slate-300'
                        }`}>
                          {(isCorrectAnswer || (isUserAnswer && !isCorrect)) && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-700">{opt.text || opt}</p>
                          {isCorrectAnswer && (
                            <p className="text-sm text-green-700 font-medium mt-1">✓ Correct Answer</p>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <p className="text-sm text-red-700 font-medium mt-1">✗ Your Answer</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {currentQuestion.explanation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    Explanation
                  </h4>
                  <p className="text-blue-800 leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                  idx === currentIndex
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </MobileContainer>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-inset-bottom">
          <div className="max-w-md mx-auto flex gap-3">
            <Button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-300"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Button>
            <Button
              onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === questions.length - 1}
              className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}