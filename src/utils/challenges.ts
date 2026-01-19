import type { Challenge, Badge } from '../types';

const CHALLENGES_STORAGE_KEY = 'ecoai_challenges';
const BADGES_STORAGE_KEY = 'ecoai_badges';

// Predefined challenges
export const DEFAULT_CHALLENGES: Omit<Challenge, 'id' | 'current' | 'completed'>[] = [
  {
    title: 'Bike to Work Week',
    description: 'Use a bike instead of a car for 5 days this week',
    type: 'weekly',
    target: 5,
    unit: 'days',
    points: 100,
    badge: 'bike-warrior',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Zero Waste Day',
    description: 'Generate zero waste for one full day',
    type: 'daily',
    target: 1,
    unit: 'day',
    points: 50,
    badge: 'zero-waste',
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
  {
    title: 'Plant 10 Trees',
    description: 'Plant 10 trees this month',
    type: 'monthly',
    target: 10,
    unit: 'trees',
    points: 200,
    badge: 'tree-planter',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Meat-Free Week',
    description: 'Go vegetarian or vegan for 7 days',
    type: 'weekly',
    target: 7,
    unit: 'days',
    points: 150,
    badge: 'plant-power',
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Energy Saver',
    description: 'Reduce energy consumption by 20% this month',
    type: 'monthly',
    target: 20,
    unit: '%',
    points: 175,
    badge: 'energy-saver',
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
];

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first activity',
    icon: '🌱',
    rarity: 'common',
  },
  {
    id: 'bike-warrior',
    name: 'Bike Warrior',
    description: 'Complete bike to work challenge',
    icon: '🚴',
    rarity: 'rare',
  },
  {
    id: 'zero-waste',
    name: 'Zero Waste Hero',
    description: 'Complete zero waste day',
    icon: '♻️',
    rarity: 'rare',
  },
  {
    id: 'tree-planter',
    name: 'Tree Planter',
    description: 'Plant 10 trees',
    icon: '🌳',
    rarity: 'epic',
  },
  {
    id: 'plant-power',
    name: 'Plant Power',
    description: 'Complete meat-free week',
    icon: '🥗',
    rarity: 'rare',
  },
  {
    id: 'energy-saver',
    name: 'Energy Saver',
    description: 'Reduce energy by 20%',
    icon: '⚡',
    rarity: 'epic',
  },
  {
    id: 'carbon-neutral',
    name: 'Carbon Neutral',
    description: 'Achieve carbon neutral status',
    icon: '🌍',
    rarity: 'legendary',
  },
  {
    id: 'eco-warrior',
    name: 'Eco Warrior',
    description: 'Reach 1000 points',
    icon: '🛡️',
    rarity: 'epic',
  },
  {
    id: 'community-leader',
    name: 'Community Leader',
    description: 'Top 10 on leaderboard',
    icon: '👑',
    rarity: 'legendary',
  },
];

export function getChallenges(): Challenge[] {
  try {
    const stored = localStorage.getItem(CHALLENGES_STORAGE_KEY);
    if (!stored) {
      // Initialize with default challenges
      const challenges: Challenge[] = DEFAULT_CHALLENGES.map((challenge, index) => ({
        ...challenge,
        id: `challenge_${index}`,
        current: 0,
        completed: false,
      }));
      saveChallenges(challenges);
      return challenges;
    }
    const challenges = JSON.parse(stored);
    return challenges.map((c: any) => ({
      ...c,
      startDate: new Date(c.startDate),
      endDate: new Date(c.endDate),
    }));
  } catch (error) {
    console.error('Error loading challenges:', error);
    // Return default challenges on error
    return DEFAULT_CHALLENGES.map((challenge, index) => ({
      ...challenge,
      id: `challenge_${index}`,
      current: 0,
      completed: false,
    }));
  }
}

export function saveChallenges(challenges: Challenge[]): void {
  localStorage.setItem(CHALLENGES_STORAGE_KEY, JSON.stringify(challenges));
}

export function updateChallengeProgress(challengeId: string, progress: number): void {
  const challenges = getChallenges();
  const challenge = challenges.find((c) => c.id === challengeId);
  if (challenge) {
    challenge.current = Math.min(challenge.current + progress, challenge.target);
    challenge.completed = challenge.current >= challenge.target;
    saveChallenges(challenges);
  }
}

export function getBadges(): Badge[] {
  try {
    const stored = localStorage.getItem(BADGES_STORAGE_KEY);
    if (!stored) return [];
    const badges = JSON.parse(stored);
    return badges.map((b: any) => ({
      ...b,
      earnedDate: b.earnedDate ? new Date(b.earnedDate) : undefined,
    }));
  } catch (error) {
    console.error('Error loading badges:', error);
    return [];
  }
}

export function earnBadge(badgeId: string): void {
  const badges = getBadges();
  if (!badges.find((b) => b.id === badgeId)) {
    const badge = AVAILABLE_BADGES.find((b) => b.id === badgeId);
    if (badge) {
      badges.push({
        ...badge,
        earnedDate: new Date(),
      });
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badges));
    }
  }
}

export function checkBadgeEligibility(): void {
  try {
    const { points, activities } = getUserData();
    
    // Check for various badge conditions
    if (activities >= 1) {
      earnBadge('first-steps');
    }
    
    if (points >= 1000) {
      earnBadge('eco-warrior');
    }
    
    // Check challenge completions
    const challenges = getChallenges();
    challenges.forEach((challenge) => {
      if (challenge.completed && challenge.badge) {
        earnBadge(challenge.badge);
      }
    });
  } catch (error) {
    console.error('Error checking badge eligibility:', error);
  }
}

