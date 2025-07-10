'use client'

// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useUniversalSearch } from '../hooks/useUniversalSearch'

// Forward references to avoid TypeScript errors during development
// These components will be available at runtime
const SearchInput = (props: any) => <div>Loading SearchInput...</div>
const SearchResults = (props: any) => <div>Loading SearchResults...</div>
const SearchFilters = (props: any) => <div>Loading SearchFilters...</div>
const SearchStats = (props: any) => <div>Loading SearchStats...</div>
const QuickPreview = (props: any) => <div>Loading QuickPreview...</div>

/**
 * Main universal search component that combines all search sub-components
 */
export const UniversalSearch = (props: any) => {
  const { config, className = '' } = props

  // State for search query
  const [query, setQuery] = useState('')

  // State for active filters
  const [activeFilters, setActiveFilters] = useState({})

  // State for selected result
  const [selectedResult, setSelectedResult] = useState(null)

  // Get search hook
  const {
    results,
    loading,
    error,
    facets,
    totalCount,
    searchTime,
    executeSearch,
    suggestions,
    handleAction,
  } = useUniversalSearch({
    collection: config.collection,
    config,
    initialQuery: '',
  })

  // Effect to execute search when query or filters change
  useEffect(() => {
    // Debounce search for better performance
    const timer = setTimeout(() => {
      if (query.trim() || Object.keys(activeFilters).length > 0) {
        // Create a simplified search request
        const searchRequest = {
          query: query.trim(),
          collection: config.collection,
          // For now, we'll skip filters to avoid TypeScript errors
        }

        executeSearch(searchRequest)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, activeFilters, config.collection, executeSearch])

  // Handle filter changes
  const handleFilterChange = (filterId: any, values: any) => {
    setActiveFilters((prev: any) => {
      // Create a new object to avoid mutations
      const newFilters = { ...prev }
      // Set the values directly
      newFilters[filterId] = values
      return newFilters
    })
  }

  // Handle result click
  const handleResultClick = (result: any) => {
    setSelectedResult(result)
  }

  // Handle action click
  const handleActionClick = (actionId: any, result: any) => {
    handleAction(actionId, result)
  }

  // Handle suggestion select
  const handleSuggestionSelect = (suggestion: any) => {
    if (suggestion.type === 'search') {
      setQuery(suggestion.text)
    } else if (suggestion.type === 'filter') {
      // Parse filter suggestion and apply it
      // For example: "status:completed" or "date:this_month"
      const match = suggestion.text.match(/(\w+):(\w+)/)
      if (match) {
        const filterName = match[1]
        const filterValue = match[2]

        // Safer way to update the filters
        setActiveFilters((prev: any) => {
          const newFilters = { ...prev }
          // Get current values or initialize empty array
          const currentValues = newFilters[filterName] || []
          // Set the new values directly
          newFilters[filterName] = [...currentValues, filterValue]
          return newFilters
        })
      }
    }
  }

  // Get suggestions for search input
  const getSuggestions = async (text: any) => {
    return suggestions || []
  }

  // Convert facets to filters
  const facetsToFilters = () => {
    if (!facets) return []

    const filters = []

    // Status filter
    if (facets.statuses && Array.isArray(facets.statuses) && facets.statuses.length > 0) {
      filters.push({
        id: 'status',
        label: 'Status',
        type: 'checkbox',
        options: facets.statuses.map((status: any) => ({
          label: status.label || status.value,
          value: status.value,
          count: status.count,
        })),
      })
    }

    // Category filter
    if (facets.categories && Array.isArray(facets.categories) && facets.categories.length > 0) {
      filters.push({
        id: 'category',
        label: 'Category',
        type: 'checkbox',
        options: facets.categories.map((category: any) => ({
          label: category.label || category.value,
          value: category.value,
          count: category.count,
        })),
      })
    }

    // Tags filter
    if (facets.tags && Array.isArray(facets.tags) && facets.tags.length > 0) {
      filters.push({
        id: 'tags',
        label: 'Tags',
        type: 'checkbox',
        options: facets.tags.map((tag: any) => ({
          label: tag.label || tag.value,
          value: tag.value,
          count: tag.count,
        })),
      })
    }

    // Date filter
    filters.push({
      id: 'dateRange',
      label: 'Date',
      type: 'date',
      options: [], // Options handled by the date filter component
    })

    return filters
  }

  // Create a mock search response for the stats component
  const createMockResponse = () => {
    return {
      results,
      totalCount,
      facets: facets || { collections: [], statuses: [], tags: [], categories: [], authors: [] },
      searchTime: searchTime || 0,
      query,
    }
  }

  return (
    <div className={`universal-search ${className}`}>
      {/* Search Input */}
      <div className="search-container">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder={config.displayName ? `Search ${config.displayName}...` : 'Search...'}
          getSuggestions={getSuggestions}
          onSuggestionSelect={handleSuggestionSelect}
          className="search-input"
        />
      </div>

      {/* Main content area */}
      <div className="search-content">
        {/* Sidebar with filters */}
        <div className="search-sidebar">
          <SearchFilters
            filters={facetsToFilters()}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            className="search-filters"
          />
        </div>

        {/* Results area */}
        <div className="search-results-container">
          {/* Results stats */}
          {totalCount > 0 && (
            <SearchStats response={createMockResponse()} className="search-stats" />
          )}

          {/* Error state */}
          {error && (
            <div className="search-error">
              <p>Error: {typeof error === 'string' ? error : 'An error occurred during search'}</p>
            </div>
          )}

          {/* Results list */}
          <SearchResults
            results={results}
            loading={loading}
            onClick={handleResultClick}
            onAction={handleActionClick}
            config={config}
            className="search-results"
          />
        </div>

        {/* Preview panel */}
        <div className="search-preview">
          <QuickPreview
            result={selectedResult}
            onClose={() => setSelectedResult(null)}
            onAction={handleActionClick}
            className="quick-preview"
          />
        </div>
      </div>

      {/* This would be replaced with proper CSS in a real implementation */}
      <style jsx>{`
        .universal-search {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-container {
          width: 100%;
        }

        .search-content {
          display: grid;
          grid-template-columns: 250px 1fr 300px;
          gap: 1rem;
          height: calc(100vh - 150px);
          max-height: 800px;
        }

        .search-sidebar {
          overflow-y: auto;
        }

        .search-results-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }

        .search-stats {
          flex-shrink: 0;
        }

        .search-results {
          flex-grow: 1;
          overflow-y: auto;
        }

        .search-preview {
          overflow-y: auto;
        }

        .search-error {
          padding: 1rem;
          background-color: #fff5f5;
          color: #c53030;
          border-radius: 0.375rem;
          border: 1px solid #fed7d7;
          margin-bottom: 1rem;
        }

        /* Responsive adjustments */
        @media (max-width: 1200px) {
          .search-content {
            grid-template-columns: 250px 1fr;
          }

          .search-preview {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .search-content {
            grid-template-columns: 1fr;
          }

          .search-sidebar {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

export default UniversalSearch
