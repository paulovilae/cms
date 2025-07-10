'use client'

import { useState, useEffect, useRef } from 'react'
import { createBusinessHeaders } from '@/utilities/businessContext'

// Simple interface for search results
export interface SearchResult {
  id: string
  title: string
  content?: string
  highlights?: Array<{ text: string }>
  metadata?: Record<string, any>
  status?: string
  createdAt?: string
  updatedAt?: string
  url?: string
  stepResponses?: Array<{
    stepNumber: number
    stepTitle: string
    userInput?: string
    aiGeneratedContent?: string
    isCompleted?: boolean
  }>
}

// Interface for search params
export interface SearchParams {
  query: string
  collection?: string
  filters?: Record<string, any>
  options?: {
    includeHighlights?: boolean
    maxResults?: number
  }
}

// Simple debounce function
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

/**
 * Custom hook for searching job descriptions
 * This is a simplified version of the universal search hook that doesn't depend on external libraries
 */
export function useJobDescriptionSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [searchTime, setSearchTime] = useState(0)

  // Cache for previous searches
  const searchCache = useRef<Record<string, any>>({})

  // Execute search with debouncing
  const executeSearch = async (params: SearchParams) => {
    setLoading(true)
    setError(null)

    try {
      // Check cache first
      const cacheKey = JSON.stringify(params)
      if (searchCache.current[cacheKey]) {
        const cachedResult = searchCache.current[cacheKey]
        setResults(cachedResult.results)
        setTotalCount(cachedResult.totalCount)
        setSearchTime(cachedResult.searchTime)
        setLoading(false)
        return
      }

      // Execute the actual search
      const startTime = performance.now()

      const response = await fetch('/api/flow-instances', {
        method: 'GET',
        headers: {
          ...createBusinessHeaders('salarium'),
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      const endTime = performance.now()

      // For demonstration, we'll filter the results on the client side
      // In a real implementation, this would be done on the server
      let filteredResults = data.docs || []

      if (params.query) {
        const lowerQuery = params.query.toLowerCase()
        filteredResults = filteredResults.filter((item: any) => {
          // Search in title
          if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
            return true
          }

          // Search in step responses
          if (item.stepResponses && Array.isArray(item.stepResponses)) {
            return item.stepResponses.some((step: any) => {
              return (
                (step.aiGeneratedContent &&
                  step.aiGeneratedContent.toLowerCase().includes(lowerQuery)) ||
                (step.userInput && step.userInput.toLowerCase().includes(lowerQuery))
              )
            })
          }

          return false
        })

        // Add highlights
        filteredResults = filteredResults.map((item: any) => {
          const highlights = []

          // Highlight title matches
          if (item.title && item.title.toLowerCase().includes(lowerQuery)) {
            const highlightedTitle = item.title.replace(
              new RegExp(params.query, 'gi'),
              (match: string) => `<mark>${match}</mark>`,
            )
            highlights.push({
              text: `Title: ${highlightedTitle}`,
            })
          }

          // Highlight content matches in step responses
          if (item.stepResponses && Array.isArray(item.stepResponses)) {
            item.stepResponses.forEach((step: any) => {
              if (
                step.aiGeneratedContent &&
                step.aiGeneratedContent.toLowerCase().includes(lowerQuery)
              ) {
                // Get a snippet around the match
                const index = step.aiGeneratedContent.toLowerCase().indexOf(lowerQuery)
                const start = Math.max(0, index - 50)
                const end = Math.min(
                  step.aiGeneratedContent.length,
                  index + params.query.length + 50,
                )
                let snippet = step.aiGeneratedContent.substring(start, end)

                // Add ellipsis if needed
                if (start > 0) snippet = '...' + snippet
                if (end < step.aiGeneratedContent.length) snippet = snippet + '...'

                // Highlight the match
                const highlightedSnippet = snippet.replace(
                  new RegExp(params.query, 'gi'),
                  (match: string) => `<mark>${match}</mark>`,
                )

                highlights.push({
                  text: `${step.stepTitle}: ${highlightedSnippet}`,
                })
              }
            })
          }

          return {
            ...item,
            highlights: highlights.length ? highlights : undefined,
          }
        })
      }

      // Limit results if specified
      if (params.options?.maxResults) {
        filteredResults = filteredResults.slice(0, params.options.maxResults)
      }

      // Format results
      const formattedResults = filteredResults.map((item: any) => ({
        id: item.id,
        title: item.title,
        highlights: item.highlights,
        metadata: {
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          status: item.status,
        },
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        stepResponses: item.stepResponses,
      }))

      // Cache the results
      searchCache.current[cacheKey] = {
        results: formattedResults,
        totalCount: filteredResults.length,
        searchTime: endTime - startTime,
      }

      setResults(formattedResults)
      setTotalCount(filteredResults.length)
      setSearchTime(endTime - startTime)
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults([])
      setTotalCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Debounced version of executeSearch
  const debouncedSearch = debounce((params: SearchParams) => {
    executeSearch(params)
  }, 300)

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    totalCount,
    searchTime,
    executeSearch,
    debouncedSearch,
  }
}
