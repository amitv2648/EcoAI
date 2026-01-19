import { Leaf, MessageCircle, ClipboardList, Heart, Trophy, MapPin, Sun, Moon, LayoutDashboard, Target, Activity } from 'lucide-react';
import type { Page } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
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

  return (
    <nav className="bg-gradient-to-r from-green-600 to-emerald-700 dark:from-green-800 dark:to-emerald-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-green-100" />
            <span className="text-white font-bold text-xl">EcoAI</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-1 overflow-x-auto">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 whitespace-nowrap ${
                    currentPage === id
                      ? 'bg-white text-green-700 dark:bg-gray-800 dark:text-green-400 shadow-md'
                      : 'text-green-50 hover:bg-green-500/30 dark:hover:bg-green-700/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">{label}</span>
                </button>
              ))}
            </div>
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="ml-2 p-2 rounded-lg text-green-50 hover:bg-green-500/30 dark:hover:bg-green-700/30 transition-colors"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
