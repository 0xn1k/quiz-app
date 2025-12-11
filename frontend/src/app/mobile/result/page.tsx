'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Clock, Award, Share2, RotateCcw } from 'lucide-react';

export default function MobileResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const correct = parseInt(searchParams.get('correct') || '0');
  const total = parseInt(searchParams.get('total') || '10');
  const timeTaken = parseInt(searchParams.get('time') || '0');
  
  const percentage = (correct / total) * 100;
  const wrong = total - correct;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { emoji: '🏆', message: 'Outstanding!', color: 'text-yellow-600' };
    if (percentage >= 75) return { emoji: '🎉', message: 'Excellent!', color: 'text-green-600' };
    if (percentage >= 60) return { emoji: '👍', message: 'Good Job!', color: 'text-blue-600' };
    if (percentage >= 40) return { emoji: '💪', message: 'Keep Practicing!', color: 'text-orange-600' };
    return { emoji: '📚', message: 'Need More Practice', color: 'text-red-600' };
  };

  const performance = getPerformanceMessage();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Quiz Result',
          text: `I scored ${percentage.toFixed(1)}% in the quiz! 🎯`,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <MobileContainer className="py-8">
          {/* Result Header */}
          <div className="text-center mb-8">
            <div className="text-8xl mb-4 animate-bounce">{performance.emoji}</div>
            <h1 className={`text-3xl font-bold mb-2 ${performance.color}`}>
              {performance.message}
            </h1>
            <p className="text-slate-600">Quiz Complete</p>
          </div>

          {/* Score Card */}
          <Card className="border-2 border-indigo-200 mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
              <p className="text-sm mb-2 opacity-90">Your Score</p>
              <p className="text-6xl font-bold mb-2">{percentage.toFixed(1)}%</p>
              <p className="text-indigo-100">{correct} out of {total} correct</p>
            </div>
            <CardContent className="p-0">
              <Progress value={percentage} className="h-2 rounded-none" />
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-5 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-green-700 mb-1">{correct}</p>
                <p className="text-sm text-green-600">Correct</p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-5 text-center">
                <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-red-700 mb-1">{wrong}</p>
                <p className="text-sm text-red-600">Incorrect</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-5 text-center">
                <Clock className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700 mb-1">
                  {minutes}:{String(seconds).padStart(2, '0')}
                </p>
                <p className="text-sm text-blue-600">Time Taken</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-5 text-center">
                <Award className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700 mb-1">
                  {percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'}
                </p>
                <p className="text-sm text-purple-600">Grade</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Breakdown */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Performance Breakdown</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Accuracy</span>
                    <span className="font-semibold text-slate-900">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Speed</span>
                    <span className="font-semibold text-slate-900">
                      {(timeTaken / total).toFixed(0)}s per question
                    </span>
                  </div>
                  <Progress value={Math.min((60 / (timeTaken / total)) * 100, 100)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/mobile/solutions')}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-medium"
            >
              View Solutions
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => router.push('/mobile/quiz-config')}
                variant="outline"
                className="h-12 rounded-xl border-slate-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reattempt
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="h-12 rounded-xl border-slate-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <Button
              onClick={() => router.push('/mobile/home')}
              variant="ghost"
              className="w-full h-12 rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}