'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.sendEmailOTP(email, name);
      if (response.data.success) {
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyEmailOTP(email, otp, name);
      if (response.data.success) {
        login(response.data.token);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-md rounded-2xl shadow-sm border-slate-200">
        <CardHeader className="text-center space-y-2 pb-8">
          <CardTitle className="text-3xl font-semibold text-slate-900">
            {step === 'email' ? 'Welcome Back 👋' : 'Verify Your Email'}
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            {step === 'email' ? 'Enter your details to continue learning' : 'We sent a 6-digit code to your email'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="rounded-xl h-12 text-base border-slate-300 focus:border-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl h-12 text-base border-slate-300 focus:border-indigo-500"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full rounded-xl h-12 text-base bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700 font-medium">Verification Code</Label>
                <Input
                  id="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="rounded-xl h-12 text-base text-center tracking-widest text-2xl border-slate-300 focus:border-indigo-500"
                />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button type="submit" className="w-full rounded-xl h-12 text-base bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full rounded-xl h-12 text-slate-600 hover:text-slate-900"
                onClick={() => setStep('email')}
              >
                ← Change Email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
