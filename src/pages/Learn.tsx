import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { facts } from '../data/facts';
import type { FactCard } from '../types';

export default function Learn() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const getCategoryColor = (category: FactCard['category']) => {
    switch (category) {
      case 'climate':
        return 'from-orange-400 to-red-500';
      case 'nature':
        return 'from-green-400 to-emerald-600';
      case 'pollution':
        return 'from-blue-400 to-cyan-600';
    }
  };

  const getCategoryBg = (category: FactCard['category']) => {
    switch (category) {
      case 'climate':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      case 'nature':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'pollution':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-green-800 dark:text-green-400 mb-4">
            Discover Our Planet
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn about climate change, nature, and sustainability through
            engaging facts and statistics
          </p>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Educational Content:</strong> These facts are simplified for
            learning purposes. Always verify information from multiple scientific
            sources for academic or professional use.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((fact, index) => (
            <div
              key={fact.id}
              className="transform transition-all duration-500 hover:scale-105"
              style={{
                animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`rounded-xl border-2 overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer ${getCategoryBg(
                  fact.category
                )}`}
                onClick={() => toggleCard(fact.id)}
              >
                <div
                  className={`h-2 bg-gradient-to-r ${getCategoryColor(
                    fact.category
                  )}`}
                />

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-4xl">{fact.icon}</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                      {fact.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {fact.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">{fact.shortDesc}</p>

                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      expandedCard === fact.id
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                      {fact.fullDesc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                        {fact.stat}
                      </span>
                    </div>
                    {expandedCard === fact.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}
