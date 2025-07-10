'use client'

import React, { useState, useEffect } from 'react'
import {
  useJobDescriptionSearch,
  SearchResult,
} from '@/plugins/business/salarium/hooks/useJobDescriptionSearch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, X, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react'
import { createBusinessHeaders } from '@/utilities/businessContext'

interface QuickSearchProps {
  onSelectReference: (content: SearchResult) => void
}

/**
 * QuickSearch component for embedding within the job description workflow
 * Provides a simplified search experience to find reference job descriptions
 */
export const QuickSearch: React.FC<QuickSearchProps> = ({ onSelectReference }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [recentlyViewed, setRecentlyViewed] = useState<SearchResult[]>([])

  // Use our custom job description search hook
  const {
    results,
    loading,
    executeSearch,
    totalCount,
    setQuery: setSearchQuery,
  } = useJobDescriptionSearch()

  // Load recent searches and recently viewed job descriptions
  useEffect(() => {
    // Try to get from localStorage
    try {
      const storedSearches = localStorage.getItem('salarium-recent-searches')
      if (storedSearches) {
        setRecentSearches(JSON.parse(storedSearches))
      }

      const storedViewed = localStorage.getItem('salarium-recently-viewed')
      if (storedViewed) {
        setRecentlyViewed(JSON.parse(storedViewed))
      }
    } catch (error) {
      console.error('Failed to load recent data:', error)
    }

    // If no localStorage data, try to fetch from API
    if (recentlyViewed.length === 0) {
      fetchRecentlyViewed()
    }
  }, [])

  // Fetch recently viewed job descriptions from the API
  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch('/api/flow-instances?limit=3&sort=-updatedAt', {
        headers: createBusinessHeaders('salarium'),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.docs && data.docs.length > 0) {
          // Convert to SearchResult format
          const viewedResults: SearchResult[] = data.docs.map((item: any) => ({
            id: item.id,
            title: item.title,
            metadata: {
              createdAt: item.createdAt,
              updatedAt: item.updatedAt,
              status: item.status,
              department: item.department,
            },
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            stepResponses: item.stepResponses,
          }))
          setRecentlyViewed(viewedResults)
        }
      }
    } catch (error) {
      console.error('Failed to fetch recently viewed:', error)
    }
  }

  // Handle search execution
  const handleSearch = () => {
    if (!query.trim()) return

    // Update search query and execute search
    setSearchQuery(query.trim())
    executeSearch({
      query: query.trim(),
      options: {
        maxResults: 5,
        includeHighlights: true,
      },
    })

    // Save to recent searches
    if (!recentSearches.includes(query.trim())) {
      const updatedSearches = [query.trim(), ...recentSearches.slice(0, 4)]
      setRecentSearches(updatedSearches)
      try {
        localStorage.setItem('salarium-recent-searches', JSON.stringify(updatedSearches))
      } catch (error) {
        console.error('Failed to save recent searches:', error)
      }
    }
  }

  // Handle selecting a reference job description
  const handleSelectReference = (result: SearchResult) => {
    onSelectReference(result)
    setIsExpanded(false)

    // Save to recently viewed
    if (!recentlyViewed.find((item) => item.id === result.id)) {
      const updatedViewed = [result, ...recentlyViewed.slice(0, 2)]
      setRecentlyViewed(updatedViewed)
      try {
        localStorage.setItem('salarium-recently-viewed', JSON.stringify(updatedViewed))
      } catch (error) {
        console.error('Failed to save recently viewed:', error)
      }
    }
  }

  // If not expanded, show just the trigger button
  if (!isExpanded) {
    return (
      <Button
        variant="outline"
        className="w-full mb-4 flex items-center justify-center gap-2 text-gray-700 border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        onClick={() => setIsExpanded(true)}
      >
        <Search className="w-4 h-4" />
        Find Existing Job Descriptions as Reference
      </Button>
    )
  }

  return (
    <Card className="mb-6 border border-gray-200 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium">Search Job Descriptions</h3>
            <Badge variant="outline" className="text-xs">
              Reference Tool
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(false)}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search for existing job titles, skills, or departments..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
            autoFocus
          />
          <Button onClick={handleSearch} disabled={loading || !query.trim()} className="gap-1">
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Search className="w-4 h-4 mr-1" />
            )}
            Search
          </Button>
        </div>

        {/* Recent searches */}
        {!results.length && !loading && recentSearches.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" /> Recent Searches
            </h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    setQuery(term)
                    handleSearch()
                  }}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Results area */}
        <div className="max-h-80 overflow-y-auto border-t border-gray-100 pt-3">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Searching job descriptions...</span>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Search Results
                <span className="text-xs text-gray-500 ml-1">({totalCount} found)</span>
              </h4>
              <div className="space-y-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full p-3 hover:bg-gray-50 rounded-md cursor-pointer border border-gray-100 text-left"
                    onClick={() => handleSelectReference(result)}
                  >
                    <h5 className="font-medium text-indigo-600">{result.title}</h5>
                    {result.highlights &&
                      result.highlights.length > 0 &&
                      result.highlights[0]?.text && (
                        <p
                          className="text-xs text-gray-700 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: result.highlights[0].text,
                          }}
                        />
                      )}
                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                      <span>{result.metadata?.department?.name || 'General'}</span>
                      {result.status && (
                        <>
                          <span>•</span>
                          <span>{result.status}</span>
                        </>
                      )}
                      {result.createdAt && (
                        <>
                          <span>•</span>
                          <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {!loading && results.length === 0 && query && (
            <div className="text-center py-6 text-gray-500">
              <div className="mb-2">No job descriptions found matching "{query}"</div>
              <Button variant="link" className="text-sm p-0" onClick={() => setQuery('')}>
                Clear search
              </Button>
            </div>
          )}

          {/* Recently viewed - show when no active search */}
          {!loading && results.length === 0 && !query && recentlyViewed.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Clock className="w-3 h-3 mr-1" /> Recently Viewed
              </h4>
              <div className="space-y-2">
                {recentlyViewed.map((result) => (
                  <button
                    key={result.id}
                    className="w-full p-3 hover:bg-gray-50 rounded-md cursor-pointer border border-gray-100 text-left"
                    onClick={() => handleSelectReference(result)}
                  >
                    <h5 className="font-medium text-indigo-600">{result.title}</h5>
                    <div className="flex items-center text-xs text-gray-500 mt-1 gap-3">
                      <span>{result.metadata?.department?.name || 'General'}</span>
                      {result.status && (
                        <>
                          <span>•</span>
                          <span>{result.status}</span>
                        </>
                      )}
                      {result.createdAt && (
                        <>
                          <span>•</span>
                          <span>{new Date(result.createdAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Initial state - no recent items */}
          {!loading && results.length === 0 && !query && recentlyViewed.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <p>Enter search terms to find existing job descriptions</p>
              <p className="text-xs mt-2">
                Search by job title, skills, departments, or other keywords
              </p>
            </div>
          )}
        </div>

        {/* Footer with link to advanced search */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
            onClick={() => setIsExpanded(false)}
          >
            Cancel
          </Button>

          <Button
            variant="link"
            size="sm"
            className="text-indigo-600"
            onClick={() => window.open('/salarium/hr-search', '_blank')}
          >
            <span>Advanced Search</span>
            <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
