import { useState, useEffect } from 'react';
import { Target, Trophy, Calendar, Award, CheckCircle, Clock } from 'lucide-react';
import { getChallenges, updateChallengeProgress } from '../utils/challenges';
import { getBadges } from '../utils/challenges';
import type { Challenge, Badge } from '../types';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'badges'>('active');

  useEffect(() => {
    setChallenges(getChallenges());
    setBadges(getBadges());
  }, []);

  const activeChallenges = challenges.filter((c) => !c.completed && new Date(c.endDate) > new Date());
  const completedChallenges = challenges.filter((c) => c.completed);
  const earnedBadges = badges.filter((b) => b.earnedDate);
  const availableBadges = badges.filter((b) => !b.earnedDate);

  const getRarityColor = (rarity: Badge['rarity']) => {
    const colors = {
      common: 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800',
      rare: 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20',
      epic: 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20',
      legendary: 'border-yellow-300 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    };
    return colors[rarity];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Target className="w-12 h-12 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Challenges & Badges</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Complete challenges to earn badges and make a real impact
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('active')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'active'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Active ({activeChallenges.length})
          </button>
          <button
            onClick={() => setSelectedTab('completed')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'completed'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Completed ({completedChallenges.length})
          </button>
          <button
            onClick={() => setSelectedTab('badges')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${
              selectedTab === 'badges'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Badges ({earnedBadges.length})
          </button>
        </div>

        {/* Active Challenges */}
        {selectedTab === 'active' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeChallenges.length > 0 ? (
              activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-green-200 dark:border-green-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {challenge.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {challenge.points}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">points</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {challenge.current} / {challenge.target} {challenge.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all"
                        style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Ends: {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days left
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Target className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Challenges</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Check back soon for new challenges!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Completed Challenges */}
        {selectedTab === 'completed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedChallenges.length > 0 ? (
              completedChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-green-500 dark:border-green-600"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {challenge.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{challenge.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {challenge.points}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">points earned</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Completed: {new Date(challenge.endDate).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Completed Challenges</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete challenges to see them here!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Badges */}
        {selectedTab === 'badges' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Earned Badges</h2>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 ${getRarityColor(badge.rarity)} text-center`}
                  >
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{badge.description}</p>
                    {badge.earnedDate && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        Earned: {badge.earnedDate.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center mb-8">
                <Award className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Badges Yet</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Complete challenges and activities to earn badges!
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Available Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {availableBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-gray-200 dark:border-gray-700 text-center opacity-60"
                >
                  <div className="text-5xl mb-3 grayscale">{badge.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

