import type { Activity, UserPoints } from '../types';

const STORAGE_KEY = 'ecoai_user_points';
const ACTIVITIES_KEY = 'ecoai_user_activities';
const USERNAME_KEY = 'ecoai_username';

export function getUserId(): string {
  let userId = localStorage.getItem('ecoai_user_id');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ecoai_user_id', userId);
  }
  return userId;
}

export function getUsername(): string {
  return localStorage.getItem(USERNAME_KEY) || 'Anonymous User';
}

export function setUsername(username: string): void {
  localStorage.setItem(USERNAME_KEY, username);
}

export function addActivity(activity: Omit<Activity, 'id' | 'date'>): void {
  const activities = getActivities();
  const newActivity: Activity = {
    ...activity,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
  };
  activities.push(newActivity);
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  
  // Update points
  const currentPoints = getPoints();
  addPoints(activity.points);
}

export function getActivities(): Activity[] {
  const stored = localStorage.getItem(ACTIVITIES_KEY);
  if (!stored) return [];
  try {
    const activities = JSON.parse(stored);
    return activities.map((a: any) => ({
      ...a,
      date: new Date(a.date),
    }));
  } catch {
    return [];
  }
}

export function getPoints(): number {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function addPoints(points: number): void {
  const current = getPoints();
  localStorage.setItem(STORAGE_KEY, (current + points).toString());
}

export function resetPoints(): void {
  localStorage.setItem(STORAGE_KEY, '0');
  localStorage.setItem(ACTIVITIES_KEY, '[]');
}

export function getUserData(): UserPoints {
  return {
    userId: getUserId(),
    username: getUsername(),
    points: getPoints(),
    activities: getActivities().length,
  };
}

// Mock leaderboard data for demonstration
export function getLeaderboard(): UserPoints[] {
  const currentUser = getUserData();
  const mockUsers: UserPoints[] = [
    { userId: 'user1', username: 'EcoWarrior2024', points: 1250, activities: 45 },
    { userId: 'user2', username: 'GreenThumb', points: 980, activities: 32 },
    { userId: 'user3', username: 'PlanetSaver', points: 875, activities: 28 },
    { userId: 'user4', username: 'NatureLover', points: 720, activities: 24 },
    { userId: 'user5', username: 'ClimateHero', points: 650, activities: 20 },
    currentUser,
  ];
  
  return mockUsers.sort((a, b) => b.points - a.points);
}

