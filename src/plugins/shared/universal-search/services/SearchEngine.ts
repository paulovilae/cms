import type { Payload } from 'payload'
import type { User } from 'payload/auth'
import type {
  SearchRequest,
  SearchResponse,
  UniversalSearchResult,
  SearchFilters,
  SearchSort,
  SearchPagination,
  SearchFacets,
  FacetItem,
} from '../types/search.types'
import { SemanticResult, SemanticSearchRequest } from '../types/semantic.types'

interface SearchEngineOptions {
  payload: Payload
  user?: User | null
  business?: string
  cacheEnabled?: boolean
}

interface SearchOptions {
  collection?: string
  filters?: SearchFilters
  sort?: SearchSort
  pagination?: SearchPagination
  semanticResults?: SemanticResult[]
  includeHighlights?: boolean
  maxResults?: number
}

interface SearchEngineResponse {
  items: UniversalSearchResult[]
  totalCount: number
  facets: SearchFacets
  suggestions: string[]
}

interface SemanticSearchOptions {
  filters?: SearchFilters
  user?: User | null
  business?: string
}

/**
 * Universal search engine that powers the AI-enhanced search functionality
 * across all collections and business units.
 */
export class SearchEngine {
  private payload: Payload
  private user?: User | null
  private business?: string
  private cacheEnabled: boolean
  private cacheStore: Map<string, { data: any; timestamp: number }>

  constructor(options: SearchEngineOptions) {
    this.payload = options.payload
    this.user = options.user
    this.business = options.business
    this.cacheEnabled = options.cacheEnabled !== false
    this.cacheStore = new Map()
  }

  /**
   * Perform a search across the specified collection(s)
   */
  async search(query: string, options: SearchOptions): Promise<SearchEngineResponse> {
    // For initial implementation, we'll use a simplified search approach
    // with a plan to enhance this with more sophisticated features later

    console.log(`Searching for "${query}" in ${options.collection || 'all collections'}`)

    const {
      collection,
      filters,
      sort,
      pagination,
      semanticResults = [],
      includeHighlights = true,
      maxResults = 50,
    } = options

    // Check cache first if enabled
    const cacheKey = this.buildCacheKey(query, options)
    if (this.cacheEnabled) {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        console.log('Cache hit for query:', query)
        return cached as SearchEngineResponse
      }
    }

