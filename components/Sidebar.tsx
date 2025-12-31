
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, GraduationCap, Mic2, Users, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, userName }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'Overview', icon: LayoutDashboard },
    { id: View.LEARNING_PATH, label: 'Learning Path', icon: GraduationCap },
    { id: View.INTERVIEW, label: 'Mock Interview', icon: Mic2 },
    { id: View.MENTOR_MATCH, label: 'Mentor Match', icon: Users },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">L</div>
          Launchpad
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                currentView === item.id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
            {userName.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{userName}</p>
            <p className="text-xs text-slate-400">Student Account</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
