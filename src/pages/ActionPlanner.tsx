import { useState } from 'react';
import { CheckCircle2, Leaf, MapPin, Car, Heart, Sparkles, Award } from 'lucide-react';
import type { ActionPlanForm } from '../types';
import { generateActionPlan } from '../utils/actionPlanner';
import { addActivity } from '../utils/pointsService';

export default function ActionPlanner() {
  const [formData, setFormData] = useState<ActionPlanForm>({
    userType: 'student',
    location: 'city',
    transportation: 'walk',
    interest: 'climate',
  });
  const [showPlan, setShowPlan] = useState(false);
  const [plan, setPlan] = useState<ReturnType<typeof generateActionPlan> | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<number>>(new Set());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedPlan = generateActionPlan(formData);
    setPlan(generatedPlan);
    setShowPlan(true);
  };

  const handleReset = () => {
    setShowPlan(false);
    setPlan(null);
    setCompletedActions(new Set());
  };

  const handleActionComplete = (index: number, action: string) => {
    if (completedActions.has(index)) return;
    
    const newCompleted = new Set(completedActions);
    newCompleted.add(index);
    setCompletedActions(newCompleted);
    
    // Award points for completing an action (10 points per action)
    addActivity({
      title: `Completed: ${action}`,
      description: `Completed action from your personalized plan`,
      points: 10,
    });
  };

  if (showPlan && plan) {
    const completedCount = completedActions.size;
    const totalPoints = completedCount * 10;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 lg:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white p-8">
              <div className="flex items-center space-x-3 mb-3">
                <Sparkles className="w-8 h-8" />
                <h2 className="text-3xl font-bold">{plan.title}</h2>
              </div>
              <p className="text-green-100">
                Tailored specifically for your lifestyle and interests
              </p>
            </div>

            <div className="p-8">
              {/* Points Summary */}
              {completedCount > 0 && (
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl p-6 mb-6 border-2 border-yellow-300 dark:border-yellow-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="text-xl font-bold text-yellow-800 dark:text-yellow-200">
                      Great Progress!
                    </h3>
                  </div>
                  <p className="text-yellow-700 dark:text-yellow-300">
                    You've completed {completedCount} action{completedCount !== 1 ? 's' : ''} and earned {totalPoints} points!
                  </p>
                </div>
              )}

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-8 border-2 border-green-200 dark:border-green-700">
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-3 flex items-center space-x-2">
                  <Leaf className="w-6 h-6" />
                  <span>Your Environmental Impact</span>
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {plan.impact.co2Saved}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">CO2 Potentially Offset</div>
                  </div>
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {plan.impact.treesEquivalent}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Tree Equivalent</div>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {plan.impact.description}
                </p>
              </div>

              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Your Action Steps
              </h3>

              <div className="space-y-4 mb-8">
                {plan.actions.map((action, index) => {
                  const isCompleted = completedActions.has(index);
                  return (
                    <div
                      key={index}
                      className={`flex items-start space-x-4 p-4 rounded-lg border-l-4 transform transition-all duration-300 hover:shadow-md ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-600 dark:border-green-500'
                          : 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-500 dark:border-green-600 cursor-pointer'
                      }`}
                      style={{
                        animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                      }}
                      onClick={() => !isCompleted && handleActionComplete(index, action)}
                    >
                      <button
                        className={`flex-shrink-0 mt-0.5 transition-all ${
                          isCompleted
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-gray-400 hover:text-green-600 dark:hover:text-green-400'
                        }`}
                        disabled={isCompleted}
                      >
                        <CheckCircle2 className={`w-6 h-6 ${isCompleted ? 'fill-current' : ''}`} />
                      </button>
                      <div className="flex-1">
                        <p className={`${isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {action}
                        </p>
                        {isCompleted && (
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1 inline-block">
                            +10 points earned!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleReset}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Create Another Plan
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 lg:px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-3">
            AI-Powered Action Planner
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Answer a few questions to get your personalized eco-action plan
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 space-y-8"
        >
          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Are you a student or adult?</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['student', 'adult'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, userType: type })}
                  className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                    formData.userType === type
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 dark:text-gray-300'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Where do you live?</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['city', 'suburban'] as const).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setFormData({ ...formData, location: loc })}
                  className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                    formData.location === loc
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 dark:text-gray-300'
                  }`}
                >
                  {loc.charAt(0).toUpperCase() + loc.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              <Car className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Main transportation type?</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['walk', 'bike', 'car', 'public'] as const).map((trans) => (
                <button
                  key={trans}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, transportation: trans })
                  }
                  className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                    formData.transportation === trans
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                      : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 dark:text-gray-300'
                  }`}
                >
                  {trans === 'public'
                    ? 'Public Transit'
                    : trans.charAt(0).toUpperCase() + trans.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              <Leaf className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span>Environmental interest?</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {(['animals', 'climate', 'plants', 'oceans'] as const).map(
                (interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => setFormData({ ...formData, interest })}
                    className={`p-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                      formData.interest === interest
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 dark:text-gray-300'
                    }`}
                  >
                    {interest.charAt(0).toUpperCase() + interest.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate My Action Plan</span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
