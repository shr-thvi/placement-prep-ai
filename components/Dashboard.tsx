
import React, { useEffect, useState } from 'react';
import { UserState, View, LearningPath } from '../types';
import { generateLearningPath } from '../services/geminiService';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { 
  Award, Briefcase, TrendingUp, Sparkles, Loader2, 
  Target, Zap, Flame, ChevronRight, CheckCircle2 
} from 'lucide-react';

interface DashboardProps {
  user: UserState;
  onSetLearningPath: (path: LearningPath) => void;
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onSetLearningPath, onNavigate }) => {
  const [loading, setLoading] = useState(!user.learningPath);

  useEffect(() => {
    if (!user.learningPath) {
      const getPath = async () => {
        const path = await generateLearningPath(user.targetRole, user.quizResults?.score || 0);
        onSetLearningPath(path);
        setLoading(false);
      };
      getPath();
    }
  }, [user, onSetLearningPath]);

  // Skill Fingerprint Data
  const skillData = [
    { subject: 'Technical', A: (user.quizResults?.score || 0) * 20, fullMark: 100 },
    { subject: 'Soft Skills', A: 45, fullMark: 100 },
    { subject: 'Logic', A: 65, fullMark: 100 },
    { subject: 'Industry', A: 30, fullMark: 100 },
    { subject: 'Domain', A: 55, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
  ];

  // Simulated Readiness Growth Projection
  const growthData = [
    { name: 'Day 1', readiness: (user.quizResults?.score || 0) * 10 },
    { name: 'Week 1', readiness: (user.quizResults?.score || 0) * 10 + 15 },
    { name: 'Week 2', readiness: (user.quizResults?.score || 0) * 10 + 30 },
    { name: 'Week 3', readiness: (user.quizResults?.score || 0) * 10 + 45 },
    { name: 'Launch', readiness: 92 },
  ];

  const readinessScore = Math.min(100, (user.quizResults?.score || 0) * 15 + 20);
  const tier = readinessScore > 80 ? 'Gold' : readinessScore > 50 ? 'Silver' : 'Bronze';

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-600" size={64} strokeWidth={1} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Rocket className="text-indigo-400" size={24} />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-slate-900">Configuring Command Center...</p>
          <p className="text-slate-500 max-w-xs mx-auto">
            Analyzing your {user.targetRole} skills to build a 100% personalized trajectory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Profile Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-3xl font-black shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-xl shadow-lg border border-slate-100">
              <div className="bg-emerald-500 w-4 h-4 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">Master {user.name}</h1>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                tier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                tier === 'Silver' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                {tier} Tier Ready
              </span>
            </div>
            <p className="text-slate-500 flex items-center gap-1 mt-1">
              Trajectory: <span className="text-indigo-600 font-semibold">{user.targetRole}</span> 
              <ChevronRight size={14} /> Global Standard
            </p>
          </div>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => onNavigate(View.INTERVIEW)} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
            <Zap size={16} className="text-amber-400 fill-amber-400" />
            Quick Interview
          </button>
        </div>
      </div>

      {/* Main Command Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Readiness Circular Gauge - Left Panel */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Target size={20} className="text-indigo-600" />
                    Readiness Score
                  </h3>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">LIVE</span>
                </div>
                
                <div className="relative flex items-center justify-center py-4">
                  <svg className="w-48 h-48 transform -rotate-90">
                    <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={552.92}
                      strokeDashoffset={552.92 - (552.92 * readinessScore) / 100}
                      strokeLinecap="round"
                      className="text-indigo-600 transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{readinessScore}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Placement Prob.</span>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Weekly Growth</p>
                    <p className="text-lg font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={16} /> +12%
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Rank Status</p>
                    <p className="text-lg font-bold text-slate-900 flex items-center gap-1">
                      <Flame size={16} className="text-orange-500" /> Top 15%
                    </p>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-4">Focus of the Day</h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">System Design</p>
                  <p className="text-xs text-indigo-100">Review scalability patterns</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate(View.LEARNING_PATH)}
                className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform"
              >
                Resume Learning
              </button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 opacity-10" size={120} />
          </div>
        </div>

        {/* Charts Section - Center & Right Panel */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Radar Skill Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-96">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                Skill Fingerprint
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-wide">Multi-Dimensional Analysis</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Growth Projection Area Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-96">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <TrendingUp size={18} className="text-emerald-500" />
                Projected Trajectory
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-medium uppercase tracking-wide">AI-Driven Path Forecasting</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="colorReadiness" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="readiness" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorReadiness)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-8 border border-white/10 shadow-2xl">
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Lessons Done</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black">12</span>
                <span className="text-xs text-emerald-400">+2 today</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Interview Reps</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black">4</span>
                <span className="text-xs text-indigo-400">Elite Rank</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Streak</p>
              <div className="flex items-center gap-2 text-orange-400">
                <Flame size={24} />
                <span className="text-3xl font-black">3 Days</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-bold uppercase mb-2">Target Salary</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-amber-400">$120k</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Simple wrapper for the rocket icon used in loading
const Rocket = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2" />
    <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5" />
  </svg>
);

export default Dashboard;
