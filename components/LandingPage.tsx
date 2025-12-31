
import React, { useState } from 'react';
import { Target, Rocket, ShieldCheck, Zap } from 'lucide-react';

interface LandingPageProps {
  onStart: (name: string, role: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('Software Engineer');

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Digital Marketer',
    'Financial Analyst'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name, role);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-800 text-white">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/30 border border-white/20 text-xs font-semibold mb-6">
            <Rocket size={14} />
            <span>THE MODERN PLACEMENT LAUNCHPAD</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            Elevate Your Career <br />With AI Insights
          </h1>
          <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
            Get job-ready with personalized learning paths, AI-powered mock interviews, and tailored mentor matching. Your future starts here.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg"><Zap size={20} /></div>
              <div>
                <p className="font-semibold">AI Diagnostic Test</p>
                <p className="text-sm text-indigo-200">Know exactly where you stand in minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg"><ShieldCheck size={20} /></div>
              <div>
                <p className="font-semibold">Interview Readiness</p>
                <p className="text-sm text-indigo-200">Practice with a persistent AI interviewer.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl text-slate-900">
          <h2 className="text-2xl font-bold mb-6">Get Started</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Career Path</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              Launch My Journey
              <Target size={20} />
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-6 text-center">
            No credit card required. Join 5,000+ students landing top jobs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
