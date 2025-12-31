
import React, { useEffect, useState } from 'react';
import { UserState, View, LearningPath } from '../types';
import { generateLearningPath } from '../services/geminiService';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
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

  const skillData = [
    { subject: 'Technical', A: (user.quizResults?.score || 0) * 20, fullMark: 100 },
    { subject: 'Soft Skills', A: 45, fullMark: 100 },
    { subject: 'Logic', A: 65, fullMark: 100 },
    { subject: 'Industry', A: 30, fullMark: 100 },
    { subject: 'Domain', A: 55, fullMark: 100 },
    { subject: 'Aptitude', A: 70, fullMark: 100 },
  ];

  const growthData = [
    { name: 'D1', readiness: (user.quizResults?.score || 0) * 10 },
    { name: 'W1', readiness: (user.quizResults?.score || 0) * 10 + 15 },
    { name: 'W2', readiness: (user.quizResults?.score || 0) * 10 + 30 },
    { name: 'W3', readiness: (user.quizResults?.score || 0) * 10 + 45 },
    { name: '🚀', readiness: 92 },
  ];

  const readinessScore = Math.min(100, (user.quizResults?.score || 0) * 15 + 20);
  const tier = readinessScore > 80 ? 'Gold' : readinessScore > 50 ? 'Silver' : 'Bronze';

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6 py-12">
        <div className="relative">
          <Loader2 className="animate-spin text-indigo-600" size={64} strokeWidth={1} />
        </div>
        <div className="text-center space-y-2 px-6">
          <p className="text-xl font-bold text-slate-900">Configuring Command Center...</p>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            Analyzing your {user.targetRole} skills to build a personalized trajectory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Top Profile Header */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start justify-between">
        <div className="flex items-center gap-4 md:gap-5 w-full">
          <div className="relative shrink-0">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-2xl md:text-3xl font-black shadow-xl">
              {user.name.charAt(0)}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-lg border border-slate-100">
              <div className="bg-emerald-500 w-3 h-3 rounded-full border-2 border-white"></div>
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-3xl font-bold text-slate-900 truncate max-w-[150px] md:max-w-none">
                {user.name}
              </h1>
              <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold uppercase tracking-widest border ${
                tier === 'Gold' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                tier === 'Silver' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                'bg-orange-50 text-orange-600 border-orange-200'
              }`}>
                {tier} Tier
              </span>
            </div>
            <p className="text-slate-500 flex items-center gap-1 mt-1 text-xs md:text-sm">
              <span className="text-indigo-600 font-semibold truncate">{user.targetRole}</span> 
              <ChevronRight size={14} className="shrink-0" /> Global
            </p>
          </div>
        </div>

        <button 
          onClick={() => onNavigate(View.INTERVIEW)} 
          className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
        >
          <Zap size={16} className="text-amber-400 fill-amber-400" />
          Quick Interview
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Panel */}
        <div className="lg:col-span-1 space-y-6 md:space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                    <Target size={18} className="text-indigo-600" />
                    Readiness Score
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">LIVE</span>
                </div>
                
                <div className="relative flex items-center justify-center py-2 md:py-4">
                  <svg className="w-32 h-32 md:w-48 md:h-48 transform -rotate-90">
                    <circle cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="50%" cy="50%" r="42%" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray="264"
                      strokeDashoffset={264 - (264 * readinessScore) / 100}
                      strokeLinecap="round"
                      className="text-indigo-600 transition-all duration-1000 ease-out" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">{readinessScore}%</span>
                    <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">Placement Odds</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">Growth</p>
                    <p className="text-sm md:text-lg font-bold text-emerald-600 flex items-center gap-1">
                      <TrendingUp size={14} /> +12%
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 md:p-4 rounded-xl md:rounded-2xl">
                    <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase mb-1">Rank</p>
                    <p className="text-sm md:text-lg font-bold text-slate-900 flex items-center gap-1 truncate">
                      <Flame size={14} className="text-orange-500" /> Top 15%
                    </p>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <h3 className="text-lg md:text-xl font-bold mb-4">Focus of the Day</h3>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} />
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-xs md:text-sm truncate">System Design</p>
                  <p className="text-[10px] md:text-xs text-indigo-100 truncate">Scalability patterns</p>
                </div>
              </div>
              <button 
                onClick={() => onNavigate(View.LEARNING_PATH)}
                className="w-full bg-white text-indigo-600 py-2.5 md:py-3 rounded-xl font-bold text-xs md:text-sm hover:scale-[1.02] transition-transform shadow-md"
              >
                Resume Trajectory
              </button>
            </div>
            <Sparkles className="absolute -bottom-4 -right-4 opacity-10" size={80} />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Radar Chart */}
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm h-72 md:h-96">
              <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2 text-sm md:text-base">
                <Sparkles size={16} className="text-indigo-600" />
                Skill Fingerprint
              </h3>
              <p className="text-[9px] text-slate-400 mb-4 font-medium uppercase tracking-wide">Multi-Dim Analysis</p>
              <div className="h-48 md:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}} />
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

            {/* Area Chart */}
            <div className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-200 shadow-sm h-72 md:h-96">
              <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2 text-sm md:text-base">
                <TrendingUp size={16} className="text-emerald-500" />
                Growth Path
              </h3>
              <p className="text-[9px] text-slate-400 mb-4 font-medium uppercase tracking-wide">AI Forecasting</p>
              <div className="h-48 md:h-64 w-full">
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
                      tick={{fill: '#94a3b8', fontSize: 8, fontWeight: 700}} 
                    />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px'}} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="readiness" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorReadiness)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="bg-slate-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-6 border border-white/10 shadow-2xl">
            <div>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mb-1">Lessons</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl md:text-3xl font-black">12</span>
                <span className="text-[8px] md:text-[10px] text-emerald-400 font-bold">+2</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mb-1">Mock Interviews</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl md:text-3xl font-black">4</span>
                <span className="text-[8px] md:text-[10px] text-indigo-400 font-bold">Elite</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mb-1">Streak</p>
              <div className="flex items-center gap-1 text-orange-400">
                <Flame size={16} />
                <span className="text-xl md:text-3xl font-black">3</span>
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[8px] md:text-[10px] font-bold uppercase mb-1">Target Sal.</p>
              <div className="flex items-baseline gap-1.5 text-amber-400">
                <span className="text-xl md:text-3xl font-black">$120k</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
