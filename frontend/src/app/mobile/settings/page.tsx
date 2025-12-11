'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Bell, 
  Moon, 
  Globe, 
  Trash2,
  Shield,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function MobileSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    darkMode: false,
    language: 'English',
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-lg font-bold text-slate-900">Settings</h1>
          </div>
        </div>

        <MobileContainer>
          {/* Notifications */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Notifications</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={() => handleToggle('emailNotifications')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">Push Notifications</p>
                    <p className="text-sm text-slate-500">Get notified about daily quiz</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={() => handleToggle('pushNotifications')}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <Moon className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-900">Appearance</h3>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Dark Mode</p>
                  <p className="text-sm text-slate-500">Switch to dark theme</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={() => handleToggle('darkMode')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-600" />
                  <div>
                    <p className="font-medium text-slate-900">Language</p>
                    <p className="text-sm text-slate-500">{settings.language}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-indigo-600">
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-0">
              <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Privacy Policy</span>
                </div>
              </button>

              <Separator />

              <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Terms of Service</span>
                </div>
              </button>

              <Separator />

              <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900">Help & Support</span>
                </div>
              </button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-red-600" />
                <h3 className="font-semibold text-red-900">Danger Zone</h3>
              </div>
              <p className="text-sm text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* App Version */}
          <div className="text-center py-6 text-sm text-slate-500">
            <p>QuizApp v1.0.0</p>
            <p className="mt-1">© 2024 All rights reserved</p>
          </div>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}