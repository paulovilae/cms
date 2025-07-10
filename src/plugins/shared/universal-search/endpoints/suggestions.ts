import { getBusinessContext } from '@/utilities/businessContext'
import { SuggestionGenerator } from '../services/SuggestionGenerator'
import { formatErrorMessage } from '@/plugins/business/salarium/components/JobDescriptionWorkflow/utils/apiUtils'

export const suggestionsEndpoint = {
  path: '/api/search/suggestions',
  method: 'post',
  handler: async (req, res) => {
    try {
      // Get business context for multi-tenant isolation
      const businessContext = getBusinessContext(req)

      // Parse request body
      const {
        query,
        collection,
        limit = 10,
        types = ['search', 'filter', 'action', 'content', 'completion'],
      } = req.body

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required',
        })
      }

      // Initialize suggestion generator with current user context
      const suggestionGenerator = new SuggestionGenerator({
        payload: req.payload,
        user: req.user,
        business: businessContext.business,
      })

      // Get AI-powered suggestions
      const suggestions = await suggestionGenerator.generateSuggestions(query, {
        collection,
        limit,
        types,
      })

      // Return suggestions
      return res.status(200).json({
        success: true,
        suggestions,
        query,
      })
    } catch (error) {
      console.error('Suggestions error:', error)

      return res.status(500).json({
        success: false,
        error: formatErrorMessage(error) || 'An error occurred while generating suggestions',
      })
    }
  },
}
