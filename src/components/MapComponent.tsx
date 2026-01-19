import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import type { Opportunity } from '../types';

// Fix for default marker icons in React/TypeScript
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
  opportunities: Opportunity[];
  selectedOpportunity: Opportunity | null;
  userLocation: { lat: number; lng: number } | null;
  onOpportunityClick: (opportunity: Opportunity) => void;
}

// Component to handle map view updates
function MapViewUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({
  opportunities,
  selectedOpportunity,
  userLocation,
  onOpportunityClick,
}: MapComponentProps) {
  // Initialize map center based on user location or first opportunity
  const getInitialCenter = (): [number, number] => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    if (opportunities.length > 0) {
      return [opportunities[0].location.lat, opportunities[0].location.lng];
    }
    return [37.7749, -122.4194]; // Default to San Francisco
  };

  const [mapCenter, setMapCenter] = useState<[number, number]>(getInitialCenter());
  const [mapZoom, setMapZoom] = useState(userLocation ? 12 : 13);

  useEffect(() => {
    if (userLocation) {
      // Always prioritize user location
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(12);
    } else if (selectedOpportunity) {
      setMapCenter([selectedOpportunity.location.lat, selectedOpportunity.location.lng]);
      setMapZoom(14);
    } else if (opportunities.length > 0) {
      // Center on first opportunity if no user location
      setMapCenter([opportunities[0].location.lat, opportunities[0].location.lng]);
      setMapZoom(13);
    }
  }, [userLocation, selectedOpportunity, opportunities]);

  // Create custom icons for different opportunity types
  const getMarkerIcon = (type: Opportunity['type']) => {
    const colors: Record<Opportunity['type'], string> = {
      volunteer: '#9333ea', // purple
      event: '#3b82f6', // blue
      cleanup: '#22c55e', // green
      planting: '#10b981', // emerald
      education: '#f97316', // orange
    };

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${colors[type]}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">
        <div style="transform: rotate(45deg); color: white; font-weight: bold; font-size: 12px; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">📍</div>
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
    });
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <MapContainer
        key={`map-${mapCenter[0]}-${mapCenter[1]}-${opportunities.length}`}
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapViewUpdater center={mapCenter} zoom={mapZoom} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>Your Location</Popup>
          </Marker>
        )}

        {/* Opportunity markers */}
        {opportunities.map((opportunity) => (
          <Marker
            key={opportunity.id}
            position={[opportunity.location.lat, opportunity.location.lng]}
            icon={getMarkerIcon(opportunity.type)}
            eventHandlers={{
              click: () => onOpportunityClick(opportunity),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{opportunity.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{opportunity.location.address}</p>
                <p className="text-xs font-semibold text-green-600">
                  {opportunity.points} points
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Statistics overlay */}
      <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-[1000] min-w-[200px]">
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm">Map Statistics</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Opportunities:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{opportunities.length}</span>
          </div>
          {userLocation && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Near You:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {opportunities.filter((opp) => {
                  const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    opp.location.lat,
                    opp.location.lng
                  );
                  return distance < 10; // Within 10 km
                }).length}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Total Points Available:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">
              {opportunities.reduce((sum, opp) => sum + opp.points, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
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
}

