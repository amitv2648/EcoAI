import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, Award, Filter, Search, Navigation, AlertCircle } from 'lucide-react';
import type { Opportunity } from '../types';
import { addActivity } from '../utils/pointsService';
import MapComponent from '../components/MapComponent';

// Generate opportunities near a given location
function generateOpportunitiesNearLocation(
  centerLat: number,
  centerLng: number,
  count: number = 6
): Opportunity[] {
  const opportunities: Opportunity[] = [];
  const types: Opportunity['type'][] = ['cleanup', 'planting', 'education', 'volunteer', 'event'];
  const titles = [
    'Beach Cleanup Day',
    'Tree Planting Initiative',
    'Climate Action Workshop',
    'Wildlife Habitat Restoration',
    'Recycling Drive Event',
    'Solar Panel Installation Training',
    'Community Garden Project',
    'River Cleanup Event',
    'Environmental Education Session',
    'Green Energy Workshop',
  ];
  const descriptions = [
    'Join us for a community cleanup to remove plastic waste and debris. All materials provided.',
    'Help plant native trees to restore the ecosystem and combat climate change.',
    'Learn about sustainable living practices and how to reduce your carbon footprint.',
    'Volunteer to restore local wildlife habitats by removing invasive species.',
    'Community event to collect and properly recycle electronic waste.',
    'Learn how to install solar panels and help bring renewable energy to communities.',
    'Help establish and maintain a community garden for sustainable food production.',
    'Participate in cleaning up local waterways and protecting aquatic ecosystems.',
    'Educational session about environmental conservation and sustainability.',
    'Workshop on renewable energy solutions and green technology.',
  ];

  // Generate random offsets within ~20km radius
  for (let i = 0; i < count; i++) {
    // Random offset in degrees (roughly 0.1-0.2 degrees ≈ 10-20km)
    const offsetLat = (Math.random() - 0.5) * 0.2;
    const offsetLng = (Math.random() - 0.5) * 0.2;
    
    const lat = centerLat + offsetLat;
    const lng = centerLng + offsetLng;
    
    // Format address (in a real app, you'd use reverse geocoding API)
    const address = `Local Area (${lat.toFixed(4)}, ${lng.toFixed(4)})`;

    opportunities.push({
      id: `opp-${i + 1}`,
      title: titles[i % titles.length],
      description: descriptions[i % descriptions.length],
      location: {
        lat,
        lng,
        address,
      },
      type: types[i % types.length],
      date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      points: [30, 40, 50, 60, 75, 80][i % 6],
      contact: `contact${i + 1}@eco.org`,
    });
  }

  return opportunities;
}

// Default opportunities (used as fallback)
const defaultOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Beach Cleanup Day',
    description: 'Join us for a community beach cleanup to remove plastic waste and debris. All materials provided.',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: 'Ocean Beach, San Francisco, CA',
    },
    type: 'cleanup',
    date: '2024-02-15',
    points: 50,
    contact: 'beachcleanup@eco.org',
  },
  {
    id: '2',
    title: 'Tree Planting Initiative',
    description: 'Help plant native trees in the local park to restore the ecosystem and combat climate change.',
    location: {
      lat: 37.7849,
      lng: -122.4094,
      address: 'Golden Gate Park, San Francisco, CA',
    },
    type: 'planting',
    date: '2024-02-20',
    points: 75,
    contact: 'trees@green.org',
  },
  {
    id: '3',
    title: 'Climate Action Workshop',
    description: 'Learn about sustainable living practices and how to reduce your carbon footprint.',
    location: {
      lat: 37.7649,
      lng: -122.4294,
      address: 'Community Center, San Francisco, CA',
    },
    type: 'education',
    date: '2024-02-18',
    points: 30,
    contact: 'workshop@climate.org',
  },
  {
    id: '4',
    title: 'Wildlife Habitat Restoration',
    description: 'Volunteer to restore local wildlife habitats by removing invasive species and planting natives.',
    location: {
      lat: 37.7949,
      lng: -122.3994,
      address: 'Presidio Park, San Francisco, CA',
    },
    type: 'volunteer',
    date: '2024-02-22',
    points: 60,
    contact: 'wildlife@nature.org',
  },
  {
    id: '5',
    title: 'Recycling Drive Event',
    description: 'Community event to collect and properly recycle electronic waste and other materials.',
    location: {
      lat: 37.7549,
      lng: -122.4394,
      address: 'City Hall Plaza, San Francisco, CA',
    },
    type: 'event',
    date: '2024-02-25',
    points: 40,
    contact: 'recycle@city.gov',
  },
  {
    id: '6',
    title: 'Solar Panel Installation Training',
    description: 'Learn how to install solar panels and help bring renewable energy to underserved communities.',
    location: {
      lat: 37.8049,
      lng: -122.3894,
      address: 'Tech Hub, San Francisco, CA',
    },
    type: 'education',
    date: '2024-03-01',
    points: 80,
    contact: 'solar@renewable.org',
  },
];

