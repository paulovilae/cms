'use client'

import React from 'react'
import type { UniversalSearchResult } from '../types/search.types'

interface QuickPreviewProps {
  result: UniversalSearchResult | null
  onClose?: () => void
  onAction?: (actionId: string, result: UniversalSearchResult) => void
  className?: string
}

/**
 * Displays a detailed preview of a search result
 */
export const QuickPreview: React.FC<QuickPreviewProps> = ({
  result,
  onClose,
  onAction,
  className = '',
}) => {
  // If no result is selected, show empty state
  if (!result) {
    return (
      <div className={`quick-preview-empty ${className}`}>
        <p className="empty-message">Select a result to see more details</p>
      </div>
    )
  }

  // Format date
  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A'

    try {
      const dateObj = new Date(date)
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (e) {
      return date
    }
  }

  // Handle action click
  const handleActionClick = (actionId: string) => {
    onAction?.(actionId, result)
  }

  // Get collection display name
  const getCollectionName = (collection: string) => {
    return collection.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  }

  return (
    <div className={`quick-preview ${className}`}>
      {/* Header */}
      <div className="preview-header">
        <div className="header-content">
          <div className="collection-badge">{getCollectionName(result.collection)}</div>

          {result.metadata.status && (
            <div className={`status-badge status-${result.metadata.status.toLowerCase()}`}>
              {result.metadata.status}
            </div>
          )}
        </div>

        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      {/* Title */}
      <h2 className="preview-title">{result.title}</h2>

      {/* Metadata Grid */}
      <div className="metadata-grid">
        {result.metadata.author && (
          <div className="metadata-item">
            <span className="metadata-label">Author</span>
            <span className="metadata-value">{result.metadata.author}</span>
          </div>
        )}

        {result.metadata.createdAt && (
          <div className="metadata-item">
            <span className="metadata-label">Created</span>
            <span className="metadata-value">{formatDate(result.metadata.createdAt)}</span>
          </div>
        )}

        {result.metadata.updatedAt && (
          <div className="metadata-item">
            <span className="metadata-label">Updated</span>
            <span className="metadata-value">{formatDate(result.metadata.updatedAt)}</span>
          </div>
        )}

        {result.metadata.category && (
          <div className="metadata-item">
            <span className="metadata-label">Category</span>
            <span className="metadata-value">{result.metadata.category}</span>
          </div>
        )}

        {typeof result.metadata.progress === 'number' && (
          <div className="metadata-item">
            <span className="metadata-label">Progress</span>
            <span className="metadata-value progress-display">
              <span className="progress-bar">
                <span
                  className="progress-fill"
                  style={{ width: `${result.metadata.progress}%` }}
                ></span>
              </span>
              <span className="progress-text">{result.metadata.progress}%</span>
            </span>
          </div>
        )}
      </div>

      {/* Tags */}
      {result.metadata.tags && result.metadata.tags.length > 0 && (
        <div className="preview-tags">
          <h3 className="section-title">Tags</h3>
          <div className="tags-list">
            {result.metadata.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="preview-content">
        <h3 className="section-title">Content</h3>
        <div className="content-text">
          {result.content.length > 500 ? `${result.content.substring(0, 500)}...` : result.content}
        </div>
      </div>

      {/* Highlights */}
      {result.highlights && result.highlights.length > 0 && (
        <div className="preview-highlights">
          <h3 className="section-title">Matched Content</h3>
          <div className="highlights-list">
            {result.highlights.map((highlight, index) => (
              <div key={index} className="highlight-item">
                <span className="highlight-field">{highlight.field}:</span>
                <div className="highlight-fragments">
                  {highlight.fragments.map((fragment, fragIndex) => (
                    <p key={fragIndex} className="fragment-text">
                      ...{fragment}...
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {result.actions && result.actions.length > 0 && (
        <div className="preview-actions">
          {result.actions.map((action, index) => (
            <button
              key={index}
              className={`action-button ${action.id}`}
              onClick={() => handleActionClick(action.id)}
            >
              {action.label}
            </button>
          ))}

          {/* View full item button */}
          {result.url && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button view-full"
            >
              View Full Item
            </a>
          )}
        </div>
      )}

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .quick-preview {
          width: 100%;
          height: 100%;
          background-color: white;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .quick-preview-empty {
          width: 100%;
          height: 100%;
          background-color: #f7fafc;
          border-radius: 0.5rem;
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #a0aec0;
          text-align: center;
          padding: 2rem;
        }

        .empty-message {
          font-size: 0.875rem;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background-color: #f7fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .collection-badge {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          background-color: #edf2f7;
          color: #4a5568;
          border-radius: 9999px;
        }

        .status-badge {
          font-size: 0.75rem;
          font-weight: 500;
          padding: 0.25rem 0.5rem;
          border-radius: 9999px;
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

        .close-button {
          background: none;
          border: none;
          font-size: 1.25rem;
          color: #a0aec0;
          cursor: pointer;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
        }

        .close-button:hover {
          background-color: #edf2f7;
          color: #4a5568;
        }

        .preview-title {
          font-size: 1.25rem;
          font-weight: 600;
          padding: 1rem 1rem 0.5rem;
          margin: 0;
          color: #2d3748;
        }

        .metadata-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          padding: 0 1rem 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .metadata-item {
          display: flex;
          flex-direction: column;
        }

        .metadata-label {
          font-size: 0.75rem;
          color: #718096;
          margin-bottom: 0.25rem;
        }

        .metadata-value {
          font-size: 0.875rem;
          color: #2d3748;
        }

        .progress-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-bar {
          display: inline-block;
          width: 100px;
          height: 8px;
          background-color: #edf2f7;
          border-radius: 9999px;
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
          font-weight: 500;
        }

        .section-title {
          font-size: 0.875rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          color: #4a5568;
        }

        .preview-tags {
          padding: 0 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          background-color: #f7fafc;
          color: #4a5568;
          border-radius: 9999px;
          border: 1px solid #e2e8f0;
        }

        .preview-content {
          padding: 0 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .content-text {
          font-size: 0.875rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          color: #4a5568;
          white-space: pre-line;
        }

        .preview-highlights {
          padding: 0 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .highlights-list {
          margin-bottom: 1rem;
        }

        .highlight-item {
          margin-bottom: 0.75rem;
        }

        .highlight-field {
          font-size: 0.75rem;
          font-weight: 500;
          color: #718096;
        }

        .highlight-fragments {
          margin-top: 0.25rem;
        }

        .fragment-text {
          font-size: 0.875rem;
          margin: 0.25rem 0;
          padding: 0.25rem 0.5rem;
          background-color: #fffaf0;
          border-radius: 0.25rem;
          color: #4a5568;
        }

        .preview-actions {
          display: flex;
          gap: 0.5rem;
          padding: 1rem;
          margin-top: auto;
          border-top: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }

        .action-button {
          font-size: 0.875rem;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          border: 1px solid #e2e8f0;
          background-color: #f7fafc;
          color: #4a5568;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .action-button:hover {
          background-color: #edf2f7;
        }

        .action-button.view {
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
        }

        .action-button.edit {
          background-color: #f0fff4;
          color: #2f855a;
          border-color: #c6f6d5;
        }

        .action-button.continue {
          background-color: #f0fff4;
          color: #2f855a;
          border-color: #c6f6d5;
        }

        .action-button.export {
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
        }

        .action-button.view-full {
          background-color: #ebf8ff;
          color: #2b6cb0;
          border-color: #bee3f8;
          margin-left: auto;
        }
      `}</style>
    </div>
  )
}

export default QuickPreview
