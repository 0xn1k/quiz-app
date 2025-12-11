'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { questionAPI, analyticsAPI } from '@/lib/api';
import { ArrowLeft, Clock, Flag, X } from 'lucide-react';

export default function MobileQuizPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [markedForReview, setMarkedForReview] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !loading) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, loading]);

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

  const toggleMarkForReview = () => {
    setMarkedForReview(prev =>
      prev.includes(currentIndex)
        ? prev.filter(i => i !== currentIndex)
        : [...prev, currentIndex]
    );
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
        timeTaken: 600 - timeLeft,
        category: 'Mixed'
      });
    } catch (error) {
      console.error('Failed to submit analytics:', error);
    }

    router.push(`/mobile/result?correct=${correct}&total=${questions.length}&time=${600 - timeLeft}`);
  };

  if (loading) {
    return (
      <MobileLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Loading questions...</p>
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
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Questions Available</h2>
            <p className="text-slate-600 mb-6">Please try again later</p>
            <Button onClick={() => router.back()} className="rounded-xl">
              Go Back
            </Button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => router.back()}>
              <X className="w-6 h-6 text-slate-700" />
            </button>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-slate-900'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
            <Badge variant="outline" className="font-semibold">
              {currentIndex + 1}/{questions.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="p-4 space-y-4">
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-500">Question {currentIndex + 1}</h3>
                <button
                  onClick={toggleMarkForReview}
                  className={`flex items-center gap-1 text-sm ${
                    markedForReview.includes(currentIndex)
                      ? 'text-orange-600 font-semibold'
                      : 'text-slate-500'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                  {markedForReview.includes(currentIndex) ? 'Marked' : 'Mark'}
                </button>
              </div>

              <p className="text-lg text-slate-900 mb-6 leading-relaxed font-medium">
                {currentQuestion.question || currentQuestion.questionText}
              </p>

              <div className="space-y-3">
                {currentQuestion.options?.map((opt: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-4 text-left border-2 rounded-xl transition-all ${
                      answers[currentIndex] === idx
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        answers[currentIndex] === idx
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-slate-300'
                      }`}>
                        {answers[currentIndex] === idx && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-slate-700">{opt.text || opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigator */}
          <Card className="border-slate-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-600">Quick Navigation</span>
                <span className="text-slate-900 font-semibold">{answeredCount} answered</span>
              </div>
              <div className="grid grid-cols-10 gap-2">
                {questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`aspect-square rounded-lg text-xs font-semibold transition-all ${
                      idx === currentIndex
                        ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                        : answers[idx] !== undefined
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : markedForReview.includes(idx)
                        ? 'bg-orange-100 text-orange-700 border border-orange-300'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-inset-bottom">
          <div className="max-w-md mx-auto flex gap-3">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-slate-300"
            >
              Previous
            </Button>
            {currentIndex === questions.length - 1 ? (
              <Button
                onClick={() => setShowSubmitDialog(true)}
                className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700"
              >
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700"
              >
                Next
              </Button>
            )}
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Submit Quiz?</DialogTitle>
              <DialogDescription className="text-base">
                Are you sure you want to submit your quiz?
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Questions:</span>
                <span className="font-semibold text-slate-900">{questions.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Answered:</span>
                <span className="font-semibold text-green-600">{answeredCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Unanswered:</span>
                <span className="font-semibold text-orange-600">{questions.length - answeredCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Marked for Review:</span>
                <span className="font-semibold text-blue-600">{markedForReview.length}</span>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 rounded-xl bg-green-600 hover:bg-green-700"
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MobileLayout>
  );
}