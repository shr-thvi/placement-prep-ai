
import React, { useState, useEffect } from 'react';
import { View, UserState, LearningPath } from './types';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import SkillTest from './components/SkillTest';
import Dashboard from './components/Dashboard';
import LearningPathView from './components/LearningPathView';
import MockInterview from './components/MockInterview';
import MentorMatching from './components/MentorMatching';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [user, setUser] = useState<UserState>({
    name: '',
    targetRole: '',
  });

  const handleStart = (name: string, role: string) => {
    setUser({ ...user, name, targetRole: role });
    setCurrentView(View.QUIZ);
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setUser({ ...user, quizResults: { score, answers } });
    setCurrentView(View.DASHBOARD);
  };

  const handleSetLearningPath = (path: LearningPath) => {
    setUser(prev => ({ ...prev, learningPath: path }));
  };

  const renderView = () => {
    switch (currentView) {
      case View.LANDING:
        return <LandingPage onStart={handleStart} />;
      case View.QUIZ:
        return <SkillTest role={user.targetRole} onComplete={handleQuizComplete} />;
      case View.DASHBOARD:
        return <Dashboard user={user} onSetLearningPath={handleSetLearningPath} onNavigate={setCurrentView} />;
      case View.LEARNING_PATH:
        return <LearningPathView user={user} onNavigate={setCurrentView} />;
      case View.INTERVIEW:
        return <MockInterview user={user} onNavigate={setCurrentView} />;
      case View.MENTOR_MATCH:
        return <MentorMatching user={user} onNavigate={setCurrentView} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  const showNav = currentView !== View.LANDING && currentView !== View.QUIZ;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {showNav && (
        <Sidebar currentView={currentView} onNavigate={setCurrentView} userName={user.name} />
      )}
      <main className={`flex-1 overflow-x-hidden ${showNav ? 'px-4 pt-4 pb-24 md:p-8' : ''}`}>
        <div className="max-w-6xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
