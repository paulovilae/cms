'use client'

import React from 'react'
import type { UniversalSearchResult } from '../types/search.types'
import type { UniversalSearchConfig } from '../types/config.types'

interface SearchResultsProps {
  results: UniversalSearchResult[]
  loading?: boolean
  onClick?: (result: UniversalSearchResult) => void
  onAction?: (actionId: string, result: UniversalSearchResult) => void
  config: UniversalSearchConfig
  className?: string
}

/**
 * Displays search results with highlighting and actions
 */
export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  onClick,
  onAction,
  config,
  className = '',
}) => {
  // Handle result click
  const handleResultClick = (result: UniversalSearchResult) => {
    onClick?.(result)
  }

  // Handle action click
  const handleActionClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    actionId: string,
    result: UniversalSearchResult,
  ) => {
    e.stopPropagation() // Prevent triggering result click
    onAction?.(actionId, result)
  }

  // Format date
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A'

    try {
      const dateObj = new Date(date)
      // Return relative time if less than 7 days old
      const daysDiff = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff < 1) {
        return 'Today'
      } else if (daysDiff === 1) {
        return 'Yesterday'
      } else if (daysDiff < 7) {
        return `${daysDiff} days ago`
      } else {
        // Otherwise return formatted date
        return dateObj.toLocaleDateString()
      }
    } catch (e) {
      return date
    }
  }

  // Get collection display name
  const getCollectionName = (collection: string | undefined) => {
    // Handle undefined collection
    if (!collection) return 'Unknown Collection'

    // Use config display name if available, otherwise format collection slug
    if (collection === config.collection) {
      return config.displayName || 'Content'
    }

    // Format the collection slug
    return collection.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  // Render highlighted content
  const renderHighlightedContent = (result: UniversalSearchResult) => {
    if (!result.highlights || result.highlights.length === 0) {
      // If no highlights, show a truncated version of the content
      return (
        <p className="result-content">
          {result.content && result.content.length > 200
            ? `${result.content.substring(0, 200)}...`
            : result.content || 'No content available'}
        </p>
      )
    }

    // Otherwise show the highlights
    return (
      <div className="result-highlights">
        {result.highlights.map((highlight, index) => (
          <p key={index} className="highlight-fragment">
            {/* Check if fragments exists */}
            {highlight.fragments && highlight.fragments.length > 0 ? (
              highlight.fragments.map((fragment, fragIndex) => (
                <span key={fragIndex}>...{fragment}...</span>
              ))
            ) : (
              // Fallback if no fragments
              <span>
                Matched: {highlight.matchedTerms?.join(', ') || 'search term'} in{' '}
                {highlight.field || 'content'}
              </span>
            )}
          </p>
        ))}
      </div>
    )
  }

  // Render tags
  const renderTags = (tags: string[] | undefined) => {
    if (!tags || tags.length === 0) return null

    return (
      <div className="result-tags">
        {tags.slice(0, 5).map((tag, index) => (
          <span key={index} className="tag">
            {tag || 'Unnamed'}
          </span>
        ))}
        {tags.length > 5 && <span className="more-tags">+{tags.length - 5}</span>}
      </div>
    )
  }

  // Render result metadata
  const renderMetadata = (result: UniversalSearchResult) => {
    const { metadata } = result
    if (!metadata) return null

    return (
      <div className="result-metadata">
        {/* Collection */}
        <span className="metadata-item">{getCollectionName(result.collection)}</span>

        {/* Status badge if available */}
        {metadata?.status && (
          <span className={`status-badge status-${metadata.status.toLowerCase()}`}>
            {metadata.status}
          </span>
        )}

        {/* Last updated */}
        {metadata?.updatedAt && (
          <span className="metadata-item">Updated {formatDate(metadata.updatedAt)}</span>
        )}

        {/* Progress if available */}
        {metadata?.progress !== undefined && typeof metadata.progress === 'number' && (
          <span className="metadata-item">
            <span className="progress-bar">
              <span className="progress-fill" style={{ width: `${metadata.progress}%` }}></span>
            </span>
            <span className="progress-text">{metadata.progress}%</span>
          </span>
        )}
      </div>
    )
  }

  // Render action buttons
  const renderActions = (result: UniversalSearchResult) => {
    // Use provided result actions or get from config
    const actions = result.actions?.length
      ? result.actions
      : (config.actions || []).filter((action) => {
          // If action has a condition, evaluate it
          if (action.condition) {
            // Simple condition parsing - in a real implementation,
            // we would use a proper condition parser
            const statusCheck = action.condition.includes('status')
            if (statusCheck && result.metadata) {
              if (action.condition.includes('!=')) {
                const parts = action.condition.split('!=')
                // Use non-null assertion to handle TypeScript error
                const statusValue = parts.length > 1 ? parts[1]?.trim() || '' : ''
                return result.metadata.status !== statusValue
              } else if (action.condition.includes('==')) {
                const parts = action.condition.split('==')
                // Use non-null assertion to handle TypeScript error
                const statusValue = parts.length > 1 ? parts[1]?.trim() || '' : ''
                return result.metadata.status === statusValue
              }
            }

            // Default to showing the action if we can't evaluate the condition
            return true
          }

          return true
        })

    if (!actions || actions.length === 0) return null

    return (
      <div className="result-actions">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={(e) => handleActionClick(e, action.id, result)}
            className={`action-button ${action.id}`}
          >
            {action.label}
          </button>
        ))}
      </div>
    )
  }

  // Handle loading state
  if (loading) {
    return (
      <div className={`search-results-loading ${className}`}>
        <div className="loading-spinner">⟳</div>
        <p>Searching...</p>
      </div>
    )
  }

  // Handle empty results
  if (results.length === 0) {
    return (
      <div className={`search-results-empty ${className}`}>
        <p>No results found</p>
        <p className="empty-suggestions">Try adjusting your search terms or filters</p>
      </div>
    )
  }

  return (
    <div className={`search-results ${className}`}>
      <ul className="results-list">
        {results.map((result, index) => (
          <li
            key={`${result.collection || 'unknown'}-${result.id || index}`}
            className="result-item"
            onClick={() => handleResultClick(result)}
          >
            {/* Result header */}
            <div className="result-header">
              <h3 className="result-title">{result.title}</h3>
              {renderMetadata(result)}
            </div>

            {/* Result content */}
            {renderHighlightedContent(result)}

            {/* Tags */}
            {renderTags(result.metadata?.tags)}

            {/* Actions */}
            {result && renderActions(result)}
          </li>
        ))}
      </ul>

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .search-results {
          width: 100%;
        }

        .results-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .result-item {
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 1rem;
          margin-bottom: 1rem;
          background-color: white;
          cursor: pointer;
          transition: all 0.2s;
        }

        .result-item:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          transform: translateY(-1px);
        }

        .result-header {
          display: flex;
          flex-direction: column;
          margin-bottom: 0.5rem;
        }

        .result-title {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          color: #2d3748;
        }

        .result-metadata {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          font-size: 0.875rem;
          color: #718096;
          margin-bottom: 0.5rem;
        }

        .metadata-item {
          margin-right: 1rem;
        }

        .status-badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
          margin-right: 1rem;
        }

        .status-draft {
          background-color: #edf2f7;
          color: #4a5568;
        }

        .status-in-progress {
          background-color: #ebf8ff;
          color: #2b6cb0;
        }

        .status-completed {
          background-color: #f0fff4;
          color: #2f855a;
        }

        .status-archived {
          background-color: #edf2f7;
          color: #718096;
        }

        .progress-bar {
          display: inline-block;
          width: 50px;
          height: 6px;
          background-color: #edf2f7;
          border-radius: 9999px;
          margin-right: 0.25rem;
          overflow: hidden;
        }

        .progress-fill {
          display: block;
          height: 100%;
          background-color: #4299e1;
          border-radius: 9999px;
        }

        .progress-text {
          font-size: 0.75rem;
        }

        .result-content {
          font-size: 0.875rem;
          color: #4a5568;
          margin: 0 0 0.5rem 0;
          line-height: 1.5;
        }

        .result-highlights {
          font-size: 0.875rem;
          color: #4a5568;
          margin: 0 0 0.5rem 0;
        }

        .highlight-fragment {
          margin: 0 0 0.25rem 0;
          line-height: 1.5;
        }

        .result-tags {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 0.5rem;
        }

        .tag {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          background-color: #f7fafc;
          color: #4a5568;
          margin-right: 0.5rem;
          margin-bottom: 0.25rem;
        }

        .more-tags {
          font-size: 0.75rem;
          color: #718096;
          padding: 0.125rem 0;
        }

        .result-actions {
          display: flex;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .action-button {
          background-color: #f7fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.25rem;
          padding: 0.25rem 0.75rem;
          font-size: 0.875rem;
          color: #4a5568;
          margin-right: 0.5rem;
          margin-bottom: 0.25rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-button:hover {
          background-color: #edf2f7;
        }

        .action-button.view {
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
        }

        .action-button.continue {
          background-color: #f0fff4;
          color: #2f855a;
          border-color: #c6f6d5;
        }

        .action-button.edit {
          background-color: #f0fff4;
          color: #2f855a;
          border-color: #c6f6d5;
        }

        .action-button.export {
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
        }

        .search-results-loading,
        .search-results-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          text-align: center;
          color: #718096;
        }

        .loading-spinner {
          font-size: 2rem;
          margin-bottom: 1rem;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .empty-suggestions {
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default SearchResults
