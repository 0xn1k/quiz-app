export interface User {
  _id: string;
  name: string;
  email?: string;
  mobile?: string;
  isPremium: boolean;
  subscriptionEndDate?: Date;
}

export interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isPYQ: boolean;
  year?: number;
  explanation?: string;
  tags: string[];
}

export interface Test {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  isPublic: boolean;
  duration: number;
  totalMarks: number;
  category: string;
  difficulty: string;
  createdBy: string;
  createdAt: Date;
}

export interface Analytics {
  _id: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  percentage: number;
  createdAt: Date;
}

export interface CategoryStats {
  category: string;
  totalTests: number;
  averageScore: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
}
