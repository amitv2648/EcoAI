export type Page = 'learn' | 'greenbot' | 'planner' | 'donate' | 'leaderboard' | 'opportunities' | 'dashboard' | 'challenges' | 'activity';

export interface UserPoints {
  userId: string;
  username: string;
  points: number;
  activities: number;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  points: number;
  date: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  type: 'volunteer' | 'event' | 'cleanup' | 'planting' | 'education';
  date: string;
  points: number;
  contact?: string;
}

export interface FactCard {
  id: string;
  title: string;
  category: 'climate' | 'nature' | 'pollution';
  shortDesc: string;
  fullDesc: string;
  stat: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ActionPlanForm {
  userType: 'student' | 'adult';
  location: 'city' | 'suburban';
  transportation: 'walk' | 'bike' | 'car' | 'public';
  interest: 'animals' | 'climate' | 'plants' | 'oceans';
}

export interface CarbonFootprint {
  transportation: number; // kg CO2
  energy: number; // kg CO2
  food: number; // kg CO2
  waste: number; // kg CO2
  total: number; // kg CO2
  date: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  target: number;
  current: number;
  unit: string;
  points: number;
  badge?: string;
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface EnvironmentalData {
  airQuality: {
    aqi: number;
    level: 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
    pm25: number;
    pm10: number;
  };
  weather: {
    temperature: number;
    condition: string;
    humidity: number;
  };
  location: {
    city: string;
    country: string;
  };
}

export interface LoggedActivity {
  id: string;
  type: 'transport' | 'energy' | 'waste' | 'food' | 'planting' | 'cleanup' | 'other';
  title: string;
  description: string;
  photo?: string; // base64 or URL
  co2Saved: number; // kg CO2
  points: number;
  date: Date;
  verified: boolean;
  location?: {
    lat: number;
    lng: number;
  };
}
