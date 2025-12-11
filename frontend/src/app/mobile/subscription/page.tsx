'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileLayout, MobileContainer } from '@/components/MobileLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check, Crown, Zap } from 'lucide-react';

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    duration: '1 month',
    popular: false,
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 699,
    duration: '3 months',
    popular: true,
    savings: '22%',
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 1999,
    duration: '12 months',
    popular: false,
    savings: '44%',
  },
];

const FEATURES = [
  'Unlimited quiz attempts',
  'Access to all exam categories',
  'Detailed performance analytics',
  'Previous year questions',
  'Ad-free experience',
  'Priority support',
  'Downloadable study materials',
  'Custom quiz creation',
];

export default function MobileSubscriptionPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('quarterly');

  const handleSubscribe = () => {
    // Implement payment logic
    console.log('Subscribe to:', selectedPlan);
  };

  return (
    <MobileLayout>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 pt-8 pb-6">
          <button onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-6xl mb-3">✨</div>
            <h1 className="text-2xl font-bold mb-2">Upgrade to Premium</h1>
            <p className="text-amber-100">Unlock all features and boost your learning</p>
          </div>
        </div>

        <MobileContainer>
          {/* Plans */}
          <div className="space-y-3 mb-6 -mt-4">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-amber-500 bg-amber-50 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                } ${plan.popular ? 'ring-2 ring-amber-400' : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <CardContent className="p-5">
                  {plan.popular && (
                    <Badge className="bg-amber-600 text-white border-0 mb-3">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                      <p className="text-sm text-slate-600">{plan.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">₹{plan.price}</span>
                      </div>
                      {plan.savings && (
                        <Badge className="bg-green-100 text-green-700 border-green-300 mt-1">
                          Save {plan.savings}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Features */}
          <Card className="border-slate-200 mb-6">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-600" />
                <h3 className="font-semibold text-slate-900">Premium Features</h3>
              </div>
              <div className="space-y-3">
                {FEATURES.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-blue-200 bg-blue-50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 mb-1">Secure Payment</h4>
                  <p className="text-sm text-blue-700">
                    Your payment information is encrypted and secure. Cancel anytime.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscribe Button */}
          <Button
            onClick={handleSubscribe}
            className="w-full h-14 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-lg font-semibold shadow-lg"
          >
            <Crown className="w-5 h-5 mr-2" />
            Subscribe Now
          </Button>

          <p className="text-xs text-center text-slate-500 mt-4">
            By subscribing, you agree to our{' '}
            <a href="/terms" className="text-amber-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/refund" className="text-amber-600 hover:underline">Refund Policy</a>
          </p>
        </MobileContainer>
      </div>
    </MobileLayout>
  );
}