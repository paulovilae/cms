'use client'

import React from 'react'

interface SearchLoadingProps {
  count?: number
  className?: string
}

/**
 * Skeleton loading UI for search results
 * Shows animated placeholders while content is loading
 */
export const SearchLoading: React.FC<SearchLoadingProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`search-loading ${className}`}>
      {/* Skeleton search stats */}
      <div className="search-skeleton-stats mb-4 flex justify-between">
        <div className="loading-skeleton h-5 w-40"></div>
        <div className="loading-skeleton h-5 w-24"></div>
      </div>

      {/* Generate multiple skeleton items */}
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="search-skeleton-item mb-4 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="p-4">
            {/* Title skeleton */}
            <div className="search-skeleton-title loading-skeleton mb-3"></div>

            {/* Metadata skeleton */}
            <div className="flex items-center gap-2 mb-3">
              <div className="loading-skeleton h-4 w-20 rounded-full"></div>
              <div className="loading-skeleton h-4 w-24 rounded-full"></div>
            </div>

            {/* Content skeletons */}
            <div className="search-skeleton-content loading-skeleton mb-2"></div>
            <div className="search-skeleton-content loading-skeleton mb-2"></div>
            <div className="search-skeleton-content-short loading-skeleton mb-3"></div>

            {/* Action buttons skeleton */}
            <div className="flex gap-2 mt-4">
              <div className="loading-skeleton h-8 w-20 rounded"></div>
              <div className="loading-skeleton h-8 w-24 rounded"></div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        .loading-skeleton {
          background: linear-gradient(to right, #f0f0f0 8%, #e0e0e0 18%, #f0f0f0 33%);
          background-size: 800px 100px;
          animation: shimmer 1.5s infinite linear;
          border-radius: 0.25rem;
        }

        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }

        .search-skeleton-title {
          height: 24px;
          width: 70%;
          margin-bottom: 0.75rem;
        }

        .search-skeleton-content {
          height: 16px;
          width: 100%;
          margin-bottom: 0.5rem;
        }

        .search-skeleton-content-short {
          height: 16px;
          width: 60%;
        }

        /* Dark mode support */
        .dark .loading-skeleton {
          background: linear-gradient(to right, #2d3748 8%, #4a5568 18%, #2d3748 33%);
        }
      `}</style>
    </div>
  )
}

export default SearchLoading
