// Carbon footprint calculation utilities
// Based on EPA and other environmental data sources

export interface TransportInput {
  carMiles?: number;
  publicTransitMiles?: number;
  bikeMiles?: number;
  walkMiles?: number;
  flights?: Array<{ miles: number; type: 'short' | 'medium' | 'long' }>;
}

export interface EnergyInput {
  electricityKwh?: number;
  gasTherms?: number;
  heatingType?: 'electric' | 'gas' | 'oil' | 'solar';
}

export interface FoodInput {
  meatMeals?: number;
  vegetarianMeals?: number;
  veganMeals?: number;
  localFoodPercentage?: number;
}

export interface WasteInput {
  recycledPounds?: number;
  compostedPounds?: number;
  wasteReducedPounds?: number;
}

// Transportation emissions (kg CO2 per mile)
const EMISSION_FACTORS = {
  car: 0.411, // Average car (varies by fuel efficiency)
  publicTransit: 0.177, // Average public transit
  bike: 0,
  walk: 0,
  flightShort: 0.254, // < 500 miles
  flightMedium: 0.195, // 500-1500 miles
  flightLong: 0.15, // > 1500 miles
};

// Energy emissions (kg CO2 per unit)
const ENERGY_FACTORS = {
  electricity: 0.429, // kg CO2 per kWh (US average)
  gas: 5.31, // kg CO2 per therm
  oil: 2.68, // kg CO2 per gallon
};

// Food emissions (kg CO2 per meal)
const FOOD_FACTORS = {
  meat: 3.3,
  vegetarian: 1.4,
  vegan: 0.7,
};

export function calculateTransportCarbon(input: TransportInput): number {
  let total = 0;

  if (input.carMiles) {
    total += input.carMiles * EMISSION_FACTORS.car;
  }

  if (input.publicTransitMiles) {
    total += input.publicTransitMiles * EMISSION_FACTORS.publicTransit;
  }

  if (input.flights) {
    input.flights.forEach((flight) => {
      const factor =
        flight.type === 'short'
          ? EMISSION_FACTORS.flightShort
          : flight.type === 'medium'
          ? EMISSION_FACTORS.flightMedium
          : EMISSION_FACTORS.flightLong;
      total += flight.miles * factor;
    });
  }

  return total;
}

export function calculateEnergyCarbon(input: EnergyInput): number {
  let total = 0;

  if (input.electricityKwh) {
    total += input.electricityKwh * ENERGY_FACTORS.electricity;
  }

  if (input.gasTherms) {
    total += input.gasTherms * ENERGY_FACTORS.gas;
  }

  return total;
}

export function calculateFoodCarbon(input: FoodInput): number {
  let total = 0;

  if (input.meatMeals) {
    total += input.meatMeals * FOOD_FACTORS.meat;
  }

  if (input.vegetarianMeals) {
    total += input.vegetarianMeals * FOOD_FACTORS.vegetarian;
  }

  if (input.veganMeals) {
    total += input.veganMeals * FOOD_FACTORS.vegan;
  }

  // Local food reduces emissions by ~10%
  if (input.localFoodPercentage) {
    total *= 1 - input.localFoodPercentage / 100 * 0.1;
  }

  return total;
}

export function calculateWasteCarbon(input: WasteInput): number {
  // Recycling and composting reduce emissions
  // Recycling: ~0.5 kg CO2 saved per pound
  // Composting: ~0.3 kg CO2 saved per pound
  let saved = 0;

  if (input.recycledPounds) {
    saved += input.recycledPounds * 0.5;
  }

  if (input.compostedPounds) {
    saved += input.compostedPounds * 0.3;
  }

  if (input.wasteReducedPounds) {
    saved += input.wasteReducedPounds * 0.4; // General waste reduction
  }

  return -saved; // Negative because it's saved, not emitted
}

export function calculateTotalCarbon(
  transport: TransportInput,
  energy: EnergyInput,
  food: FoodInput,
  waste: WasteInput
): number {
  const transportCarbon = calculateTransportCarbon(transport);
  const energyCarbon = calculateEnergyCarbon(energy);
  const foodCarbon = calculateFoodCarbon(food);
  const wasteCarbon = calculateWasteCarbon(waste);

  return transportCarbon + energyCarbon + foodCarbon + wasteCarbon;
}

// Quick activity-based calculations
export function calculateActivityCarbon(
  activity: string,
  amount: number,
  unit: string = 'count'
): number {
  const activities: Record<string, number> = {
    // kg CO2 saved per activity
    'plant-tree': 22, // Average tree absorbs 22 kg CO2 per year
    'bike-commute': 0.411 * amount, // Saved car miles
    'public-transit': 0.234 * amount, // Saved car miles
    'recycle': 0.5 * amount, // Per pound
    'compost': 0.3 * amount, // Per pound
    'reduce-meat': 2.6 * amount, // Per meal
    'solar-panel': 0.429 * amount, // Per kWh generated
    'led-bulb': 0.05 * amount, // Per bulb replaced
    'reusable-bag': 0.01 * amount, // Per bag
    'water-bottle': 0.15 * amount, // Per bottle
    'car-pool': 0.2 * amount, // Per mile shared
    'work-from-home': 0.411 * amount, // Per mile not driven
  };

  return activities[activity] || 0;
}

