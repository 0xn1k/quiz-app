'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { paymentAPI } from '@/lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: 'Monthly',
      price: 499,
      duration: 'month',
      features: [
        'Unlimited test attempts',
        'Access to all PYQs',
        'Detailed analytics',
        'Performance tracking',
        'Priority support',
      ],
    },
    {
      name: 'Quarterly',
      price: 1299,
      duration: '3 months',
      features: [
        'All Monthly features',
        'Save 13%',
        'Extended validity',
        'Bonus practice tests',
        'Email support',
      ],
      popular: true,
    },
    {
      name: 'Yearly',
      price: 3999,
      duration: 'year',
      features: [
        'All Quarterly features',
        'Save 33%',
        'Best value',
        'Exclusive content',
        '24/7 support',
      ],
    },
  ];

  const handleSubscribe = async (plan: string, amount: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await paymentAPI.createOrder({
        amount,
        currency: 'INR',
        plan,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'QuizApp',
        description: `${plan} Subscription`,
        order_id: data.orderId,
        handler: async (response: any) => {
          try {
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            alert('Subscription successful!');
            router.push('/dashboard');
          } catch (error) {
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.mobile,
        },
        theme: {
          color: '#3b82f6',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Unlock premium features and accelerate your learning
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                plan.popular ? 'ring-4 ring-blue-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-600 text-white text-center py-2 font-semibold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-gray-600">/{plan.duration}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.name.toLowerCase(), plan.price)}
                  disabled={loading}
                  className={`w-full py-3 rounded-lg font-semibold transition ${
                    plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Processing...' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🚀</div>
              <div>
                <h3 className="font-semibold mb-1">Unlimited Access</h3>
                <p className="text-gray-600">
                  Take unlimited tests without any restrictions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-3xl mr-4">📊</div>
              <div>
                <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                <p className="text-gray-600">
                  Get detailed insights into your performance
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-3xl mr-4">📚</div>
              <div>
                <h3 className="font-semibold mb-1">All PYQs</h3>
                <p className="text-gray-600">
                  Access complete collection of past year questions
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-3xl mr-4">💬</div>
              <div>
                <h3 className="font-semibold mb-1">Priority Support</h3>
                <p className="text-gray-600">
                  Get help whenever you need it from our team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
