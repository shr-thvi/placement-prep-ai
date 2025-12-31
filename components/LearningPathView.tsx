
import React from 'react';
import { UserState, View } from '../types';
import { CheckCircle2, Circle, Clock, BookOpen, Lightbulb, PlayCircle } from 'lucide-react';

interface LearningPathViewProps {
  user: UserState;
  onNavigate: (view: View) => void;
}

const LearningPathView: React.FC<LearningPathViewProps> = ({ user, onNavigate }) => {
  const path = user.learningPath;

  if (!path) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Learning Roadmap</h1>
          <p className="text-slate-500 max-w-2xl">
            A curriculum specifically designed to bridge your skill gaps for the <span className="text-indigo-600 font-semibold">{user.targetRole}</span> role.
          </p>
        </div>
        <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <Clock size={16} />
          Total: 12h 45m
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {path.modules.map((module, idx) => (
            <div 
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-4 hover:border-indigo-300 transition-all cursor-pointer group"
            >
              <div className="mt-1">
                {idx === 0 ? (
                  <PlayCircle className="text-indigo-600" size={24} />
                ) : (
                  <Circle className="text-slate-300" size={24} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {module.title}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-500 uppercase tracking-wider">
                    {module.type}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {module.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span className="flex items-center gap-1"><Clock size={12} /> {module.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen size={12} /> {idx + 1} Lessons</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lightbulb className="text-amber-400" size={20} />
              AI Advice
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
              "{path.careerAdvice}"
            </p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-xs text-slate-400 mb-1">Current Milestone</p>
              <p className="font-bold text-sm">Fundamentals of {user.targetRole}</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-3">
                <div className="bg-indigo-500 h-full w-1/3 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="font-bold mb-4">Next Goal</h3>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 text-emerald-700 rounded-xl mb-4">
              <div className="p-2 bg-white rounded-lg"><CheckCircle2 size={16} /></div>
              <span className="text-sm font-semibold">Mock Interview Ready</span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Complete the first 3 modules to unlock your first mock interview simulation.
            </p>
            <button 
              disabled
              className="w-full py-3 rounded-xl border border-slate-200 text-slate-400 text-sm font-bold cursor-not-allowed"
            >
              Locked (Complete Module 1)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathView;
