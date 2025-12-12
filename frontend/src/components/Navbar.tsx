'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
            🎯 QuizApp
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/exams" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Exams
            </Link>
            <Link href="/questions" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Questions
            </Link>
            <Link href="/quiz" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
              Take Quiz
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Dashboard
                </Link>
                <Link href="/profile" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <span className="text-slate-700 font-medium">{user.name}</span>
                <Button variant="ghost" onClick={logout} className="rounded-xl text-slate-600 hover:text-slate-900">
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button asChild variant="ghost" className="rounded-xl">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="rounded-xl bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden z-[50] relative"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-slate-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-64 bg-white">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-1">
            <Link href="/exams" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Exams
            </Link>
            <Link href="/tests" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tests
            </Link>
            <Link href="/daily-quiz" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Daily Quiz
            </Link>
            <Link href="/pyqs" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              PYQs
            </Link>
            {user ? (
              <>
                <div className="border-t my-2"></div>
                <Link href="/dashboard" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
                <Link href="/analytics" className="flex items-center gap-3 text-slate-700 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </Link>
                <div className="border-t my-2"></div>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 text-red-600 font-medium px-3 py-2.5 rounded-lg hover:bg-red-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t my-2"></div>
                <Link href="/login" className="flex items-center gap-3 text-indigo-600 font-medium px-3 py-2.5 rounded-lg hover:bg-indigo-50 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </Link>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
