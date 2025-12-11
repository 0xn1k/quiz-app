'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Clock, Hash, Zap } from 'lucide-react';

export default function QuizConfigPage() {
  const router = useRouter();
  const [config, setConfig] = useState({
    questionCount: 10,
    difficulty: 'medium',
    timerEnabled: true,
    timePerQuestion: 60, // seconds
  });

  const handleStartQuiz = () => {
    // Store config and navigate to quiz
    localStorage.setItem('quizConfig', JSON.stringify(config));
    router.push('/mobile/quiz');
  };

  const totalTime = config.questionCount * config.timePerQuestion;
  const minutes = Math.floor(totalTime / 60);

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Configure Quiz</h1>
          </div>
        </div>

        <MobileContainer>
          <div className="space-y-6">
            {/* Number of Questions */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Hash className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-base font-semibold text-slate-900">Number of Questions</Label>
                    <p className="text-sm text-slate-500">Select how many questions</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-indigo-600">{config.questionCount}</span>
                    <span className="text-sm text-slate-500">questions</span>
                  </div>
                  <Slider
                    value={[config.questionCount]}
                    onValueChange={(value) => setConfig({ ...config, questionCount: value[0] })}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>5</span>
                    <span>25</span>
                    <span>50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Difficulty Level */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <Label className="text-base font-semibold text-slate-900">Difficulty Level</Label>
                    <p className="text-sm text-slate-500">Choose difficulty</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setConfig({ ...config, difficulty: level })}
                      className={`py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                        config.difficulty === level
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Timer Settings */}
            <Card className="border-slate-200">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Label className="text-base font-semibold text-slate-900">Enable Timer</Label>
                      <p className="text-sm text-slate-500">Time limit per question</p>
                    </div>
                  </div>
                  <Switch
                    checked={config.timerEnabled}
                    onCheckedChange={(checked) => setConfig({ ...config, timerEnabled: checked })}
                  />
                </div>

                {config.timerEnabled && (
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Time per question</span>
                      <span className="text-lg font-bold text-green-600">{config.timePerQuestion}s</span>
                    </div>
                    <Slider
                      value={[config.timePerQuestion]}
                      onValueChange={(value) => setConfig({ ...config, timePerQuestion: value[0] })}
                      min={30}
                      max={180}
                      step={15}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>30s</span>
                      <span>90s</span>
                      <span>180s</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
              <CardContent className="p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Quiz Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Questions:</span>
                    <span className="font-semibold text-slate-900">{config.questionCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Difficulty:</span>
                    <span className="font-semibold text-slate-900 capitalize">{config.difficulty}</span>
                  </div>
                  {config.timerEnabled && (
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Time:</span>
                      <span className="font-semibold text-slate-900">{minutes} min</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Start Button */}
            <Button
              onClick={handleStartQuiz}
              className="w-full h-14 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-lg font-semibold"
            >
              Start Quiz 🚀
            </Button>
          </div>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}