import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-900 mb-8">Refund Policy</h1>
        
        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>7-Day Money Back Guarantee</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-600">
            <p>We offer a 7-day money-back guarantee on all premium subscriptions. If you're not satisfied, request a full refund within 7 days of purchase.</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>Refund Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <p>You are eligible for a refund if:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Request made within 7 days of purchase</li>
              <li>Technical issues preventing service use</li>
              <li>Duplicate charges</li>
              <li>Service not as described</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm mb-6">
          <CardHeader>
            <CardTitle>How to Request a Refund</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ol className="list-decimal pl-6 space-y-2">
              <li>Contact support at support@quizapp.com</li>
              <li>Provide your order ID and reason</li>
              <li>Refunds processed within 5-7 business days</li>
            </ol>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Non-Refundable Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-600">
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions after 7 days</li>
              <li>Partially used subscriptions</li>
              <li>Promotional or discounted purchases</li>
            </ul>
          </CardContent>
        </Card>

        <p className="text-sm text-slate-500 mt-8">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
}
