
import React, { useState, useEffect } from 'react';
import { UserState, View, Mentor } from '../types';
import { getMentorMatches } from '../services/geminiService';
import { Mail, Calendar, ExternalLink, ShieldCheck, Loader2, Sparkles } from 'lucide-react';

interface MentorMatchingProps {
  user: UserState;
  onNavigate: (view: View) => void;
}

const MentorMatching: React.FC<MentorMatchingProps> = ({ user, onNavigate }) => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMentors = async () => {
      const results = await getMentorMatches(user.targetRole);
      setMentors(results.map((m: any, i: number) => ({
        ...m,
        image: `https://picsum.photos/seed/${i + 123}/200/200`
      })));
      setLoading(false);
    };
    fetchMentors();
  }, [user.targetRole]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-600 font-medium text-center">Finding the best industry mentors for you...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Mentor Matchmaking</h1>
        <p className="text-slate-500">Connect with industry experts who have navigated the path to <span className="text-indigo-600 font-semibold">{user.targetRole}</span>.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
              <div className="absolute -bottom-10 left-6 p-1 bg-white rounded-full">
                <img src={mentor.image} alt={mentor.name} className="w-20 h-20 rounded-full object-cover" />
              </div>
            </div>
            <div className="pt-14 p-6">
              <div className="flex items-center gap-1 mb-1">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
                <ShieldCheck size={16} className="text-blue-500" />
              </div>
              <p className="text-sm text-slate-600 font-medium">{mentor.role}</p>
              <p className="text-xs text-slate-400 mb-4">{mentor.company}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {mentor.specialties.map((spec, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded">
                    {spec}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
                  <Calendar size={16} />
                  Meet
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors">
                  <Mail size={16} />
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
          <Sparkles size={32} />
        </div>
        <div>
          <h4 className="text-xl font-bold text-emerald-900 mb-2">Exclusive Opportunity</h4>
          <p className="text-emerald-700 leading-relaxed mb-4 md:mb-0">
            Based on your high diagnostic score and current progress, you are eligible for the <span className="font-bold">Fast-Track Mentorship Program</span> with senior leaders at Google and Amazon.
          </p>
        </div>
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors whitespace-nowrap">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default MentorMatching;
