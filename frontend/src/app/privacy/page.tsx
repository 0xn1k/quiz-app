import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-900 mb-8">Privacy Policy</h1>
        
        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name and email address</li>
              <li>Account credentials</li>
              <li>Quiz responses and performance data</li>
              <li>Payment information (processed securely)</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Track your learning progress</li>
              <li>Send important updates and notifications</li>
              <li>Process payments and subscriptions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            <p>We implement industry-standard security measures to protect your personal information.</p>
          </CardContent>
        </Card>

        <p className="text-sm text-slate-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
