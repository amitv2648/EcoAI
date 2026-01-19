import { useState } from 'react';
import { 
  LayoutDashboard, Activity, Target, Leaf, MessageCircle, ClipboardList, 
  MapPin, Trophy, Heart, Sun, Moon, ChevronLeft, ChevronRight
} from 'lucide-react';
import type { Page } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
}

export default function Sidebar({ currentPage, onNavigate, isCollapsed, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activity' as Page, label: 'Log Activity', icon: Activity },
    { id: 'challenges' as Page, label: 'Challenges', icon: Target },
    { id: 'learn' as Page, label: 'Learn', icon: Leaf },
    { id: 'greenbot' as Page, label: 'GreenBot', icon: MessageCircle },
    { id: 'planner' as Page, label: 'Planner', icon: ClipboardList },
    { id: 'opportunities' as Page, label: 'Opportunities', icon: MapPin },
    { id: 'leaderboard' as Page, label: 'Leaderboard', icon: Trophy },
    { id: 'donate' as Page, label: 'Donate', icon: Heart },
  ];

  const handleNavigate = (page: Page) => {
    onNavigate(page);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-xl z-40
          transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo/Brand */}
          <div className={`p-6 border-b border-gray-200 dark:border-gray-700 transition-all ${isCollapsed ? 'px-3' : ''}`}>
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-2'}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">EcoAI</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Save the Planet</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handleNavigate(id)}
                className={`
                  w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    currentPage === id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title={isCollapsed ? label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="font-medium">{label}</span>}
              </button>
            ))}
          </nav>

          {/* Footer with Theme Toggle */}
          <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'px-3' : ''}`}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
              aria-label="Toggle dark mode"
              title={isCollapsed ? (theme === 'dark' ? 'Light Mode' : 'Dark Mode') : undefined}
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Light Mode</span>}
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">Dark Mode</span>}
                </>
              )}
            </button>
          </div>

          {/* Toggle Button - Positioned at half height */}
          <button
            onClick={() => onToggleCollapse(!isCollapsed)}
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 z-50 w-8 h-8 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
}

