'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

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

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-[100]" onClick={() => setMobileMenuOpen(false)} />}
      
      {/* Mobile Menu Drawer */}
      <div className={`fixed top-0 right-0 h-screen w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[101] ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full bg-white p-6 flex flex-col">
          <button onClick={() => setMobileMenuOpen(false)} className="self-end mb-2 p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <svg className="w-6  text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex flex-col gap-3">
            <Link href="/tests" className="flex items-center gap-4 text-slate-800 font-semibold text-base hover:text-indigo-600 hover:bg-indigo-50 p-4 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Tests</span>
            </Link>
            <Link href="/daily-quiz" className="flex items-center gap-4 text-slate-800 font-semibold text-base hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Daily Quiz</span>
            </Link>
            <Link href="/pyqs" className="flex items-center gap-4 text-slate-800 font-semibold text-base hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>PYQs</span>
            </Link>
            {user ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-4 text-slate-800 font-semibold text-base hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <Link href="/analytics" className="flex items-center gap-4 text-slate-800 font-semibold text-base hover:text-indigo-600 hover:bg-indigo-50 p-3 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Analytics</span>
                </Link>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-4 text-left text-red-600 font-semibold text-base hover:text-red-700 hover:bg-red-50 p-3 rounded-lg transition-all">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link href="/login" className="flex items-center gap-4 text-indigo-600 font-semibold text-base hover:text-indigo-700 hover:bg-indigo-50 p-3 rounded-lg transition-all" onClick={() => setMobileMenuOpen(false)}>
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
