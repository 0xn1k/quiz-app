import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-900 mb-8">Terms of Service</h1>
        
        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            <p>By accessing and using Quiz App, you accept and agree to be bound by these Terms of Service.</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information</li>
              <li>Keep your password secure</li>
              <li>You are responsible for all activities under your account</li>
              <li>One account per user</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Prohibited Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ul className="list-disc pl-6 space-y-2">
              <li>Sharing account credentials</li>
              <li>Copying or distributing content</li>
              <li>Using automated tools or bots</li>
              <li>Attempting to breach security</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </CardContent>
        </Card>

        <p className="text-sm text-slate-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
