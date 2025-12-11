'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Award, Flame, Clock, Trophy } from 'lucide-react';

export default function DailyQuizPage() {
  const router = useRouter();
  const [timeUntilNext, setTimeUntilNext] = useState('23:45:30');
  const [hasCompletedToday, setHasCompletedToday] = useState(false);

  const handleStartQuiz = () => {
    router.push('/mobile/quiz?mode=daily');
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 pt-8 pb-6">
          <button onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="text-6xl">🎯</div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Daily Quiz</h1>
              <p className="text-green-100 text-sm">One quiz per day</p>
            </div>
          </div>
        </div>

        <MobileContainer>
          {/* Streak Card */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 -mt-4 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center">
                    <Flame className="w-9 h-9 text-white" />
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-orange-700 mb-1">7</p>
                    <p className="text-sm text-orange-600">Day Streak</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-orange-600 mb-1">Best Streak</p>
                  <p className="text-2xl font-bold text-orange-700">15</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Quiz Card */}
          {!hasCompletedToday ? (
            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 mb-6">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Badge className="bg-green-600 text-white mb-4">Available Now</Badge>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Today's Challenge</h2>
                  <p className="text-slate-600">Complete today's quiz to maintain your streak</p>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm text-slate-600">10 Questions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm text-slate-600">10 Minutes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Trophy className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm text-slate-600">+1 Streak</p>
                  </div>
                </div>

                <Button
                  onClick={handleStartQuiz}
                  className="w-full h-14 rounded-xl bg-green-600 hover:bg-green-700 text-lg font-semibold"
                >
                  Start Daily Quiz 🚀
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 mb-6">
              <CardContent className="p-6 text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
                <p className="text-slate-600 mb-4">Great job! Come back tomorrow for the next challenge</p>
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="text-sm text-indigo-700 mb-1">Next quiz in</p>
                  <p className="text-2xl font-bold text-indigo-900">{timeUntilNext}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rules Card */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Rules</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Only one attempt per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Complete the quiz to maintain your streak</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>New quiz available every day at midnight</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Missing a day will reset your streak</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="border-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Leaderboard</h3>
                <Badge variant="outline">Top 10</Badge>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((rank) => (
                  <div key={rank} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        rank === 2 ? 'bg-slate-200 text-slate-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {rank}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">User {rank}</p>
                        <p className="text-xs text-slate-500">{30 - rank} day streak</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{100 - rank * 5}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}