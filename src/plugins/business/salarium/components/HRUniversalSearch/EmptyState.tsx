'use client'

import React from 'react'
import { Search } from 'lucide-react'

interface EmptyStateProps {
  onSampleSearchClick: (term: string) => void
  sampleSearches?: string[]
  className?: string
}

/**
 * Empty state component for when no search results are found
 * Provides suggestions and sample searches to help the user
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  onSampleSearchClick,
  sampleSearches = [
    'senior software engineer',
    'marketing manager',
    'project coordinator',
    'data analyst',
    'human resources specialist',
  ],
  className = '',
}) => {
  return (
    <div className={`empty-state py-10 px-6 text-center animate-fadeIn ${className}`}>
      <div className="empty-state-icon mb-4">
        <Search className="w-12 h-12 mx-auto text-gray-400" />
      </div>

      <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
        No Job Descriptions Found
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        We couldn't find any job descriptions matching your search. Try adjusting your search terms
        or filters.
      </p>

      <div className="suggestions mb-8">
        <h4 className="text-sm font-medium mb-3 text-gray-600 dark:text-gray-400">
          Try these popular searches:
        </h4>

        <div className="flex flex-wrap justify-center gap-2">
          {sampleSearches.map((term, index) => (
            <button
              key={index}
              onClick={() => onSampleSearchClick(term)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300 transition-all duration-300"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      <div className="tips text-left bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg max-w-md mx-auto">
        <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-200">Search Tips:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-disc pl-5">
          <li>Try using different keywords or abbreviations</li>
          <li>Check for spelling mistakes</li>
          <li>Use broader terms to widen your search</li>
          <li>Try searching by department or job level</li>
        </ul>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        .empty-state {
          transition: all 0.3s ease;
        }

        .empty-state button {
          transform: translateY(0);
          transition: all 0.2s ease;
        }

        .empty-state button:hover {
          transform: translateY(-1px);
        }

        .empty-state button:active {
          transform: translateY(1px);
        }
      `}</style>
    </div>
  )
}

export default EmptyState
