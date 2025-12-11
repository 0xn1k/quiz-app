'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search } from 'lucide-react';

const SAMPLE_CHAPTERS = [
  { id: '1', name: 'Indian Polity', questionCount: 150 },
  { id: '2', name: 'Indian Economy', questionCount: 120 },
  { id: '3', name: 'Geography', questionCount: 200 },
  { id: '4', name: 'History', questionCount: 180 },
  { id: '5', name: 'Science & Technology', questionCount: 140 },
  { id: '6', name: 'Environment & Ecology', questionCount: 100 },
  { id: '7', name: 'Current Affairs', questionCount: 250 },
  { id: '8', name: 'Art & Culture', questionCount: 90 },
];

export default function ChaptersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'upsc';
  
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = SAMPLE_CHAPTERS.filter(chapter =>
    chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleChapter = (chapterId: string) => {
    setSelectedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleStartQuiz = () => {
    if (selectedChapters.length > 0) {
      router.push(`/mobile/quiz-config?chapters=${selectedChapters.join(',')}`);
    }
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50 pb-24">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Select Chapters</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search chapters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-300"
            />
          </div>
        </div>

        <MobileContainer>
          {/* Selection Info */}
          {selectedChapters.length > 0 && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-sm text-indigo-700">
                <strong>{selectedChapters.length}</strong> chapter{selectedChapters.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Chapter List */}
          <div className="space-y-2">
            {filteredChapters.map((chapter) => (
              <Card
                key={chapter.id}
                className={`border-2 transition-all cursor-pointer ${
                  selectedChapters.includes(chapter.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleChapter(chapter.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={selectedChapters.includes(chapter.id)}
                        onCheckedChange={() => toggleChapter(chapter.id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">{chapter.name}</h3>
                        <p className="text-sm text-slate-500">{chapter.questionCount} questions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredChapters.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500">No chapters found</p>
            </div>
          )}
        </MobileContainer>

        {/* Fixed Bottom Button */}
        {selectedChapters.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-inset-bottom">
            <div className="max-w-md mx-auto">
              <Button
                onClick={handleStartQuiz}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-medium"
              >
                Start Quiz ({selectedChapters.length} chapter{selectedChapters.length > 1 ? 's' : ''})
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}