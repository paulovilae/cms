'use client'

import React from 'react'
import type { SearchResponse } from '../types/search.types'

interface SearchStatsProps {
  response: SearchResponse
  className?: string
}

/**
 * Displays search statistics and metrics
 */
export const SearchStats: React.FC<SearchStatsProps> = ({ response, className = '' }) => {
  // Format the search time
  const formatSearchTime = (timeMs: number) => {
    if (timeMs < 1) {
      return '<1ms'
    }
    if (timeMs < 1000) {
      return `${Math.round(timeMs)}ms`
    }
    return `${(timeMs / 1000).toFixed(2)}s`
  }

  // Format total count with commas
  const formatCount = (count: number) => {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // Determine the appropriate search performance message
  const getPerformanceMessage = (timeMs: number) => {
    if (timeMs < 100) {
      return 'Lightning fast'
    }
    if (timeMs < 300) {
      return 'Very fast'
    }
    if (timeMs < 1000) {
      return 'Fast'
    }
    return 'Completed'
  }

  return (
    <div className={`search-stats ${className}`}>
      <div className="stats-item">
        <span className="stats-label">Results</span>
        <span className="stats-value">{formatCount(response.totalCount)}</span>
      </div>

      <div className="stats-item">
        <span className="stats-label">Search time</span>
        <span className="stats-value">
          {formatSearchTime(response.searchTime)}
          <span className="performance-badge">{getPerformanceMessage(response.searchTime)}</span>
        </span>
      </div>

      {/* Distribution by collection (if more than one) */}
      {response.facets.collections.length > 1 && (
        <div className="collection-distribution">
          {response.facets.collections.map((collection) => (
            <div key={collection.value} className="collection-bar">
              <div
                className="collection-fill"
                style={{
                  width: `${(collection.count / response.totalCount) * 100}%`,
                  backgroundColor: getCollectionColor(collection.value),
                }}
              />
              <span className="collection-label">
                {collection.label || formatCollectionName(collection.value)}
                <span className="collection-count">{collection.count}</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .search-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0.75rem;
          background-color: #f7fafc;
          border-radius: 0.375rem;
          font-size: 0.875rem;
          color: #4a5568;
        }

        .stats-item {
          display: flex;
          flex-direction: column;
        }

        .stats-label {
          font-size: 0.75rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }

        .stats-value {
          font-weight: 500;
          display: flex;
          align-items: center;
        }

        .performance-badge {
          font-size: 0.75rem;
          background-color: #ebf8ff;
          color: #2b6cb0;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          margin-left: 0.5rem;
        }

        .collection-distribution {
          width: 100%;
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .collection-bar {
          height: 1.5rem;
          background-color: #edf2f7;
          border-radius: 9999px;
          overflow: hidden;
          position: relative;
        }

        .collection-fill {
          height: 100%;
          border-radius: 9999px;
          transition: width 0.3s ease;
        }

        .collection-label {
          position: absolute;
          left: 0.5rem;
          top: 0;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #2d3748;
          width: calc(100% - 1rem);
        }

        .collection-count {
          font-weight: 500;
        }
      `}</style>
    </div>
  )
}

// Get a predictable color based on collection name
const getCollectionColor = (collection: string) => {
  // Simple hash function for string
  let hash = 0
  for (let i = 0; i < collection.length; i++) {
    hash = collection.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate HSL color with fixed saturation and lightness for consistency
  const h = Math.abs(hash % 360)
  return `hsl(${h}, 70%, 65%)`
}

// Format collection name for display
const formatCollectionName = (collection: string) => {
  return collection.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default SearchStats
