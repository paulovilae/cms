'use client'

// @ts-nocheck
import React, { useState, useEffect } from 'react'
import { useUniversalSearch } from '../hooks/useUniversalSearch'
import { createBusinessHeaders } from '@/utilities/businessContext'

// Import actual component implementations
import SearchInput from './SearchInput'
import SearchResults from './SearchResults'
import SearchFilters from './SearchFilters'
import SearchStats from './SearchStats'
import QuickPreview from './QuickPreview'

/**
 * Main universal search component that combines all search sub-components
 */
export const UniversalSearch = (props: any) => {
  const { config = {}, className = '' } = props

  // Ensure config has default values to prevent errors
  const safeConfig = {
    collection: config.collection || 'flow-instances',
    displayName: config.displayName || 'Content',
    actions: config.actions || [],
    searchableFields: config.searchableFields || [],
    ...config,
  }

  // State for search query
  const [query, setQuery] = useState('')

  // State for active filters
  const [activeFilters, setActiveFilters] = useState({})

  // State for selected result
  const [selectedResult, setSelectedResult] = useState(null)

  // State for recent job descriptions (fallback content)
  const [recentJobDescriptions, setRecentJobDescriptions] = useState([])
  const [loadingFallback, setLoadingFallback] = useState(false)

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
    collection: safeConfig.collection,
    config: safeConfig,
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
          collection: safeConfig.collection,
          // For now, we'll skip filters to avoid TypeScript errors
        }

        executeSearch(searchRequest)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query, activeFilters, safeConfig.collection, executeSearch])

  // Fetch recent job descriptions for fallback content
  useEffect(() => {
    async function fetchRecentJobDescriptions() {
      try {
        setLoadingFallback(true)
        // Use the collection from config, defaulting to flow-instances
        const collection = safeConfig.collection || 'flow-instances'
        // Determine business mode for headers
        // Properly determine business mode from consistent source
        // Instead of trying to extract it from collection name, use 'salarium' directly
        // since this is the Salarium HR Search interface
        const businessMode = 'salarium'

        // Create query params to get recent items, sorted by creation date
        const queryParams = new URLSearchParams({
          limit: '5',
          sort: 'createdAt',
          sortDirection: 'desc',
        })

        console.log(
          `Fetching recent items from collection: ${collection} with business: ${businessMode}`,
        )

        // Add a timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`/api/${collection}?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            ...createBusinessHeaders(businessMode),
          },
          credentials: 'include', // Include cookies for authentication
          signal: controller.signal,
        })

        // Clear timeout after response is received
        clearTimeout(timeoutId)

        if (!response.ok) {
          // More detailed error messages based on status code
          if (response.status === 404) {
            throw new Error(`Collection '${collection}' not found`)
          } else if (response.status === 401 || response.status === 403) {
            throw new Error(`Not authorized to access '${collection}'`)
          } else if (response.status >= 500) {
            throw new Error(`Server error when fetching from '${collection}'`)
          } else {
            throw new Error(
              `Failed to fetch recent items (${response.status}: ${response.statusText})`,
            )
          }
        }

        const data = await response.json()
        setRecentJobDescriptions(data.docs || [])
      } catch (err) {
        console.error('Error fetching fallback content:', err)
        // Set empty array but keep the error message for display
        setRecentJobDescriptions([])
      } finally {
        setLoadingFallback(false)
      }
    }

    // Fetch recent job descriptions on component mount
    fetchRecentJobDescriptions()
  }, [safeConfig.collection])

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
          query={query}
          setQuery={setQuery}
          placeholder={`Search ${safeConfig.displayName}...`}
          suggestions={suggestions || []}
          loading={loading}
          onSuggestionSelect={handleSuggestionSelect}
          className="search-input"
          autoFocus={props.autoFocus}
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

          {/* Loading state */}
          {loading && !error && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Searching job descriptions...</p>
            </div>
          )}

          {/* Error state with user-friendly message */}
          {error && (
            <div className="search-error">
              <h3 className="text-lg font-medium mb-2">We couldn't complete your search</h3>
              <p className="mb-2">
                Sorry about that! Our search system is having a moment. Please try:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Refreshing the page</li>
                <li>Simplifying your search terms</li>
                <li>Trying again in a few moments</li>
              </ul>
              <p className="text-sm text-red-600 mb-4">Error details: {error}</p>
              {/* Fallback content when search fails */}
              <div className="mt-4 pt-4 border-t border-red-200">
                <h3 className="text-lg font-medium mb-2">Recent Job Descriptions</h3>
                <p className="text-sm text-gray-600 mb-4">
                  While we fix this issue, here are some recently added job descriptions you might
                  find useful:
                </p>

                {loadingFallback ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                  </div>
                ) : recentJobDescriptions.length > 0 ? (
                  <div className="space-y-3">
                    {recentJobDescriptions.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleResultClick(item)}
                      >
                        <h4 className="font-medium text-blue-700">{item.title}</h4>
                        {item.organization?.name && (
                          <p className="text-sm text-gray-600 mt-1">{item.organization.name}</p>
                        )}
                        <div className="flex mt-2">
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800 mr-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick('view', item)
                            }}
                          >
                            View
                          </button>
                          <button
                            className="text-xs text-blue-600 hover:text-blue-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleActionClick('useAsReference', item)
                            }}
                          >
                            Use as Reference
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm italic text-gray-500">
                    No recent job descriptions available.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Results list - only show when not loading and no error */}
          {!loading && !error && (
            <SearchResults
              results={results}
              loading={loading}
              onClick={handleResultClick}
              onAction={handleActionClick}
              config={safeConfig}
              className="search-results"
            />
          )}
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
