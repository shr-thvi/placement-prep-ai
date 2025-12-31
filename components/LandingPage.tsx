
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-900 text-white overflow-y-auto">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center py-10 md:py-0">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-400/30 border border-white/20 text-[10px] font-semibold mb-6 uppercase tracking-wider">
            <Rocket size={12} />
            <span>Modern Placement Launchpad</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
            Elevate Your <span className="text-indigo-300">Career</span> <br className="hidden md:block" /> with AI Insights
          </h1>
          <p className="text-indigo-100 text-sm md:text-lg mb-8 leading-relaxed max-w-md mx-auto md:mx-0">
            Get job-ready with personalized learning paths, AI-powered mock interviews, and tailored mentor matching.
          </p>
          
          <div className="hidden md:flex flex-col space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg shrink-0"><Zap size={20} /></div>
              <div className="text-left">
                <p className="font-semibold text-sm">AI Diagnostic Test</p>
                <p className="text-xs text-indigo-200">Know exactly where you stand in minutes.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/10 rounded-lg shrink-0"><ShieldCheck size={20} /></div>
              <div className="text-left">
                <p className="font-semibold text-sm">Interview Readiness</p>
                <p className="text-xs text-indigo-200">Practice with a persistent AI interviewer.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl text-slate-900 w-full max-w-sm mx-auto md:max-w-none">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">Join the Launchpad</h2>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5 md:mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                placeholder="e.g. Alex Chen"
              />
            </div>
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-700 mb-1.5 md:mb-2">Target Career Path</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white text-sm"
              >
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 text-sm md:text-base active:scale-[0.98]"
            >
              Launch My Journey
              <Target size={18} />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-6 text-center">
            Join 5,000+ students landing top tier roles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
