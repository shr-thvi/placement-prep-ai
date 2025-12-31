
import React, { useState, useEffect, useRef } from 'react';
import { UserState, View, InterviewMessage, InterviewFeedback } from '../types';
import { startInterviewChat, getInterviewFeedback } from '../services/geminiService';
import { Send, Mic, MicOff, Loader2, Award, ChevronRight, MessageSquare } from 'lucide-react';

interface MockInterviewProps {
  user: UserState;
  onNavigate: (view: View) => void;
}

const MockInterview: React.FC<MockInterviewProps> = ({ user, onNavigate }) => {
  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = async () => {
      const c = startInterviewChat(user.targetRole);
      setChat(c);
      const initialResponse = await c.sendMessage({ message: 'Hello! I am ready for the interview.' });
      setMessages([{ role: 'model', text: initialResponse.text }]);
    };
    initChat();
  }, [user.targetRole]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || interviewComplete) return;

    const userMessage: InterviewMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await chat.sendMessage({ message: input });
      const modelText = response.text;
      setMessages(prev => [...prev, { role: 'model', text: modelText }]);

      if (modelText.toLowerCase().includes('interview is over') || messages.length >= 10) {
        setInterviewComplete(true);
        const fb = await getInterviewFeedback(messages.concat({ role: 'model', text: modelText }));
        setFeedback(fb);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setInput('I believe my greatest strength is my ability to quickly learn new technologies and apply them to solve business problems.');
        setIsRecording(false);
      }, 2000);
    }
  };

  if (feedback) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8 animate-in zoom-in duration-500 pb-10">
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg">
            <Award size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Performance Report</h2>
          <p className="text-slate-500 text-sm mb-6 md:mb-8">{user.targetRole}</p>

          <div className="text-5xl md:text-6xl font-black text-indigo-600 mb-8 md:mb-10">
            {feedback.score}<span className="text-xl md:text-2xl text-slate-300">/100</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left mb-8 md:mb-10">
            <div className="bg-emerald-50 p-5 md:p-6 rounded-2xl">
              <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2 text-sm md:text-base">
                <Award size={16} /> Key Strengths
              </h4>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-xs md:text-sm text-emerald-700 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-5 md:p-6 rounded-2xl">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2 text-sm md:text-base">
                <ChevronRight size={16} /> Areas to Grow
              </h4>
              <ul className="space-y-2">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs md:text-sm text-amber-700 flex items-start gap-2 leading-relaxed">
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0"></span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full md:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-100px)] max-w-4xl mx-auto flex flex-col">
      <header className="flex justify-between items-center mb-4 md:mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={20} />
            Mock Interview
          </h1>
          <p className="text-[10px] md:text-sm text-slate-500">Technical & Soft Skills Check</p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-slate-200"></div>
            ))}
          </div>
          <span className="text-[10px] md:text-xs font-semibold text-slate-400">AI Panel</span>
        </div>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div ref={scrollRef} className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto bg-slate-50/30">
          {!chat && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic text-xs">
              <Loader2 className="animate-spin mb-2" size={24} />
              Initializing AI Session...
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1 shadow-sm">
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 md:p-4 bg-white border-t border-slate-100 flex items-center gap-2 md:gap-3">
          <button 
            onClick={toggleRecording}
            className={`p-3 md:p-4 rounded-xl transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 text-slate-600 border border-slate-100'
            }`}
          >
            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={interviewComplete || loading}
            placeholder={interviewComplete ? "Done." : "Your answer..."}
            className="flex-1 px-4 py-3 md:py-4 rounded-xl bg-slate-100 border-none outline-none focus:ring-2 focus:ring-indigo-500 text-xs md:text-sm disabled:opacity-50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={interviewComplete || loading || !input.trim()}
            className="p-3 md:p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-md"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
