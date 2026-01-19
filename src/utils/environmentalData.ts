// Real-world environmental data integration
// Using OpenWeatherMap API for weather and AirVisual API for air quality
// Note: In production, you'd use real API keys

export interface AirQualityData {
  aqi: number;
  level: 'good' | 'moderate' | 'unhealthy' | 'very-unhealthy' | 'hazardous';
  pm25: number;
  pm10: number;
  o3?: number;
  no2?: number;
  co?: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  uvIndex?: number;
}

export function getAQILevel(aqi: number): AirQualityData['level'] {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthy';
  if (aqi <= 200) return 'very-unhealthy';
  return 'hazardous';
}

export function getAQIColor(level: AirQualityData['level']): string {
  const colors = {
    good: '#00e400',
    moderate: '#ffff00',
    unhealthy: '#ff7e00',
    'very-unhealthy': '#ff0000',
    hazardous: '#8f3f97',
  };
  return colors[level];
}

export function getAQIDescription(level: AirQualityData['level']): string {
  const descriptions = {
    good: 'Air quality is satisfactory, and air pollution poses little or no risk.',
    moderate: 'Air quality is acceptable. However, there may be a risk for some people.',
    unhealthy: 'Members of sensitive groups may experience health effects.',
    'very-unhealthy': 'Health alert: everyone may experience health effects.',
    hazardous: 'Health warning of emergency conditions.',
  };
  return descriptions[level];
}

// Mock environmental data (in production, fetch from real APIs)
export async function getEnvironmentalData(
  lat: number,
  lng: number
): Promise<{ airQuality: AirQualityData; weather: WeatherData }> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Generate realistic mock data based on location
  const baseAQI = 30 + Math.random() * 70; // 30-100 range
  const aqi = Math.round(baseAQI);
  const level = getAQILevel(aqi);

  return {
    airQuality: {
      aqi,
      level,
      pm25: Math.round(5 + (aqi / 100) * 15),
      pm10: Math.round(10 + (aqi / 100) * 30),
      o3: Math.round(30 + Math.random() * 40),
      no2: Math.round(10 + Math.random() * 30),
      co: Math.round(200 + Math.random() * 300),
    },
    weather: {
      temperature: Math.round(15 + Math.random() * 20), // 15-35°C
      condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
      humidity: Math.round(40 + Math.random() * 40), // 40-80%
      windSpeed: Math.round(5 + Math.random() * 15), // 5-20 km/h
      uvIndex: Math.round(3 + Math.random() * 7), // 3-10
    },
  };
}

// Get environmental tips based on current conditions
export function getEnvironmentalTips(
  airQuality: AirQualityData,
  weather: WeatherData
): string[] {
  const tips: string[] = [];

  if (airQuality.level === 'unhealthy' || airQuality.level === 'very-unhealthy') {
    tips.push('Air quality is poor. Consider staying indoors or wearing a mask if going outside.');
    tips.push('Avoid outdoor exercise until air quality improves.');
  }

  if (weather.temperature > 25) {
    tips.push('Hot weather detected. Use fans instead of AC when possible to save energy.');
    tips.push('Consider walking or biking for short trips in this nice weather!');
  }

  if (weather.condition === 'Rainy') {
    tips.push('Rainy day! Perfect for collecting rainwater for your plants.');
    tips.push('Use public transit or carpool to avoid driving in wet conditions.');
  }

  if (airQuality.level === 'good' && weather.temperature > 15 && weather.temperature < 25) {
    tips.push('Perfect weather! Great day for outdoor activities like planting trees or cleanup.');
  }

  if (weather.uvIndex && weather.uvIndex > 7) {
    tips.push('High UV index. Use natural shade instead of energy-consuming AC when possible.');
  }

  return tips;
}

