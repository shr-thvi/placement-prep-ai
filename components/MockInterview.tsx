
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
  }, [messages]);

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

      // Simple heuristic for interview end
      if (modelText.toLowerCase().includes('interview is over') || messages.length >= 8) {
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
    // In a real app, integrate Web Speech API or Gemini Live
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
      <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-200">
            <Award size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Performance Report</h2>
          <p className="text-slate-500 mb-8">Mock Interview for {user.targetRole}</p>

          <div className="text-6xl font-black text-indigo-600 mb-10">
            {feedback.score}<span className="text-2xl text-slate-300">/100</span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
            <div className="bg-emerald-50 p-6 rounded-2xl">
              <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                <Award size={18} /> Key Strengths
              </h4>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-emerald-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl">
              <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <ChevronRight size={18} /> Areas to Grow
              </h4>
              <ul className="space-y-2">
                {feedback.weaknesses.map((w, i) => (
                  <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100 mb-8">
            <h4 className="font-bold text-slate-800 mb-2">AI Expert Advice</h4>
            <p className="text-slate-600 text-sm italic">"{feedback.advice}"</p>
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full max-w-4xl mx-auto flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="text-indigo-600" size={24} />
            Mock Interview
          </h1>
          <p className="text-sm text-slate-500">Practice your technical and soft skills.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
            ))}
          </div>
          <span className="text-xs font-semibold text-slate-400">Panel of 3 AI Interviewers</span>
        </div>
      </header>

      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div ref={scrollRef} className="flex-1 p-6 space-y-6 overflow-y-auto">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
              <Loader2 className="animate-spin mb-2" />
              Establishing connection...
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none border border-slate-200 flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
              </div>
            </div>
          )}
          {interviewComplete && !feedback && (
            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl text-center">
              <Loader2 className="animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-indigo-700 font-bold">Interview Complete! Generating your performance report...</p>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button 
            onClick={toggleRecording}
            className={`p-4 rounded-xl transition-all ${
              isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={interviewComplete || loading}
            placeholder={interviewComplete ? "Interview finished." : "Type your answer..."}
            className="flex-1 px-4 py-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={interviewComplete || loading || !input.trim()}
            className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-md shadow-indigo-100"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
