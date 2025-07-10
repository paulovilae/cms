import { Endpoint } from 'payload/config'
import { searchService } from '../services/search-service'

/**
 * Universal Search Endpoint
 * This endpoint handles search requests with business-specific configurations
 */
export const searchEndpoint: Endpoint = {
  path: '/universal-search',
  method: 'post',
  handler: async (req: any) => {
    try {
      // Parse JSON body using Web API pattern
      const body = await req.json()
      const { query, filters, options } = body

      // Validate required fields
      if (!query && !filters) {
        return Response.json(
          {
            success: false,
            message: 'Query or filters are required',
          },
          { status: 400 },
        )
      }

      // Perform search with business context from request
      const results = await searchService.search(query || '', filters, options, req)

      return Response.json(
        {
          success: true,
          ...results,
        },
        { status: 200 },
      )
    } catch (error) {
      console.error('Search error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return Response.json(
        {
          success: false,
          message: 'An error occurred during search',
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Search Suggestions Endpoint
 * This endpoint provides search suggestions with business-specific configurations
 */
export const suggestionsEndpoint: Endpoint = {
  path: '/universal-search/suggestions',
  method: 'post',
  handler: async (req: any) => {
    try {
      // Parse JSON body using Web API pattern
      const body = await req.json()
      const { query } = body

      // Validate required fields
      if (!query) {
        return Response.json(
          {
            success: false,
            message: 'Query is required',
          },
          { status: 400 },
        )
      }

      // Get suggestions with business context from request
      const suggestions = await searchService.getSuggestions(query, req)

      return Response.json(
        {
          success: true,
          suggestions,
        },
        { status: 200 },
      )
    } catch (error) {
      console.error('Suggestions error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return Response.json(
        {
          success: false,
          message: 'An error occurred while getting suggestions',
          error: errorMessage,
        },
        { status: 500 },
      )
    }
  },
}
