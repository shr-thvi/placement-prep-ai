
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Loader2, ArrowRight, BrainCircuit } from 'lucide-react';

interface SkillTestProps {
  role: string;
  onComplete: (score: number, answers: number[]) => void;
}

const SkillTest: React.FC<SkillTestProps> = ({ role, onComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

  useEffect(() => {
    const loadQuiz = async () => {
      const q = await generateQuiz(role);
      setQuestions(q);
      setLoading(false);
    };
    loadQuiz();
  }, [role]);

  const handleSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentStep] = index;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      let score = 0;
      questions.forEach((q, i) => {
        if (q.correctAnswer === selectedAnswers[i]) score++;
      });
      onComplete(score, selectedAnswers);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-600 font-medium">Generating your personalized skill test...</p>
      </div>
    );
  }

  const q = questions[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <BrainCircuit size={20} />
              <span>Diagnostic Test</span>
            </div>
            <div className="text-sm text-slate-400">
              Question {currentStep + 1} of {questions.length}
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-xl font-bold mb-8 text-slate-800">
              {q.question}
            </h2>

            <div className="space-y-4 mb-8">
              {q.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 ${
                    selectedAnswers[currentStep] === idx
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                      : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      selectedAnswers[currentStep] === idx ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>

            <button
              disabled={selectedAnswers[currentStep] === undefined}
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {currentStep === questions.length - 1 ? 'Finish Quiz' : 'Continue'}
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="h-2 bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-500" 
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillTest;
