import { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Leaf, Zap, Car, Utensils, Trash2, Award, Target, Activity } from 'lucide-react';
import { getActivities, getUserData } from '../utils/pointsService';
import { getChallenges, getBadges, checkBadgeEligibility } from '../utils/challenges';
import { calculateActivityCarbon } from '../utils/carbonCalculator';
import { getEnvironmentalData, getAQIColor, getAQIDescription } from '../utils/environmentalData';
import type { CarbonFootprint, EnvironmentalData } from '../types';

export default function Dashboard() {
  const [userData, setUserData] = useState(() => {
    try {
      return getUserData();
    } catch {
      return { userId: '', username: 'User', points: 0, activities: 0 };
    }
  });
  const [activities, setActivities] = useState(() => {
    try {
      return getActivities();
    } catch {
      return [];
    }
  });
  const [challenges, setChallenges] = useState(() => {
    try {
      return getChallenges();
    } catch {
      return [];
    }
  });
  const [badges, setBadges] = useState(() => {
    try {
      return getBadges();
    } catch {
      return [];
    }
  });
  const [carbonFootprint, setCarbonFootprint] = useState<CarbonFootprint | null>(null);
  const [envData, setEnvData] = useState<EnvironmentalData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const calculateCarbonFootprint = () => {
    const currentActivities = getActivities();
    let transport = 0;
    let energy = 0;
    let food = 0;
    let waste = 0;

    currentActivities.forEach((activity) => {
      const co2 = calculateActivityCarbon(activity.title.toLowerCase(), 1);
      if (activity.title.toLowerCase().includes('bike') || activity.title.toLowerCase().includes('transit')) {
        transport += co2;
      } else if (activity.title.toLowerCase().includes('energy') || activity.title.toLowerCase().includes('solar')) {
        energy += co2;
      } else if (activity.title.toLowerCase().includes('meat') || activity.title.toLowerCase().includes('food')) {
        food += co2;
      } else if (activity.title.toLowerCase().includes('recycle') || activity.title.toLowerCase().includes('waste')) {
        waste += co2;
      }
    });

    const total = transport + energy + food + waste;
    setCarbonFootprint({
      transportation: transport,
      energy,
      food,
      waste,
      total,
      date: new Date(),
    });
  };

  const loadEnvironmentalData = async (location: { lat: number; lng: number }) => {
    const data = await getEnvironmentalData(location.lat, location.lng);
    setEnvData({
      airQuality: data.airQuality,
      weather: data.weather,
      location: { city: 'Your Area', country: '' },
    });
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          loadEnvironmentalData(location);
        },
        () => {
          // Use default location
          const defaultLocation = { lat: 37.7749, lng: -122.4194 };
          setUserLocation(defaultLocation);
          loadEnvironmentalData(defaultLocation);
        }
      );
    } else {
      // Fallback if geolocation not available
      const defaultLocation = { lat: 37.7749, lng: -122.4194 };
      setUserLocation(defaultLocation);
      loadEnvironmentalData(defaultLocation);
    }
  };

  useEffect(() => {
    try {
      checkBadgeEligibility();
      setUserData(getUserData());
      setActivities(getActivities());
      setChallenges(getChallenges());
      setBadges(getBadges());
      
      // Calculate carbon footprint from activities
      calculateCarbonFootprint();
      
      // Request location and load environmental data
      requestLocation();
    } catch (error) {
      console.error('Error initializing dashboard:', error);
      // Set defaults on error
      setChallenges([]);
      setBadges([]);
    }
  }, []);

  const activeChallenges = challenges.filter((c) => {
    try {
      return !c.completed && new Date(c.endDate) > new Date();
    } catch {
      return false;
    }
  });
  const completedChallenges = challenges.filter((c) => c.completed);
  const recentBadges = badges.filter((b) => b.earnedDate).slice(-3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Environmental Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your impact and see how you're making a difference
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.points}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Points</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{userData.activities}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Activities Completed</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {carbonFootprint ? Math.round(carbonFootprint.total) : 0}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">kg CO₂ Saved</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{activeChallenges.length}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Challenges</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Carbon Footprint Breakdown */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Carbon Footprint Breakdown</h2>
            {carbonFootprint ? (
              <div className="space-y-4">
                <CarbonCategory
                  icon={Car}
                  label="Transportation"
                  value={carbonFootprint.transportation}
                  total={carbonFootprint.total}
                  color="blue"
                />
                <CarbonCategory
                  icon={Zap}
                  label="Energy"
                  value={carbonFootprint.energy}
                  total={carbonFootprint.total}
                  color="yellow"
                />
                <CarbonCategory
                  icon={Utensils}
                  label="Food"
                  value={carbonFootprint.food}
                  total={carbonFootprint.total}
                  color="orange"
                />
                <CarbonCategory
                  icon={Trash2}
                  label="Waste Reduction"
                  value={Math.abs(carbonFootprint.waste)}
                  total={carbonFootprint.total}
                  color="green"
                />
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Complete activities to see your carbon impact!</p>
            )}
          </div>

          {/* Environmental Conditions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Local Conditions</h2>
            {envData ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Air Quality</span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: getAQIColor(envData.airQuality.level) }}
                    >
                      {envData.airQuality.aqi} AQI
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {getAQIDescription(envData.airQuality.level)}
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Temperature</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {envData.weather.temperature}°C
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{envData.weather.condition}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">Loading environmental data...</p>
            )}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Active Challenges</h2>
          {activeChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border-2 border-green-200 dark:border-green-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{challenge.title}</h3>
                    <span className="text-sm text-green-600 dark:text-green-400 font-semibold">
                      {challenge.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{challenge.description}</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {challenge.current} / {challenge.target} {challenge.unit}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No active challenges. Check the Challenges page!</p>
          )}
        </div>

        {/* Recent Badges */}
        {recentBadges.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Badges</h2>
            <div className="flex space-x-4">
              {recentBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="text-center p-4 border-2 border-yellow-200 dark:border-yellow-700 rounded-lg"
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">{badge.name}</h3>
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

function CarbonCategory({
  icon: Icon,
  label,
  value,
  total,
  color,
}: {
  icon: any;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    orange: 'bg-orange-500',
    green: 'bg-green-500',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-900 dark:text-white">{Math.round(value)} kg</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`${colorClasses[color as keyof typeof colorClasses]} h-2 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

