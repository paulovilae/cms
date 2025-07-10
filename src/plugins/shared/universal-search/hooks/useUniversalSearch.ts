import { useState, useCallback, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { createBusinessHeaders } from '@/utilities/businessContext'
import type {
  SearchRequest,
  SearchResponse,
  UniversalSearchResult,
  SearchFilters,
  SearchSort,
  SearchPagination,
} from '../types/search.types'
import type { AISuggestion } from '../types/semantic.types'
import type { UniversalSearchConfig } from '../types/config.types'

interface UseUniversalSearchOptions {
  collection: string
  config: UniversalSearchConfig
  initialQuery?: string
  debounceMs?: number
  aiEnabled?: boolean
  cacheEnabled?: boolean
}

interface UseUniversalSearchReturn {
  query: string
  setQuery: (query: string) => void
  results: UniversalSearchResult[]
  totalCount: number
  facets: any
  loading: boolean
  error: string | null
  suggestions: AISuggestion[]
  activeFilters: SearchFilters
  setActiveFilters: (filters: SearchFilters) => void
  activeSort: SearchSort | null
  setActiveSort: (sort: SearchSort | null) => void
  pagination: SearchPagination
  setPagination: (pagination: SearchPagination) => void
  selectedResult: UniversalSearchResult | null
  setSelectedResult: (result: UniversalSearchResult | null) => void
  executeSearch: (options?: Partial<SearchRequest>) => Promise<void>
  clearSearch: () => void
  handleAction: (actionId: string, result: UniversalSearchResult) => void
  searchTime: number
}

/**
 * Hook for Universal AI-Powered Search functionality
 */
export const useUniversalSearch = ({
  collection,
  config,
  initialQuery = '',
  debounceMs = 150,
  aiEnabled = true,
  cacheEnabled = true,
}: UseUniversalSearchOptions): UseUniversalSearchReturn => {
  // State for search query and results
  const [query, setQueryInternal] = useState(initialQuery)
  const [results, setResults] = useState<UniversalSearchResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [facets, setFacets] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [searchTime, setSearchTime] = useState(0)

  // State for search parameters
  const [activeFilters, setActiveFilters] = useState<SearchFilters>({})
  const [activeSort, setActiveSort] = useState<SearchSort | null>(null)
  const [pagination, setPagination] = useState<SearchPagination>({
    page: 1,
    limit: 20,
  })

  // State for selected result
  const [selectedResult, setSelectedResult] = useState<UniversalSearchResult | null>(null)

  // Cache for search results
  const cacheRef = useRef<Map<string, SearchResponse>>(new Map())

  // Helper to build cache key
  const buildCacheKey = useCallback(
    (searchParams: Partial<SearchRequest>) => {
      return JSON.stringify({
        query: searchParams.query || query,
        collection,
        filters: searchParams.filters || activeFilters,
        sort: searchParams.sort || activeSort,
        pagination: searchParams.pagination || pagination,
      })
    },
    [query, collection, activeFilters, activeSort, pagination],
  )

  // Set query with debounce
  const setQuery = useCallback((newQuery: string) => {
    setQueryInternal(newQuery)
  }, [])

  // Clear search
  const clearSearch = useCallback(() => {
    setQueryInternal('')
    setResults([])
    setTotalCount(0)
    setFacets({})
    setActiveFilters({})
    setActiveSort(null)
    setPagination({ page: 1, limit: 20 })
    setSelectedResult(null)
  }, [])

  // Execute search
  const executeSearch = useCallback(
    async (options: Partial<SearchRequest> = {}) => {
      const searchQuery = options.query || query

      // Skip empty searches
      if (!searchQuery.trim() && !options.filters && Object.keys(activeFilters).length === 0) {
        setResults([])
        setTotalCount(0)
        return
      }

      // Set loading state
      setLoading(true)
      setError(null)

      // Build search request
      const searchRequest: SearchRequest = {
        query: searchQuery,
        collection,
        filters: options.filters || activeFilters,
        sort: options.sort || activeSort,
        pagination: options.pagination || pagination,
        options: {
          includeHighlights: true,
          semanticSearch: aiEnabled,
          fuzzySearch: true,
        },
      }

      // Check cache if enabled
      const cacheKey = buildCacheKey(searchRequest)
      if (cacheEnabled && cacheRef.current.has(cacheKey)) {
        const cachedResponse = cacheRef.current.get(cacheKey)
        if (cachedResponse) {
          setResults(cachedResponse.results)
          setTotalCount(cachedResponse.totalCount)
          setFacets(cachedResponse.facets)
          setSearchTime(cachedResponse.searchTime)
          setLoading(false)
          return
        }
      }

      try {
        // Call search API
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...createBusinessHeaders(collection.split('-')[0] || 'default'),
          },
          body: JSON.stringify(searchRequest),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || `Search failed with status: ${response.status}`)
        }

        const data: SearchResponse = await response.json()

        // Update state with search results
        setResults(data.results)
        setTotalCount(data.totalCount)
        setFacets(data.facets)
        setSearchTime(data.searchTime)

        // Cache the results if enabled
        if (cacheEnabled) {
          cacheRef.current.set(cacheKey, data)

          // Limit cache size to 100 entries
          if (cacheRef.current.size > 100) {
            const firstKey = cacheRef.current.keys().next().value
            cacheRef.current.delete(firstKey)
          }
        }
      } catch (err) {
        console.error('Search error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred during search')
        setResults([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    },
    [
      query,
      collection,
      activeFilters,
      activeSort,
      pagination,
      aiEnabled,
      cacheEnabled,
      buildCacheKey,
    ],
  )

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((newQuery: string) => {
      executeSearch({ query: newQuery })
    }, debounceMs),
    [executeSearch, debounceMs],
  )

  // Fetch suggestions
  const fetchSuggestions = useCallback(
    debounce(async (newQuery: string) => {
      if (!newQuery.trim() || !aiEnabled) {
        setSuggestions([])
        return
      }

      try {
        const response = await fetch('/api/search/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...createBusinessHeaders(collection.split('-')[0] || 'default'),
          },
          body: JSON.stringify({
            query: newQuery,
            collection,
            limit: 5,
          }),
        })

        if (!response.ok) {
          throw new Error(`Suggestions failed with status: ${response.status}`)
        }

        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (err) {
        console.error('Suggestions error:', err)
        setSuggestions([])
      }
    }, debounceMs),
    [collection, aiEnabled, debounceMs],
  )

  // Handle action on search result
  const handleAction = useCallback(
    (actionId: string, result: UniversalSearchResult) => {
      // Find the action in the config
      const actionConfig = config.actions.find((action) => action.id === actionId)

      if (actionConfig && result) {
        console.log(`Executing action: ${actionId} on result:`, result)

        // Here we would implement the action handler logic
        // For now, just logging the action

        // In a real implementation, we would trigger the appropriate action
        // based on the actionId and the result
      }
    },
    [config],
  )

  // Effect to trigger search when query changes
  useEffect(() => {
    if (query) {
      debouncedSearch(query)
      fetchSuggestions(query)
    } else {
      setResults([])
      setTotalCount(0)
      setSuggestions([])
    }
  }, [query, debouncedSearch, fetchSuggestions])

  // Effect to trigger search when filters or sort change
  useEffect(() => {
    if (query || Object.keys(activeFilters).length > 0) {
      executeSearch()
    }
  }, [activeFilters, activeSort, pagination, executeSearch, query])

  return {
    query,
    setQuery,
    results,
    totalCount,
    facets,
    loading,
    error,
    suggestions,
    activeFilters,
    setActiveFilters,
    activeSort,
    setActiveSort,
    pagination,
    setPagination,
    selectedResult,
    setSelectedResult,
    executeSearch,
    clearSearch,
    handleAction,
    searchTime,
  }
}
