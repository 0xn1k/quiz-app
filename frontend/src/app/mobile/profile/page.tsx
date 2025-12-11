'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Award, 
  Settings, 
  LogOut,
  ChevronRight,
  Crown
} from 'lucide-react';

export default function MobileProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/mobile/login');
  };

  if (!user) {
    router.push('/mobile/login');
    return null;
  }

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 pt-8 pb-12">
          <button onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          {/* Profile Info */}
          <div className="text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
              👤
            </div>
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            <p className="text-indigo-100 text-sm mb-3">{user.email || user.mobile}</p>
            {user.isPremium ? (
              <Badge className="bg-yellow-500 text-yellow-900 border-0">
                <Crown className="w-3 h-3 mr-1" />
                Premium Member
              </Badge>
            ) : (
              <Badge className="bg-white/20 text-white border-white/30">
                Free Account
              </Badge>
            )}
          </div>
        </div>

        <MobileContainer>
          {/* Stats Card */}
          <Card className="border-slate-200 -mt-8 mb-6">
            <CardContent className="p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">0</p>
                  <p className="text-xs text-slate-500 mt-1">Tests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">0%</p>
                  <p className="text-xs text-slate-500 mt-1">Avg Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">0</p>
                  <p className="text-xs text-slate-500 mt-1">Streak</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Section */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900 mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-500">Name</p>
                    <p className="font-medium text-slate-900">{user.name}</p>
                  </div>
                </div>

                {user.email && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium text-slate-900">{user.email}</p>
                      </div>
                    </div>
                  </>
                )}

                {user.mobile && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-500">Mobile</p>
                        <p className="font-medium text-slate-900">{user.mobile}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Subscription Card */}
          {!user.isPremium && (
            <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 mb-6">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Upgrade to Premium</h3>
                      <p className="text-sm text-slate-600">Unlock all features</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => router.push('/mobile/subscription')}
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 rounded-lg"
                  >
                    Upgrade
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Menu Items */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-0">
              <button
                onClick={() => router.push('/mobile/settings')}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <Separator />

              <button
                onClick={() => router.push('/mobile/analytics')}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">My Progress</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            </CardContent>
          </Card>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 rounded-xl border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}