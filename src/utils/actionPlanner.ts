import type { ActionPlanForm } from '../types';

interface ActionPlan {
  title: string;
  actions: string[];
  impact: {
    co2Saved: string;
    treesEquivalent: string;
    description: string;
  };
}

export function generateActionPlan(form: ActionPlanForm): ActionPlan {
  const actions: string[] = [];
  let co2Value = 0;

  if (form.userType === 'student') {
    actions.push('Start an eco-club at school to inspire classmates');
    actions.push('Create educational posters about environmental issues');
    co2Value += 50;
  } else {
    actions.push('Advocate for sustainable policies in your workplace');
    actions.push('Mentor others about environmental responsibility');
    co2Value += 75;
  }

  if (form.location === 'city') {
    actions.push('Use public transportation or bike for daily commutes');
    actions.push('Support local urban gardens and green spaces');
    co2Value += 200;
  } else {
    actions.push('Plant native trees and create wildlife-friendly gardens');
    actions.push('Organize community clean-up events');
    co2Value += 150;
  }

  switch (form.transportation) {
    case 'walk':
    case 'bike':
      actions.push('Share your low-carbon commute story to inspire others');
      co2Value += 100;
      break;
    case 'public':
      actions.push('Encourage carpooling or transit use among neighbors');
      co2Value += 300;
      break;
    case 'car':
      actions.push('Explore carpooling options or consider an electric vehicle');
      actions.push('Combine errands to reduce trips');
      co2Value += 500;
      break;
  }

  switch (form.interest) {
    case 'animals':
      actions.push('Support local wildlife rehabilitation centers');
      actions.push('Create a wildlife-friendly backyard with native plants');
      actions.push('Participate in citizen science projects tracking animals');
      break;
    case 'climate':
      actions.push('Calculate and track your carbon footprint monthly');
      actions.push('Switch to renewable energy providers if available');
      actions.push('Reduce meat consumption by trying "Meatless Mondays"');
      break;
    case 'plants':
      actions.push('Plant pollinator-friendly flowers and herbs');
      actions.push('Join or start a community garden');
      actions.push('Learn about and share native plant species');
      break;
    case 'oceans':
      actions.push('Eliminate single-use plastics from your routine');
      actions.push('Choose sustainable seafood options');
      actions.push('Participate in beach or waterway clean-up events');
      break;
  }

  actions.push('Share your eco-journey on social media to inspire others');
  actions.push('Continue learning and adapting your environmental habits');

  const treesEquivalent = Math.round(co2Value / 48);

  return {
    title: `Your Personalized ${
      form.interest.charAt(0).toUpperCase() + form.interest.slice(1)
    }-Focused Action Plan`,
    actions,
    impact: {
      co2Saved: `${co2Value} lbs`,
      treesEquivalent: `${treesEquivalent} trees`,
      description: `By following these actions, you could potentially offset approximately ${co2Value} pounds of CO2 annually—equivalent to planting ${treesEquivalent} trees! Remember, every small action contributes to a healthier planet.`,
    },
  };
}
