import { useState } from 'react';
import { Camera, Upload, X, CheckCircle, MapPin } from 'lucide-react';
import { addActivity } from '../utils/pointsService';
import { calculateActivityCarbon } from '../utils/carbonCalculator';
import { updateChallengeProgress, checkBadgeEligibility } from '../utils/challenges';
import type { LoggedActivity } from '../types';

const ACTIVITY_TYPES = [
  { id: 'transport', label: 'Transportation', icon: '🚗', activities: ['bike-commute', 'public-transit', 'car-pool', 'work-from-home'] },
  { id: 'energy', label: 'Energy', icon: '⚡', activities: ['solar-panel', 'led-bulb'] },
  { id: 'waste', label: 'Waste Reduction', icon: '♻️', activities: ['recycle', 'compost', 'reusable-bag', 'water-bottle'] },
  { id: 'food', label: 'Food', icon: '🥗', activities: ['reduce-meat', 'local-food'] },
  { id: 'planting', label: 'Planting', icon: '🌳', activities: ['plant-tree'] },
  { id: 'cleanup', label: 'Cleanup', icon: '🧹', activities: ['beach-cleanup', 'park-cleanup'] },
  { id: 'other', label: 'Other', icon: '✨', activities: ['other'] },
];

const ACTIVITY_DETAILS: Record<string, { title: string; description: string; points: number; co2PerUnit: number; unit: string }> = {
  'bike-commute': { title: 'Bike Commute', description: 'Used bike instead of car', points: 20, co2PerUnit: 0.411, unit: 'miles' },
  'public-transit': { title: 'Public Transit', description: 'Used public transportation', points: 15, co2PerUnit: 0.234, unit: 'miles' },
  'car-pool': { title: 'Car Pool', description: 'Shared a ride', points: 10, co2PerUnit: 0.2, unit: 'miles' },
  'work-from-home': { title: 'Work from Home', description: 'Avoided commute', points: 25, co2PerUnit: 0.411, unit: 'miles' },
  'solar-panel': { title: 'Solar Energy', description: 'Used solar power', points: 30, co2PerUnit: 0.429, unit: 'kWh' },
  'led-bulb': { title: 'LED Bulb', description: 'Replaced with LED', points: 5, co2PerUnit: 0.05, unit: 'bulbs' },
  'recycle': { title: 'Recycled', description: 'Recycled materials', points: 10, co2PerUnit: 0.5, unit: 'lbs' },
  'compost': { title: 'Composted', description: 'Composted organic waste', points: 8, co2PerUnit: 0.3, unit: 'lbs' },
  'reusable-bag': { title: 'Reusable Bag', description: 'Used reusable bag', points: 2, co2PerUnit: 0.01, unit: 'bags' },
  'water-bottle': { title: 'Reusable Bottle', description: 'Used reusable water bottle', points: 3, co2PerUnit: 0.15, unit: 'bottles' },
  'reduce-meat': { title: 'Meat-Free Meal', description: 'Ate vegetarian/vegan', points: 15, co2PerUnit: 2.6, unit: 'meals' },
  'local-food': { title: 'Local Food', description: 'Ate locally sourced food', points: 5, co2PerUnit: 0.1, unit: 'meals' },
  'plant-tree': { title: 'Planted Tree', description: 'Planted a tree', points: 50, co2PerUnit: 22, unit: 'trees' },
  'beach-cleanup': { title: 'Beach Cleanup', description: 'Cleaned up beach', points: 40, co2PerUnit: 5, unit: 'hours' },
  'park-cleanup': { title: 'Park Cleanup', description: 'Cleaned up park', points: 35, co2PerUnit: 4, unit: 'hours' },
  'other': { title: 'Other Activity', description: 'Other environmental activity', points: 10, co2PerUnit: 1, unit: 'activities' },
};

export default function ActivityLogger() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Location denied
        }
      );
    }
  };

  const handleSubmit = () => {
    if (!selectedActivity) return;

    const activityDetails = ACTIVITY_DETAILS[selectedActivity];
    const co2Saved = activityDetails.co2PerUnit * amount;
    const points = activityDetails.points * amount;

    const loggedActivity: LoggedActivity = {
      id: `activity_${Date.now()}`,
      type: selectedType as any,
      title: activityDetails.title,
      description: description || activityDetails.description,
      photo: photo || undefined,
      co2Saved,
      points,
      date: new Date(),
      verified: !!photo, // Verified if photo provided
      location: location || undefined,
    };

    // Add to activities
    addActivity({
      title: `${activityDetails.title} (${amount} ${activityDetails.unit})`,
      description: loggedActivity.description,
      points,
    });

    // Update challenges
    updateChallengeProgress('challenge_0', selectedActivity === 'bike-commute' ? 1 : 0);
    updateChallengeProgress('challenge_1', selectedActivity.includes('waste') ? 1 : 0);
    updateChallengeProgress('challenge_2', selectedActivity === 'plant-tree' ? amount : 0);
    updateChallengeProgress('challenge_3', selectedActivity === 'reduce-meat' ? 1 : 0);

    checkBadgeEligibility();

    setSubmitted(true);
    setTimeout(() => {
      // Reset form
      setSelectedType(null);
      setSelectedActivity(null);
      setAmount(1);
      setDescription('');
      setPhoto(null);
      setLocation(null);
      setSubmitted(false);
    }, 3000);
  };

  const selectedTypeData = ACTIVITY_TYPES.find((t) => t.id === selectedType);
  const activityDetails = selectedActivity ? ACTIVITY_DETAILS[selectedActivity] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 lg:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Log Your Activity</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your environmental actions and earn points
          </p>
        </div>

        {submitted ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Activity Logged!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              You earned {activityDetails ? activityDetails.points * amount : 0} points!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            {/* Activity Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                Select Activity Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ACTIVITY_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setSelectedActivity(null);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedType === type.id
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="text-xs font-medium text-gray-900 dark:text-white">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Activity Selection */}
            {selectedTypeData && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Select Specific Activity
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedTypeData.activities.map((activityId) => {
                    const details = ACTIVITY_DETAILS[activityId];
                    return (
                      <button
                        key={activityId}
                        onClick={() => setSelectedActivity(activityId)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedActivity === activityId
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white">{details.title}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{details.description}</div>
                        <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                          {details.points} pts per {details.unit}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Amount Input */}
            {activityDetails && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Amount ({activityDetails.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details about your activity..."
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                    rows={3}
                  />
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Photo (Optional - for verification)
                  </label>
                  {photo ? (
                    <div className="relative">
                      <img src={photo} alt="Activity" className="w-full h-48 object-cover rounded-lg" />
                      <button
                        onClick={() => setPhoto(null)}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-green-500 dark:hover:border-green-600 transition-colors">
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">Upload Photo</span>
                      </div>
                    </label>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Location (Optional)
                  </label>
                  {location ? (
                    <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        Location captured: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </span>
                      <button
                        onClick={() => setLocation(null)}
                        className="ml-auto text-red-600 dark:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleLocationRequest}
                      className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-600 transition-colors"
                    >
                      <MapPin className="w-5 h-5" />
                      <span className="text-sm text-gray-900 dark:text-white">Add Location</span>
                    </button>
                  )}
                </div>

                {/* Summary */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Activity Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Points:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {activityDetails.points * amount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CO₂ Saved:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {(activityDetails.co2PerUnit * amount).toFixed(2)} kg
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 transition-all"
                >
                  Log Activity
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

