'use client'

import React, { useState, useRef, useEffect } from 'react'
import type { AISuggestion } from '../types/semantic.types'

interface SearchInputProps {
  query: string
  setQuery: (query: string) => void
  suggestions: AISuggestion[]
  loading?: boolean
  placeholder?: string
  onClear?: () => void
  autoFocus?: boolean
  className?: string
  onEnter?: () => void
  onSuggestionSelect?: (suggestion: AISuggestion) => void
}

/**
 * Smart search input with AI-powered suggestions
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  suggestions,
  loading = false,
  placeholder = 'Search or ask anything...',
  onClear,
  autoFocus = false,
  className = '',
  onEnter,
  onSuggestionSelect,
}) => {
  // State for managing suggestions UI
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value) {
      setShowSuggestions(true)
      setActiveSuggestionIndex(-1)
    } else {
      setShowSuggestions(false)
    }
  }

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Enter key
    if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        // Select the active suggestion
        handleSuggestionSelect(suggestions[activeSuggestionIndex])
      } else {
        // Execute search
        onEnter?.()
      }
      setShowSuggestions(false)
    }

    // Arrow down
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!showSuggestions) {
        setShowSuggestions(true)
      }
      setActiveSuggestionIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
    }

    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev))
    }

    // Escape key
    else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion)
    }
  }

  // Clear search
  const handleClear = () => {
    setQuery('')
    setShowSuggestions(false)

    if (inputRef.current) {
      inputRef.current.focus()
    }

    if (onClear) {
      onClear()
    }
  }

  // Get the icon based on suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'search':
        return '🔍'
      case 'filter':
        return '🔖'
      case 'action':
        return '⚡'
      case 'content':
        return '📄'
      case 'completion':
        return '✏️'
      default:
        return '💡'
    }
  }

  return (
    <div className={`search-input-container ${className}`}>
      <div className="search-input-wrapper">
        {/* Search icon */}
        <span className="search-icon">🔍</span>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder={placeholder}
          className="search-input"
          autoComplete="off"
        />

        {/* Loading indicator */}
        {loading && (
          <span className="loading-indicator">
            {/* We would use a proper spinner component here */}⟳
          </span>
        )}

        {/* Clear button */}
        {query && (
          <button className="clear-button" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className="suggestions-dropdown">
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.type}-${index}`}
                className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                onClick={() => handleSuggestionSelect(suggestion)}
              >
                <span className="suggestion-icon">{getSuggestionIcon(suggestion.type)}</span>
                <span className="suggestion-text">{suggestion.text}</span>
                {suggestion.metadata?.basedOn && (
                  <span className="suggestion-source">
                    {suggestion.metadata.basedOn === 'history' && '(recent)'}
                    {suggestion.metadata.basedOn === 'content' && '(content)'}
                    {suggestion.metadata.basedOn === 'patterns' && '(popular)'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .search-input-container {
          position: relative;
          width: 100%;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          position: relative;
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          background-color: white;
          transition: all 0.2s;
        }

        .search-input-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .search-icon {
          margin-right: 0.5rem;
          color: #718096;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          line-height: 1.5;
        }

        .loading-indicator {
          display: inline-block;
          animation: spin 1s linear infinite;
          margin-left: 0.5rem;
          color: #718096;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .clear-button {
          background: none;
          border: none;
          color: #718096;
          cursor: pointer;
          padding: 0.25rem;
          margin-left: 0.5rem;
          border-radius: 9999px;
        }

        .clear-button:hover {
          background-color: #f7fafc;
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background-color: white;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
          z-index: 10;
          max-height: 16rem;
          overflow-y: auto;
        }

        .suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestion-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 1rem;
          cursor: pointer;
        }

        .suggestion-item:hover,
        .suggestion-item.active {
          background-color: #f7fafc;
        }

        .suggestion-icon {
          margin-right: 0.5rem;
        }

        .suggestion-text {
          flex: 1;
        }

        .suggestion-source {
          font-size: 0.75rem;
          color: #718096;
          margin-left: 0.5rem;
        }
      `}</style>
    </div>
  )
}

export default SearchInput
