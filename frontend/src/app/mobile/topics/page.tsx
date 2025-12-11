'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search } from 'lucide-react';

const SAMPLE_TOPICS = [
  { id: '1', chapter: 'Indian Polity', name: 'Constitution Basics', questionCount: 45 },
  { id: '2', chapter: 'Indian Polity', name: 'Fundamental Rights', questionCount: 38 },
  { id: '3', chapter: 'Indian Economy', name: 'Banking System', questionCount: 52 },
  { id: '4', chapter: 'Indian Economy', name: 'Fiscal Policy', questionCount: 41 },
  { id: '5', chapter: 'Geography', name: 'Physical Geography', questionCount: 67 },
  { id: '6', chapter: 'Geography', name: 'Indian Geography', questionCount: 58 },
  { id: '7', chapter: 'History', name: 'Ancient India', questionCount: 72 },
  { id: '8', chapter: 'History', name: 'Medieval India', questionCount: 64 },
];

export default function TopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'upsc';
  
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredTopics = SAMPLE_TOPICS.filter(topic =>
    topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    topic.chapter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleStartQuiz = () => {
    if (selectedTopics.length > 0) {
      router.push(`/mobile/quiz-config?topics=${selectedTopics.join(',')}`);
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
            <h1 className="text-lg font-bold text-slate-900">Select Topics</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl border-slate-300"
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-10">
              <TabsTrigger value="all" className="text-sm">All Topics</TabsTrigger>
              <TabsTrigger value="chapters" className="text-sm">By Chapter</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <MobileContainer>
          {/* Selection Info */}
          {selectedTopics.length > 0 && (
            <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
              <p className="text-sm text-indigo-700">
                <strong>{selectedTopics.length}</strong> topic{selectedTopics.length > 1 ? 's' : ''} selected
              </p>
            </div>
          )}

          {/* Topic List */}
          <div className="space-y-2">
            {filteredTopics.map((topic) => (
              <Card
                key={topic.id}
                className={`border-2 transition-all cursor-pointer ${
                  selectedTopics.includes(topic.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => toggleTopic(topic.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={selectedTopics.includes(topic.id)}
                        onCheckedChange={() => toggleTopic(topic.id)}
                        className="w-5 h-5"
                      />
                      <div>
                        <h3 className="font-semibold text-slate-900">{topic.name}</h3>
                        <p className="text-xs text-slate-500">{topic.chapter} • {topic.questionCount} questions</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTopics.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-500">No topics found</p>
            </div>
          )}
        </MobileContainer>

        {/* Fixed Bottom Button */}
        {selectedTopics.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 safe-area-inset-bottom">
            <div className="max-w-md mx-auto">
              <Button
                onClick={handleStartQuiz}
                className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-base font-medium"
              >
                Start Quiz ({selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''})
              </Button>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}