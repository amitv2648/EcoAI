import { useState, useEffect } from 'react';
import { Trophy, Award, Star, TrendingUp, User, Activity } from 'lucide-react';
import { getLeaderboard, getUserData, setUsername } from '../utils/pointsService';
import type { UserPoints } from '../types';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<UserPoints[]>([]);
  const [currentUser, setCurrentUser] = useState<UserPoints | null>(null);
  const [username, setUsernameInput] = useState('');
  const [showUsernameInput, setShowUsernameInput] = useState(false);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = () => {
    const data = getLeaderboard();
    setLeaderboard(data);
    const user = getUserData();
    setCurrentUser(user);
    setUsernameInput(user.username);
  };

  const handleSetUsername = () => {
    if (username.trim()) {
      setUsername(username.trim());
      loadLeaderboard();
      setShowUsernameInput(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Award className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-700';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 border-gray-300 dark:border-gray-600';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-300 dark:border-amber-700';
      default:
        return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Compete with others to make the biggest environmental impact!
          </p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border-2 border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <User className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  {showUsernameInput ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSetUsername()}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                        placeholder="Enter username"
                        autoFocus
                      />
                      <button
                        onClick={handleSetUsername}
                        className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {currentUser.username}
                      </h3>
                      <button
                        onClick={() => setShowUsernameInput(true)}
                        className="text-sm text-green-600 dark:text-green-400 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {currentUser.points} pts
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {currentUser.activities} activities
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Rank</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  #{leaderboard.findIndex((u) => u.userId === currentUser.userId) + 1}
                </div>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Star className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Points</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentUser.points}
                </div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Activities</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentUser.activities}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Top Contributors</h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboard.map((user, index) => {
              const rank = index + 1;
              const isCurrentUser = user.userId === currentUser?.userId;
              return (
                <div
                  key={user.userId}
                  className={`p-6 flex items-center justify-between transition-all ${
                    getRankColor(rank)
                  } ${isCurrentUser ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12">
                      {getRankIcon(rank)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          #{rank}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {user.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                              (You)
                            </span>
                          )}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {user.activities} activities
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {user.points}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            How to Earn Points
          </h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-200">
            <li>• Log environmental activities in the Action Planner</li>
            <li>• Participate in opportunities from the Opportunities page</li>
            <li>• Complete action plans and track your impact</li>
            <li>• Each activity earns you points based on its impact</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

