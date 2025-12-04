'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            QuizApp
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/tests" className="text-gray-700 hover:text-blue-600">
              Tests
            </Link>
            <Link href="/daily-quiz" className="text-gray-700 hover:text-blue-600">
              Daily Quiz
            </Link>
            <Link href="/pyqs" className="text-gray-700 hover:text-blue-600">
              PYQs
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  Dashboard
                </Link>
                <Link href="/analytics" className="text-gray-700 hover:text-blue-600">
                  Analytics
                </Link>
              </>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {!user.isPremium && (
                  <Link
                    href="/pricing"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg font-semibold"
                  >
                    Go Premium
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <span className="text-gray-700">{user.name}</span>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </Link>
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
