'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { testAPI, analyticsAPI } from '@/lib/api';
import { Test, Question } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function TestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTest();
  }, [params.id]);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && started) {
      handleSubmit();
    }
  }, [started, timeLeft]);

  const fetchTest = async () => {
    try {
      const { data } = await testAPI.getById(params.id as string);
      setTest(data.test);
      setTimeLeft(data.test.duration * 60);
    } catch (error) {
      console.error('Error fetching test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setStarted(true);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!test) return;
    
    const submissionData = {
      testId: test._id,
      answers: test.questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || '',
        timeTaken: 30,
      })),
      timeTaken: test.duration * 60 - timeLeft,
    };

    try {
      await analyticsAPI.submit(submissionData);
      router.push('/analytics');
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!test) return <div className="min-h-screen flex items-center justify-center">Test not found</div>;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-4">{test.title}</h1>
            <p className="text-gray-600 mb-6">{test.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Duration</div>
                <div className="text-2xl font-bold">{test.duration} mins</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Questions</div>
                <div className="text-2xl font-bold">{test.questions.length}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Total Marks</div>
                <div className="text-2xl font-bold">{test.totalMarks}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Difficulty</div>
                <div className="text-2xl font-bold capitalize">{test.difficulty}</div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Read each question carefully</li>
                <li>Select the best answer for each question</li>
                <li>You can navigate between questions</li>
                <li>Submit before time runs out</li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex justify-between items-center">
          <div>
            <span className="text-gray-600">Question {currentQuestion + 1} of {test.questions.length}</span>
          </div>
          <div className="text-xl font-bold text-blue-600">
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Question */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(question._id, option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  answers[question._id] === option
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentQuestion === test.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold mb-3">Question Navigator</h3>
          <div className="grid grid-cols-10 gap-2">
            {test.questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg ${
                  answers[q._id]
                    ? 'bg-green-500 text-white'
                    : currentQuestion === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
