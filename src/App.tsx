import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Learn from './pages/Learn';
import GreenBot from './pages/GreenBot';
import ActionPlanner from './pages/ActionPlanner';
import Donate from './pages/Donate';
import Leaderboard from './pages/Leaderboard';
import Opportunities from './pages/Opportunities';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import ActivityLogger from './pages/ActivityLogger';
import type { Page } from './types';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'activity':
        return <ActivityLogger />;
      case 'challenges':
        return <Challenges />;
      case 'learn':
        return <Learn />;
      case 'greenbot':
        return <GreenBot />;
      case 'planner':
        return <ActionPlanner />;
      case 'opportunities':
        return <Opportunities />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'donate':
        return <Donate />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex">
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={setSidebarCollapsed}
        />
        <main 
          className="flex-1 transition-all duration-300" 
          style={{ marginLeft: sidebarCollapsed ? '80px' : '256px' }}
        >
          {renderPage()}
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
