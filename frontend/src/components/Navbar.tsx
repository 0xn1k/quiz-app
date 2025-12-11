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
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link href="/tests" className="text-gray-700">
                Tests
              </Link>
              <Link href="/daily-quiz" className="text-gray-700">
                Daily Quiz
              </Link>
              <Link href="/pyqs" className="text-gray-700">
                PYQs
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-700">
                    Dashboard
                  </Link>
                  <Link href="/analytics" className="text-gray-700">
                    Analytics
                  </Link>
                  <button onClick={logout} className="text-left text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-blue-600">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
