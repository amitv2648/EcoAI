import { useState } from 'react';
import { Heart, Shield, Sparkles, AlertCircle, DollarSign, TreePine, Waves, Sprout, Bird } from 'lucide-react';

type AuthView = 'login' | 'signup' | 'donation';
type Cause = 'forests' | 'oceans' | 'renewable' | 'wildlife';

export default function Donate() {
  const [authView, setAuthView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCause, setSelectedCause] = useState<Cause>('forests');
  const [amount, setAmount] = useState('25');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    // Open real donation link in new tab
    const cause = causes.find((c) => c.id === selectedCause);
    if (cause && (cause as any).donationLink) {
      window.open((cause as any).donationLink, '_blank');
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  const causes = [
    {
      id: 'forests' as Cause,
      name: 'Forest Conservation',
      description: 'Protect and restore forests worldwide',
      icon: TreePine,
      color: 'green',
      impact: 'Help plant 100 trees',
      donationLink: 'https://www.rainforest-alliance.org/donate',
      organization: 'Rainforest Alliance',
    },
    {
      id: 'oceans' as Cause,
      name: 'Ocean Protection',
      description: 'Clean oceans and protect marine life',
      icon: Waves,
      color: 'blue',
      impact: 'Remove 50 lbs of plastic',
      donationLink: 'https://oceanconservancy.org/donate/',
      organization: 'Ocean Conservancy',
    },
    {
      id: 'renewable' as Cause,
      name: 'Renewable Energy',
      description: 'Support clean energy initiatives',
      icon: Sprout,
      color: 'yellow',
      impact: 'Offset 500 lbs CO2',
      donationLink: 'https://www.sierraclub.org/donate',
      organization: 'Sierra Club',
    },
    {
      id: 'wildlife' as Cause,
      name: 'Wildlife Conservation',
      description: 'Protect endangered species',
      icon: Bird,
      color: 'emerald',
      impact: 'Protect 5 animals',
      donationLink: 'https://www.worldwildlife.org/how-to-help',
      organization: 'World Wildlife Fund',
    },
  ];

  const selectedCauseData = causes.find((c) => c.id === selectedCause)!;

  const getAIRecommendation = () => {
    const recommendations = {
      forests: 'Based on current environmental data, forest conservation has the highest immediate impact on CO2 reduction and biodiversity protection.',
      oceans: 'Ocean protection is critical right now—marine ecosystems are under unprecedented threat from plastic pollution and warming waters.',
      renewable: 'Renewable energy projects offer the best long-term solution to climate change, with exponential impact potential.',
      wildlife: 'Wildlife conservation protects keystone species that maintain ecosystem balance, creating cascading positive effects.',
    };
    return recommendations[selectedCause];
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 lg:px-6">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Heart className="w-10 h-10 text-green-600 dark:text-green-400" fill="currentColor" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You've been redirected to {(selectedCauseData as any).organization || selectedCauseData.name}'s official donation page.
            Your contribution will make a real difference!
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">
              Your contribution will: {selectedCauseData.impact}
            </p>
            <p className="text-xs text-green-700 dark:text-green-300 mt-2">
              Donating through: {(selectedCauseData as any).organization || 'Partner Organization'}
            </p>
          </div>
          <div className="space-y-2">
            <a
              href={(selectedCauseData as any).donationLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 transition-all duration-300 text-center"
            >
              Complete Donation on Official Site
            </a>
            <button
              onClick={() => {
                setShowSuccess(false);
                setAmount('25');
              }}
              className="w-full py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300"
            >
              Make Another Donation
            </button>
          </div>
        </div>

        <style>{`
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
        `}</style>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 lg:px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-3">
              Support Our Planet
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {authView === 'login' ? 'Sign in to continue' : 'Create your account'}
            </p>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Demo Mode:</strong> This is a prototype. No real
              authentication or payment processing occurs. Click any button to
              continue.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            <div className="flex mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setAuthView('login')}
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                  authView === 'login'
                    ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setAuthView('signup')}
                className={`flex-1 py-2 rounded-md font-medium transition-all duration-300 ${
                  authView === 'signup'
                    ? 'bg-white dark:bg-gray-600 text-green-700 dark:text-green-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {authView === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Shield className="w-5 h-5" />
                <span>{authView === 'login' ? 'Login' : 'Sign Up'}</span>
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              This is a demo. Click the button to continue without real authentication.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" fill="currentColor" />
          <h1 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-3">
            Make a Difference Today
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your contribution helps protect our planet for future generations
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Demo Mode:</strong> This is a prototype showcasing donation UI.
            No real payments are processed. All amounts and impacts are simulated
            for demonstration purposes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {causes.map((cause) => {
            const Icon = cause.icon;
            const isSelected = selectedCause === cause.id;
            const colorClasses = {
              green: isSelected ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600' : '',
              blue: isSelected ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600' : '',
              yellow: isSelected ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-600' : '',
              emerald: isSelected ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600' : '',
            };
            return (
              <button
                key={cause.id}
                onClick={() => setSelectedCause(cause.id)}
                className={`text-left p-6 rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? colorClasses[cause.color as keyof typeof colorClasses] + ' shadow-lg'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
                }`}
              >
                <Icon className={`w-12 h-12 ${
                  cause.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  cause.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  cause.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-emerald-600 dark:text-emerald-400'
                } mb-3`} />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                  {cause.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{cause.description}</p>
                <div className="flex items-center space-x-2 text-sm font-medium text-green-700 dark:text-green-400">
                  <Heart className="w-4 h-4" />
                  <span>{cause.impact}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                AI Recommendation for {selectedCauseData.name}
              </h3>
              <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                {getAIRecommendation()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Complete Your Donation
          </h2>

          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-4 gap-3 mb-3">
                {['10', '25', '50', '100'].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`py-3 rounded-lg border-2 font-semibold transition-all duration-300 ${
                      amount === amt
                        ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-md'
                        : 'border-gray-300 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-600 dark:text-gray-300'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition-colors dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-lg p-4">
              <h3 className="font-bold text-green-900 dark:text-green-200 mb-2">Your Impact:</h3>
              <p className="text-green-800 dark:text-green-200 text-sm">
                ${amount} donation → {selectedCauseData.impact}
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-800 dark:hover:to-emerald-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Heart className="w-6 h-6" fill="currentColor" />
              <span>Donate ${amount}</span>
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              You'll be redirected to the official donation page of {(selectedCauseData as any).organization || 'the organization'}.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