    try {
      // Phase 1: Implementation uses the search-index collection
      // In the future, we can enhance this with direct collection searching

      // Build search query
      const searchQuery: any = {
        where: {
          and: [
            {
              searchableText: {
                like: query,
              },
            },
          ],
        },
        limit: pagination?.limit || 20,
        page: pagination?.page || 1,
      }

      // Add collection filter if specified
      if (collection) {
        searchQuery.where.and.push({
          collection: {
            equals: collection,
          },
        })
      }

      // Add status filter (always show active items)
      searchQuery.where.and.push({
        status: {
          equals: 'active',
        },
      })

      // Add custom filters
      if (filters) {
        if (filters.status?.length) {
          searchQuery.where.and.push({
            'metadata.status': {
              in: filters.status,
            },
          })
        }

        if (filters.tags?.length) {
          searchQuery.where.and.push({
            'tags.tag': {
              in: filters.tags,
            },
          })
        }

        if (filters.dateRange) {
          const { field, from, to } = filters.dateRange
          const dateFilter: any = {}

          if (from) {
            dateFilter.greater_than_equal = new Date(from)
          }

          if (to) {
            dateFilter.less_than_equal = new Date(to)
          }

          if (Object.keys(dateFilter).length) {
            const fieldPath = `metadata.${field}`
            searchQuery.where.and.push({
              [fieldPath]: dateFilter,
            })
          }
        }
      }

      // Add sort if specified
      if (sort) {
        searchQuery.sort = {
          [sort.field]: sort.direction,
        }
      } else {
        // Default sort by search score
        searchQuery.sort = {
          searchScore: 'desc',
        }
      }

      // Execute search
      const searchResults = await this.payload.find({
        collection: 'search-index',
        ...searchQuery,
      })

      // Process and format results
      const items = this.processSearchResults(searchResults.docs, {
        includeHighlights,
        query,
      })

      // Combine with semantic results if available
      let combinedResults = items
      if (semanticResults?.length) {
        combinedResults = this.combineResults(items, semanticResults)
      }

      // Limit results to max specified
      if (combinedResults.length > maxResults) {
        combinedResults = combinedResults.slice(0, maxResults)
      }

      // Generate facets
      const facets = this.generateFacets(searchResults.docs)

      // Generate suggestions (placeholder for now)
      const suggestions: string[] = []

      // Create response
      const response: SearchEngineResponse = {
        items: combinedResults,
        totalCount: searchResults.totalDocs,
        facets,
        suggestions,
      }

      // Cache results if enabled
      if (this.cacheEnabled) {
        this.setCache(cacheKey, response)
      }

      return response
    } catch (error) {
      console.error('Search engine error:', error)
      throw error
    }
  }

  /**
   * Perform a semantic search using AI to understand query intent and meaning
   */
  async semanticSearch(
    query: string,
    collection?: string,
    options: SemanticSearchOptions = {},
  ): Promise<SemanticResult[]> {
    console.log(`Semantic search for "${query}" in ${collection || 'all collections'}`)

    // Phase 1: This is a placeholder for the AI-powered semantic search
    // In future iterations, this will connect to the AI provider

    // For now, return an empty array
    // The actual implementation will come later
    return []
  }

  /**
   * Process search results into the universal format
   */
  private processSearchResults(
    results: any[],
    options: { includeHighlights: boolean; query: string },
  ): UniversalSearchResult[] {
    return results.map((result) => {
      // Transform to universal search result format
      const searchResult: UniversalSearchResult = {
        id: result.id,
        collection: result.collection,
        title: result.title,
        content: result.content || '',
        score: result.searchScore || 0,
        highlights: options.includeHighlights ? this.generateHighlights(result, options.query) : [],
        metadata: {
          createdAt: result.createdAt,
          updatedAt: result.updatedAt,
          status: result.status,
          tags: result.tags?.map((tag) => tag.tag) || [],
          ...(result.metadata || {}),
        },
        actions: this.getActionsForResult(result),
        url: result.sourceUrl || '',
      }

      return searchResult
    })
  }

  /**
   * Generate text highlights for search results
   */
  private generateHighlights(result: any, query: string): any[] {
    // Simple implementation - will be enhanced later
    if (!result.content || !query) return []

    const highlights = []
    const content = result.content
    const queryTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 2)

    queryTerms.forEach((term) => {
      const termIndex = content.toLowerCase().indexOf(term)
      if (termIndex >= 0) {
        // Get surrounding context (50 chars before and after)
        const start = Math.max(0, termIndex - 50)
        const end = Math.min(content.length, termIndex + term.length + 50)
        const fragment = content.slice(start, end)

        highlights.push({
          field: 'content',
          fragments: [fragment],
          matchedTerms: [term],
        })
      }
    })

    return highlights
  }

  /**
   * Combine regular and semantic search results
   */
  private combineResults(
    regularResults: UniversalSearchResult[],
    semanticResults: SemanticResult[],
  ): UniversalSearchResult[] {
    // Phase 1: Simple combination - we'll enhance this with better ranking later

    // Map semantic results to universal format
    const formattedSemanticResults = semanticResults.map((result) => {
      return {
        id: result.id,
        collection: result.collection,
        title: result.title,
        content: result.content,
        score: result.semanticScore,
        highlights: result.conceptMatches.map((match) => ({
          field: match.field,
          fragments: [match.explanation],
          matchedTerms: [match.concept],
        })),
        metadata: {
          semanticMatch: true,
          relevanceReason: result.relevanceReason,
        },
        actions: [],
        url: '',
      } as UniversalSearchResult
    })

    // Combine and deduplicate
    const combinedResults = [...regularResults]

    // Add semantic results that aren't already in regular results
    formattedSemanticResults.forEach((semanticResult) => {
      const isDuplicate = regularResults.some(
        (regularResult) =>
          regularResult.id === semanticResult.id &&
          regularResult.collection === semanticResult.collection,
      )

      if (!isDuplicate) {
        combinedResults.push(semanticResult)
      }
    })

    // Sort by score
    return combinedResults.sort((a, b) => b.score - a.score)
  }

  /**
   * Generate facets from search results
   */
  private generateFacets(results: any[]): SearchFacets {
    // Extract collections
    const collections = new Map<string, number>()
    results.forEach((result) => {
      const collection = result.collection
      collections.set(collection, (collections.get(collection) || 0) + 1)
    })

    // Extract statuses
    const statuses = new Map<string, number>()
    results.forEach((result) => {
      const status = result.status
      statuses.set(status, (statuses.get(status) || 0) + 1)
    })

    // Extract tags
    const tags = new Map<string, number>()
    results.forEach((result) => {
      result.tags?.forEach((tagObj) => {
        const tag = tagObj.tag
        tags.set(tag, (tags.get(tag) || 0) + 1)
      })
    })

    // Extract categories (if available)
    const categories = new Map<string, number>()
    results.forEach((result) => {
      const category = result.previewData?.category || result.metadata?.category
      if (category) {
        categories.set(category, (categories.get(category) || 0) + 1)
      }
    })

    // Extract authors (if available)
    const authors = new Map<string, number>()
    results.forEach((result) => {
      const author = result.previewData?.author || result.metadata?.author
      if (author) {
        authors.set(author, (authors.get(author) || 0) + 1)
      }
    })

    // Convert maps to facet items
    const mapToFacetItems = (map: Map<string, number>): FacetItem[] => {
      return Array.from(map.entries()).map(([value, count]) => ({
        value,
        count,
      }))
    }

    return {
      collections: mapToFacetItems(collections),
      statuses: mapToFacetItems(statuses),
      tags: mapToFacetItems(tags),
      categories: mapToFacetItems(categories),
      authors: mapToFacetItems(authors),
    }
  }

  /**
   * Get actions for a search result based on collection and status
   */
  private getActionsForResult(result: any): any[] {
    // Phase 1: Simple actions based on collection and status
    // In the future, this will be more dynamic and configurable

    const actions = []

    // Common actions for all results
    actions.push({
      id: 'view',
      label: 'View',
      handler: () => {},
    })

    // Collection-specific actions
    if (result.collection === 'flow-instances') {
      // For job descriptions
      if (result.status === 'draft' || result.status === 'in-progress') {
        actions.push({
          id: 'continue',
          label: 'Continue',
          handler: () => {},
        })
      } else if (result.status === 'completed') {
        actions.push({
          id: 'edit',
          label: 'Edit',
          handler: () => {},
        })

        actions.push({
          id: 'export',
          label: 'Export',
          handler: () => {},
        })
      }
    }

    return actions
  }

  /**
   * Build a cache key from search parameters
   */
  private buildCacheKey(query: string, options: SearchOptions): string {
    return JSON.stringify({
      query,
      collection: options.collection,
      filters: options.filters,
      sort: options.sort,
      pagination: options.pagination,
      business: this.business,
    })
  }

  /**
   * Get item from cache if it exists and hasn't expired
   */
  private getFromCache(key: string): any {
    const cached = this.cacheStore.get(key)

    if (!cached) return null

    // Check if cache has expired (5 minutes TTL)
    const now = Date.now()
    const cacheTTL = 5 * 60 * 1000 // 5 minutes

    if (now - cached.timestamp > cacheTTL) {
      this.cacheStore.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * Set item in cache
   */
  private setCache(key: string, data: any): void {
    this.cacheStore.set(key, {
      data,
      timestamp: Date.now(),
    })

    // Limit cache size to 100 items
    if (this.cacheStore.size > 100) {
      // Remove oldest item
      const oldestKey = this.cacheStore.keys().next().value
      this.cacheStore.delete(oldestKey)
    }
  }
}
