import { useState, useCallback, useEffect, useRef } from 'react'
import { createBusinessHeaders } from '@/utilities/businessContext'
import type {
  SearchRequest,
  SearchResponse,
  UniversalSearchResult,
  SearchFilters,
  SearchSort,
  SearchPagination,
  SearchFacets,
} from '../types/search.types'
import type { AISuggestion } from '../types/semantic.types'
import type { UniversalSearchConfig } from '../types/config.types'

// Simple debounce implementation to avoid external dependencies
function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }
}

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
  const [facets, setFacets] = useState<SearchFacets>({
    collections: [],
    statuses: [],
    tags: [],
    categories: [],
    authors: [],
  })
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
    setFacets({
      collections: [],
      statuses: [],
      tags: [],
      categories: [],
      authors: [],
    })
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
        sort: options.sort || (activeSort as SearchSort | undefined),
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
        // Build Payload compatible query
        const queryParams = new URLSearchParams()

        // Add search query
        if (searchRequest.query?.trim()) {
          // Add OR conditions for multiple field search
          const orConditions = []

          if (config.searchableFields && Array.isArray(config.searchableFields)) {
            // Use search fields from config
            config.searchableFields.forEach((field: any) => {
              if (field.name) {
                orConditions.push({
                  [field.name]: {
                    like: searchRequest.query,
                  },
                })
              }
            })
          } else {
            // Fallback to basic search on title
            orConditions.push({
              title: {
                like: searchRequest.query,
              },
            })
          }

          // Set the where parameter with OR conditions
          queryParams.set('where', JSON.stringify({ or: orConditions }))
        }

        // Add filters
        if (searchRequest.filters && Object.keys(searchRequest.filters).length > 0) {
          const whereConditions = queryParams.has('where')
            ? JSON.parse(queryParams.get('where') || '{}')
            : {}

          // Convert filters to Payload format
          Object.entries(searchRequest.filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
              whereConditions[key] = { in: value }
            } else if (value !== null && value !== undefined) {
              whereConditions[key] = { equals: value }
            }
          })

          queryParams.set('where', JSON.stringify(whereConditions))
        }

        // Add pagination
        if (searchRequest.pagination) {
          queryParams.set('page', searchRequest.pagination.page.toString())
          queryParams.set('limit', searchRequest.pagination.limit.toString())
        } else {
          queryParams.set('page', '1')
          queryParams.set('limit', '20')
        }

        // Add sorting
        if (searchRequest.sort?.field) {
          queryParams.set('sort', searchRequest.sort.field)
          queryParams.set('sortDirection', searchRequest.sort.direction || 'desc')
        }

        // Use standard Payload API with typed business mode
        const safeCollection = collection || 'flow-instances' // Provide a fallback collection

        // Always use explicit business mode for Salarium HR search context
        // Instead of trying to extract from collection name, which can be unreliable
        const businessMode = 'salarium'

        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        let timeoutId: ReturnType<typeof setTimeout> | null = null

        try {
          // Set timeout to abort request after 10 seconds
          timeoutId = setTimeout(() => controller.abort(), 10000)

          // Log the request for debugging
          console.log(`Search request to: /api/${safeCollection} - Business: ${businessMode}`)

          const response = await fetch(`/api/${safeCollection}?${queryParams}`, {
            headers: {
              'Content-Type': 'application/json',
              ...createBusinessHeaders(businessMode),
            },
            credentials: 'include', // Include cookies for authentication
            signal: controller.signal,
          })

          // Clear timeout after response is received
          if (timeoutId) clearTimeout(timeoutId)

          if (!response.ok) {
            // More detailed error messages for debugging and user feedback
            if (response.status === 404) {
              throw new Error(
                `Collection '${safeCollection}' not found. Please verify configuration.`,
              )
            } else if (response.status === 401 || response.status === 403) {
              throw new Error(`Not authorized to access '${safeCollection}'. Check permissions.`)
            } else if (response.status >= 500) {
              throw new Error(
                `Server error when searching in '${safeCollection}'. Status: ${response.status}`,
              )
            } else {
              const responseText = await response.text()
              console.error(`API error response: ${responseText}`)
              throw new Error(
                `Search failed (${response.status}: ${response.statusText}). Please try again.`,
              )
            }
          }

          // Transform Payload response to our format
          const payloadResponse = await response.json()

          // Log response structure for debugging
          console.log(`Search results count: ${payloadResponse.docs?.length || 0}`)

          // Convert to our search response format
          const data: SearchResponse = {
            results: payloadResponse.docs.map((doc: any) => ({
              id: doc.id,
              title: doc.title,
              content: doc.content,
              metadata: doc,
              // Add highlights based on query if needed
              highlights: searchRequest.query
                ? [
                    {
                      text: doc.title.replace(
                        new RegExp(searchRequest.query, 'gi'),
                        (match: string) => `<mark>${match}</mark>`,
                      ),
                    },
                  ]
                : undefined,
            })),
            totalCount: payloadResponse.totalDocs,
            facets: {
              collections: [],
              statuses: [],
              tags: [],
              categories: [],
              authors: [],
            },
            searchTime: 0, // We'll calculate this separately
            query: searchRequest.query || '',
          }

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
              if (firstKey) {
                cacheRef.current.delete(firstKey)
              }
            }
          }
        } catch (innerError) {
          // Re-throw the error to be caught by the outer catch block
          throw innerError
        }
      } catch (err) {
        // Clear timeout - not needed here since we're doing it in the inner try/catch

        // Log the full error for debugging but only show user-friendly messages to the user
        console.error('Search error:', err)

        // Create a user-friendly error message with more detail for debugging
        let userFriendlyError = 'An error occurred while searching. Please try again later.'

        // Only extract message from Error objects, never display raw JSON responses
        if (err instanceof Error) {
          // Check if it's a network error
          if (err.name === 'AbortError') {
            userFriendlyError =
              'Search request timed out after 10 seconds. Please try a simpler search query.'
          } else if (
            err.message.includes('NetworkError') ||
            err.message.includes('Failed to fetch')
          ) {
            userFriendlyError =
              'Unable to connect to search service. Please check your network connection and try again.'
          } else if (err.message.includes('timeout') || err.message.includes('Timeout')) {
            userFriendlyError = 'Search request timed out. Please try a simpler search query.'
          } else if (err.message.includes('permission') || err.message.includes('authorized')) {
            userFriendlyError = "You don't have permission to search this content."
          } else if (!err.message.includes('JSON')) {
            // Only use error message if it's not a JSON parsing error
            userFriendlyError = `${err.message} (${collection})`
          }
        }

        console.log(`Setting error: ${userFriendlyError}`)
        setError(userFriendlyError)
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

  // Fetch suggestions using standard Payload API
  const fetchSuggestions = useCallback(
    debounce(async (newQuery: string) => {
      if (!newQuery.trim() || !aiEnabled) {
        setSuggestions([])
        return
      }

      // Create a simple query to find relevant content
      const queryParams = new URLSearchParams()

      // Search for relevant content with this query
      queryParams.set(
        'where',
        JSON.stringify({
          title: { like: newQuery },
        }),
      )

      // Limit to 5 results
      queryParams.set('limit', '5')

      // Only get title field
      queryParams.set('fields', 'title')

      // Use standard Payload API with consistent business mode
      const safeCollection = collection || 'flow-instances' // Provide a fallback collection

      // Use the same explicit business mode as in the search function
      const businessMode = 'salarium'

      // Add timeout to prevent hanging requests
      const controller = new AbortController()
      let timeoutId: ReturnType<typeof setTimeout> | null = null

      try {
        // Set timeout for request
        timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        console.log(`Suggestions request to: /api/${safeCollection} - Business: ${businessMode}`)

        const response = await fetch(`/api/${safeCollection}?${queryParams}`, {
          headers: {
            'Content-Type': 'application/json',
            ...createBusinessHeaders(businessMode),
          },
          credentials: 'include', // Include cookies for authentication
          signal: controller.signal,
        })

        // Clear timeout after response
        if (timeoutId) clearTimeout(timeoutId)

        if (!response.ok) {
          // User-friendly error for suggestions with more details for debugging
          throw new Error(
            `Unable to load suggestions (${response.status}). Please try typing your full search query.`,
          )
        }

        const data = await response.json()

        // Convert payload results to suggestion format with proper typing
        const fetchedSuggestions = data.docs.map((doc: any) => ({
          type: 'search' as const,
          text: doc.title,
          confidence: 0.9,
          reasoning: 'Based on existing content',
          metadata: {
            basedOn: 'content' as const,
            id: doc.id,
          },
        }))

        // Add the exact query as a suggestion too
        if (!fetchedSuggestions.some((s: any) => s.text.toLowerCase() === newQuery.toLowerCase())) {
          fetchedSuggestions.unshift({
            type: 'search' as const,
            text: newQuery,
            confidence: 1.0,
            reasoning: 'Exact user query',
            metadata: {
              basedOn: 'content' as const,
            },
          })
        }

        setSuggestions(fetchedSuggestions)
      } catch (err) {
        // Clear timeout if there was an error
        if (timeoutId) clearTimeout(timeoutId)

        // Log error but don't show to user - just fail silently for suggestions
        console.error('Suggestions error:', err)
        setSuggestions([])
        // Don't set error state for suggestion failures - they're not critical
      }
    }, debounceMs),
    [collection, aiEnabled, debounceMs],
  )

  // Handle action on search result
  const handleAction = useCallback(
    (actionId: string, result: UniversalSearchResult) => {
      // Find the action in the config
      const actionConfig = config.actions?.find((action) => action.id === actionId)

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
