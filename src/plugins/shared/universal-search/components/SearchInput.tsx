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
 * Enhanced with comprehensive accessibility features
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
  const [isFocused, setIsFocused] = useState(false)
  const [announcementText, setAnnouncementText] = useState('')

  // Refs
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const announcerRef = useRef<HTMLDivElement>(null)

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  // Announce suggestion changes to screen readers
  useEffect(() => {
    if (announcementText && announcerRef.current) {
      announcerRef.current.textContent = announcementText

      // Clear announcement after it's been read (approx. 3 seconds)
      const timer = setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = ''
          setAnnouncementText('')
        }
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [announcementText])

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
        // Select the active suggestion - fixed TypeScript error by ensuring suggestion exists
        const suggestion = suggestions[activeSuggestionIndex]
        if (suggestion) {
          handleSuggestionSelect(suggestion)
          // Announce selection to screen readers
          announceToScreenReader(`Selected suggestion: ${suggestion.text}`)
        }
      } else {
        // Execute search
        onEnter?.()
        // Announce search to screen readers
        announceToScreenReader(`Searching for: ${query}`)
      }
      setShowSuggestions(false)
    }

    // Arrow down
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!showSuggestions) {
        setShowSuggestions(true)
      }

      const newIndex =
        activeSuggestionIndex < suggestions.length - 1
          ? activeSuggestionIndex + 1
          : activeSuggestionIndex

      setActiveSuggestionIndex(newIndex)

      // Announce to screen readers - with null check
      if (newIndex >= 0 && newIndex < suggestions.length) {
        const suggestion = suggestions[newIndex]
        if (suggestion) {
          announceToScreenReader(
            `Suggestion ${newIndex + 1} of ${suggestions.length}: ${suggestion.text}`,
          )
        }
      }
    }

    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newIndex = activeSuggestionIndex > 0 ? activeSuggestionIndex - 1 : activeSuggestionIndex
      setActiveSuggestionIndex(newIndex)

      // Announce to screen readers - with null check
      if (newIndex >= 0 && newIndex < suggestions.length) {
        const suggestion = suggestions[newIndex]
        if (suggestion) {
          announceToScreenReader(
            `Suggestion ${newIndex + 1} of ${suggestions.length}: ${suggestion.text}`,
          )
        }
      }
    }

    // Escape key
    else if (e.key === 'Escape') {
      setShowSuggestions(false)
      // Announce to screen readers
      announceToScreenReader('Suggestions closed')
    }

    // Home key - navigate to first suggestion
    else if (e.key === 'Home' && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      setActiveSuggestionIndex(0)

      // Announce to screen readers - with null check
      const firstSuggestion = suggestions[0]
      if (firstSuggestion) {
        announceToScreenReader(`First suggestion: ${firstSuggestion.text}`)
      }
    }

    // End key - navigate to last suggestion
    else if (e.key === 'End' && showSuggestions && suggestions.length > 0) {
      e.preventDefault()
      setActiveSuggestionIndex(suggestions.length - 1)

      // Announce to screen readers - with null check
      const lastSuggestion = suggestions[suggestions.length - 1]
      if (lastSuggestion) {
        announceToScreenReader(`Last suggestion: ${lastSuggestion.text}`)
      }
    }
  }

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: AISuggestion) => {
    setQuery(suggestion.text)
    setShowSuggestions(false)

    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion)
    }

    // Return focus to input after selection
    if (inputRef.current) {
      inputRef.current.focus()
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

    // Announce to screen readers
    announceToScreenReader('Search cleared')
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

  // Helper to announce text to screen readers
  const announceToScreenReader = (text: string) => {
    setAnnouncementText(text)
  }

  return (
    <div className={`search-input-container ${className}`}>
      {/* Screen reader announcer */}
      <div ref={announcerRef} className="sr-only" aria-live="polite" aria-atomic="true"></div>

      {/* Accessible label for the search group */}
      <label htmlFor="universal-search-input" className="sr-only">
        Search job descriptions
      </label>

      <div className={`search-input-wrapper ${isFocused ? 'focused' : ''}`} role="search">
        {/* Search icon */}
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>

        {/* Input field with improved contrast and accessibility */}
        <input
          ref={inputRef}
          id="universal-search-input"
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            if (query) setShowSuggestions(true)
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search job descriptions"
          aria-autocomplete="list"
          aria-controls={showSuggestions ? 'search-suggestions' : undefined}
          aria-activedescendant={
            activeSuggestionIndex >= 0 ? `suggestion-${activeSuggestionIndex}` : undefined
          }
          aria-expanded={showSuggestions}
          autoComplete="off"
        />

        {/* Loading indicator */}
        {loading && (
          <span className="loading-indicator" aria-hidden="true">
            ⟳
          </span>
        )}

        {/* Loading indicator for screen readers */}
        {loading && (
          <span className="sr-only" aria-live="polite">
            Searching...
          </span>
        )}

        {/* Clear button */}
        {query && (
          <button
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            ✕
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="suggestions-dropdown"
          id="search-suggestions"
          role="listbox"
          aria-label="Search suggestions"
        >
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.type}-${index}`}
                id={`suggestion-${index}`}
                className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                onClick={() => handleSuggestionSelect(suggestion)}
                role="option"
                aria-selected={index === activeSuggestionIndex}
                tabIndex={-1}
              >
                <span className="suggestion-icon" aria-hidden="true">
                  {getSuggestionIcon(suggestion.type)}
                </span>
                <span className="suggestion-text">{suggestion.text}</span>
                {suggestion.metadata?.basedOn && (
                  <span
                    className="suggestion-source"
                    aria-label={`Source: ${suggestion.metadata.basedOn}`}
                  >
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

      {/* CSS variables-based styles for improved contrast and accessibility */}
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
          border: 2px solid var(--input-border, #d1d5db);
          border-radius: 0.375rem;
          padding: 0.5rem 1rem;
          background-color: var(--input-bg, #ffffff);
          transition: all 0.2s;
        }

        .search-input-wrapper.focused {
          border-color: var(--input-focus-border, #2563eb);
          box-shadow: 0 0 0 3px var(--input-focus-shadow, rgba(37, 99, 235, 0.2));
          outline: none;
        }

        .search-icon {
          margin-right: 0.5rem;
          color: var(--text-tertiary, #6b7280);
          font-size: 1rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          line-height: 1.5;
          color: var(--input-text, #1f2937);
          height: 1.5rem;
          min-height: 1.5rem;
        }

        /* Improved placeholder contrast */
        .search-input::placeholder {
          color: var(--input-placeholder, #6b7280);
          opacity: 1; /* Override default opacity */
        }

        .loading-indicator {
          display: inline-block;
          animation: spin 1s linear infinite;
          margin-left: 0.5rem;
          color: var(--text-tertiary, #6b7280);
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
          color: var(--text-tertiary, #6b7280);
          cursor: pointer;
          padding: 0.25rem;
          margin-left: 0.5rem;
          border-radius: 9999px;
          min-height: 36px;
          min-width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .clear-button:hover {
          background-color: var(--background-tertiary, #f3f4f6);
        }

        .clear-button:focus-visible {
          outline: 2px solid var(--focus-ring, #2563eb);
          outline-offset: 2px;
        }

        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background-color: var(--background-primary, #ffffff);
          border: 1px solid var(--border-medium, #d1d5db);
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
          padding: 0.75rem 1rem;
          cursor: pointer;
          color: var(--text-primary, #1f2937);
          transition: background-color 0.2s;
        }

        .suggestion-item:hover,
        .suggestion-item.active {
          background-color: var(--background-secondary, #f3f4f6);
        }

        .suggestion-item:focus {
          outline: 2px solid var(--focus-ring, #2563eb);
          outline-offset: -2px;
        }

        .suggestion-icon {
          margin-right: 0.75rem;
          font-size: 1rem;
        }

        .suggestion-text {
          flex: 1;
          font-size: 1rem;
        }

        .suggestion-source {
          font-size: 0.75rem;
          color: var(--text-tertiary, #6b7280);
          margin-left: 0.5rem;
        }

        /* Screen reader only style */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* High contrast mode support */
        @media (forced-colors: active) {
          .search-input-wrapper {
            border: 2px solid CanvasText;
          }

          .search-input-wrapper.focused {
            outline: 2px solid Highlight;
            outline-offset: 2px;
          }

          .clear-button {
            border: 1px solid CanvasText;
          }

          .suggestion-item.active {
            background-color: Highlight;
            color: HighlightText;
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .search-input-wrapper,
          .suggestion-item {
            transition: none;
          }
        }
      `}</style>
    </div>
  )
}

export default SearchInput
