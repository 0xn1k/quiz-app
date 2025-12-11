'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, BookOpen, FileText, Clock } from 'lucide-react';

const CATEGORY_DATA: any = {
  'upsc': { name: 'UPSC (PRE)', icon: '🏛️', color: 'bg-blue-500' },
  'bank': { name: 'BANK', icon: '🏦', color: 'bg-green-500' },
  'railway': { name: 'RAILWAY', icon: '🚂', color: 'bg-orange-500' },
  'ssc': { name: 'SSC', icon: '📋', color: 'bg-purple-500' },
  'gate': { name: 'GATE', icon: '🎓', color: 'bg-indigo-500' },
  'state-pcs': { name: 'STATE PCS', icon: '🏢', color: 'bg-pink-500' },
};

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.id as string;
  const category = CATEGORY_DATA[categoryId] || CATEGORY_DATA['upsc'];

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className={`${category.color} text-white px-4 pt-8 pb-6`}>
          <button onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{category.icon}</div>
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-white/90 text-sm">Choose your study mode</p>
            </div>
          </div>
        </div>

        <MobileContainer>
          <div className="space-y-3 -mt-4">
            {/* Quick Test */}
            <Link href={`/mobile/quiz-config?category=${categoryId}`}>
              <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Start Quick Test</h3>
                        <p className="text-sm text-slate-500">Random questions</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Chapter-wise */}
            <Link href={`/mobile/chapters?category=${categoryId}`}>
              <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Chapter-wise</h3>
                        <p className="text-sm text-slate-500">Practice by chapters</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Topic-wise */}
            <Link href={`/mobile/topics?category=${categoryId}`}>
              <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Topic-wise</h3>
                        <p className="text-sm text-slate-500">Practice by topics</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Previous Year Papers */}
            <Link href={`/mobile/pyq?category=${categoryId}`}>
              <Card className="border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Previous Year Papers</h3>
                        <p className="text-sm text-slate-500">Past exam questions</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Card */}
          <Card className="mt-6 border-slate-200">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Your Progress</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">0</p>
                  <p className="text-xs text-slate-500 mt-1">Tests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0%</p>
                  <p className="text-xs text-slate-500 mt-1">Accuracy</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-slate-500 mt-1">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}