import { getBusinessContext } from '@/utilities/businessContext'
import { SemanticAnalyzer } from '../services/SemanticAnalyzer'
import { formatErrorMessage } from '@/plugins/business/salarium/components/JobDescriptionWorkflow/utils/apiUtils'
import type { SemanticSearchRequest } from '../types/semantic.types'

export const semanticEndpoint = {
  path: '/api/search/semantic',
  method: 'post',
  handler: async (req, res) => {
    try {
      // Get business context for multi-tenant isolation
      const businessContext = getBusinessContext(req)

      // Parse request body
      const {
        query,
        collection,
        context,
        intent,
        semanticWeight = 0.7,
        maxResults = 20,
      } = req.body as SemanticSearchRequest

      if (!query) {
        return res.status(400).json({
          success: false,
          error: 'Query is required',
        })
      }

      // Initialize semantic analyzer with current user context
      const semanticAnalyzer = new SemanticAnalyzer({
        payload: req.payload,
        user: req.user,
        business: businessContext.business,
      })

      // Track processing time
      const startTime = Date.now()

      // Process with AI for semantic understanding
      const semanticResults = await semanticAnalyzer.analyzeQuery(query, {
        collection,
        context: {
          ...context,
          user: req.user?.id,
          business: businessContext.business,
        },
        intent,
        semanticWeight,
        maxResults,
      })

      // Calculate processing time
      const processingTime = Date.now() - startTime

      // Return semantic results
      return res.status(200).json({
        success: true,
        results: semanticResults,
        query,
        processingTime,
        intent: semanticResults.intent,
        confidence: semanticResults.confidence,
      })
    } catch (error) {
      console.error('Semantic search error:', error)

      return res.status(500).json({
        success: false,
        error: formatErrorMessage(error) || 'An error occurred during semantic analysis',
      })
    }
  },
}