const typeColors: Record<Opportunity['type'], string> = {
  volunteer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  event: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  cleanup: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  planting: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  education: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export default function Opportunities() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<Opportunity['type'] | 'all'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(defaultOpportunities);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Update opportunities when user location is available
  useEffect(() => {
    if (userLocation && locationPermission === 'granted') {
      // Generate opportunities near user location
      const nearbyOpportunities = generateOpportunitiesNearLocation(
        userLocation.lat,
        userLocation.lng,
        8
      );
      setOpportunities(nearbyOpportunities);
    } else {
      // Use default opportunities if no location
      setOpportunities(defaultOpportunities);
    }
  }, [userLocation, locationPermission]);

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationPermission('denied');
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(location);
        setLocationPermission('granted');
        setLocationError(null);
        setIsLoadingLocation(false);
        console.log('User location detected:', location);
      },
      (error) => {
        setLocationPermission('denied');
        setLocationError('Location access denied. Showing default opportunities.');
        setUserLocation(null);
        setIsLoadingLocation(false);
        console.error('Geolocation error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  type OpportunityWithDistance = Opportunity & { distance: number | null };

  const filteredOpportunities: OpportunityWithDistance[] = opportunities
    .map((opp) => ({
      ...opp,
      distance: userLocation
        ? calculateDistance(
            userLocation.lat,
            userLocation.lng,
            opp.location.lat,
            opp.location.lng
          )
        : null,
    }))
    .filter((opp) => {
      const matchesSearch = opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || opp.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by distance if available, otherwise keep original order
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      return 0;
    });

  const handleJoinOpportunity = (opportunity: Opportunity) => {
    addActivity({
      title: `Joined: ${opportunity.title}`,
      description: opportunity.description,
      points: opportunity.points,
    });
    alert(`You've joined "${opportunity.title}"! You earned ${opportunity.points} points!`);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <MapPin className="w-12 h-12 text-green-600 dark:text-green-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Environmental Opportunities
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Find local opportunities to make a positive environmental impact
          </p>
        </div>

        {/* Location Permission Banner */}
        {locationPermission === 'prompt' && !isLoadingLocation && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                Allow location access to see opportunities closest to you and get personalized recommendations.
              </p>
              <button
                onClick={requestLocationPermission}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors text-sm font-medium flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Enable Location</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Location Banner */}
        {isLoadingLocation && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 dark:border-green-400"></div>
            <p className="text-sm text-green-800 dark:text-green-200">
              Detecting your location and finding nearby opportunities...
            </p>
          </div>
        )}

        {/* Success Banner */}
        {locationPermission === 'granted' && userLocation && (
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center space-x-3">
            <Navigation className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                Location detected! Showing opportunities within 20km of your location.
              </p>
            </div>
          </div>
        )}

        {locationError && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">{locationError}</p>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Map View
              </h2>
              {userLocation && (
                <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                  <Navigation className="w-4 h-4" />
                  <span>Location Active</span>
                </div>
              )}
            </div>
            <div className="h-[600px] w-full">
              <MapComponent
                opportunities={filteredOpportunities}
                selectedOpportunity={selectedOpportunity}
                userLocation={userLocation}
                onOpportunityClick={setSelectedOpportunity}
              />
            </div>
          </div>

          {/* Opportunities List */}
          <div className="space-y-4">
            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as Opportunity['type'] | 'all')}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Types</option>
                    <option value="volunteer">Volunteer</option>
                    <option value="event">Event</option>
                    <option value="cleanup">Cleanup</option>
                    <option value="planting">Planting</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {filteredOpportunities.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">
                    No opportunities found matching your criteria.
                  </p>
                </div>
              ) : (
                filteredOpportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border-2 transition-all cursor-pointer ${
                      selectedOpportunity?.id === opportunity.id
                        ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-800'
                        : 'border-transparent hover:border-green-300 dark:hover:border-green-700'
                    }`}
                    onClick={() => setSelectedOpportunity(opportunity)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {opportunity.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${typeColors[opportunity.type]}`}
                          >
                            {opportunity.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                          {opportunity.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span>{opportunity.location.address}</span>
                      </div>
                      {opportunity.distance !== null && (
                        <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                          <Navigation className="w-4 h-4" />
                          <span>{opportunity.distance.toFixed(1)} km away</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(opportunity.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Award className="w-4 h-4" />
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {opportunity.points} points
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinOpportunity(opportunity);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Join Opportunity</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

