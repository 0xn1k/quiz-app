import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-slate-900 mb-4">About Quiz App</h1>
        <p className="text-xl text-slate-600 mb-12">Empowering learners to achieve their goals</p>
        
        <Card className="rounded-2xl border-slate-200 shadow-sm mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              Quiz App is dedicated to making exam preparation accessible, effective, and engaging. We provide a comprehensive platform with thousands of questions, detailed analytics, and personalized learning paths to help students excel in their exams.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="rounded-2xl border-slate-200 shadow-sm text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">10,000+</h3>
              <p className="text-slate-600">Questions</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">50,000+</h3>
              <p className="text-slate-600">Active Users</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-slate-200 shadow-sm text-center">
            <CardContent className="p-6">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">4.8/5</h3>
              <p className="text-slate-600">User Rating</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Why Choose Us?</h2>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Comprehensive question bank covering all major exams</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Detailed performance analytics and insights</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Regular updates with latest exam patterns</span>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">✓</span>
                <span>Mobile-friendly platform for learning on the go</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
