'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authAPI.updateProfile({ name, email });
      if (response.data.success) {
        updateUser(response.data.user);
        setMessage(response.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-2">Profile Settings ⚙️</h1>
          <p className="text-slate-500 text-lg">Manage your account information</p>
        </div>
        
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-slate-900">Personal Information</CardTitle>
            <CardDescription className="text-slate-500">Update your profile details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                <Input
                  id="name"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl h-12 text-base border-slate-300 focus:border-indigo-500"
                />
                {user?.isEmailVerified === false && (
                  <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">⚠️ Email not verified</p>
                )}
                {user?.isEmailVerified && (
                  <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">✓ Email verified</p>
                )}
              </div>
              {message && <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{message}</p>}
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full rounded-xl h-12 text-base bg-indigo-600 hover:bg-indigo-700">
                {loading ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
