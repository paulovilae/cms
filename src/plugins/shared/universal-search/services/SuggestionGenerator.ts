import type { Payload } from 'payload'
// Simplify User type to avoid import issues
type User = any

import type { AISuggestion, AIProcessingResult, RecognizedIntent } from '../types/semantic.types'

interface SuggestionGeneratorOptions {
  payload: Payload
  user?: User | null
  business?: string
}

interface GenerateSuggestionsOptions {
  collection?: string
  limit?: number
  types?: ('search' | 'filter' | 'action' | 'content' | 'completion')[]
  intent?: RecognizedIntent
}

/**
 * Generates intelligent search suggestions using AI and historical data
 */
export class SuggestionGenerator {
  private payload: Payload
  private user?: User | null
  private business?: string
  private defaultModel = 'llama3.2:latest'
  private defaultPrompt =
    'You are a helpful assistant specialized in generating search suggestions.'

  constructor(options: SuggestionGeneratorOptions) {
    this.payload = options.payload
    this.user = options.user
    this.business = options.business
  }

  /**
   * Generate search suggestions based on partial query
   * Enhanced with AI capabilities in Phase 3
   */
  async generateSuggestions(
    query: string,
    options: GenerateSuggestionsOptions = {},
  ): Promise<AISuggestion[]> {
    const {
      collection,
      limit = 10,
      types = ['search', 'filter', 'action', 'content', 'completion'],
      intent,
    } = options

    if (!query.trim()) {
      return []
    }

    try {
      // First try to generate AI-powered suggestions
      if (query.length >= 3) {
        try {
          const aiSuggestions = await this.generateAISuggestions(query, collection, intent, limit)
          if (aiSuggestions.length > 0) {
            return aiSuggestions
          }
        } catch (aiError) {
          console.warn('AI suggestion generation failed, falling back to database:', aiError)
        }
      }

      // Fall back to database suggestions if AI fails or query is too short
      // Look for existing suggestions in the database first
      const dbSuggestions = await this.findSuggestionsInDatabase(query, collection, types, limit)

      // If we found enough suggestions, return them
      if (dbSuggestions.length >= limit) {
        return dbSuggestions.slice(0, limit)
      }

      // Look for recent searches that match the query
      const recentSearches = await this.findRecentSearches(
        query,
        collection,
        limit - dbSuggestions.length,
      )

      // Combine results, removing duplicates
      const combinedSuggestions = this.combineSuggestions(dbSuggestions, recentSearches)

      // If we still need more suggestions, use simple word completion
      if (combinedSuggestions.length < limit) {
        const basicSuggestions = await this.generateBasicSuggestions(
          query,
          collection,
          limit - combinedSuggestions.length,
        )

        return this.combineSuggestions(combinedSuggestions, basicSuggestions)
      }

      return combinedSuggestions
    } catch (error) {
      console.error('Error generating suggestions:', error)
      return []
    }
  }

  /**
   * New method to generate AI-powered suggestions
   * Uses AI Providers integration
   */
  private async generateAISuggestions(
    query: string,
    collection?: string,
    intent?: RecognizedIntent,
    limit: number = 10,
  ): Promise<AISuggestion[]> {
    try {
      // Try to get a matching AI provider from the database
      const aiProviders = await this.payload.find({
        collection: 'ai-providers' as any,
        limit: 1,
      })

      if (!aiProviders.docs || aiProviders.docs.length === 0) {
        console.warn('No AI provider found in database, using fallback')
        return []
      }

      // Use the first provider found
      const provider = aiProviders.docs[0] as any

      console.log('Using AI provider for suggestions:', {
        providerName: provider.name,
        providerType: provider.provider,
        model: provider.model || this.defaultModel,
      })

      // Build prompt for suggestions generation
      const prompt = `
You are an expert in generating helpful search suggestions based on user queries. Your task is to analyze the following search query and generate useful suggestions that will help the user find what they're looking for.

Query: "${query}"
${collection ? `Context: User is searching in the "${collection}" collection.` : ''}

Please generate ${limit} useful suggestions based on this query. Each suggestion should be one of these types:
1. "search" - A refined or alternative search query
2. "filter" - A filter to apply (e.g., "status:completed")
3. "content" - A specific content item that might be relevant
4. "action" - A specific action the user might want to take
5. "completion" - A completion of the current query

Format your response as a JSON array of objects, each with these properties:
- type: The suggestion type (search, filter, content, action, completion)
- text: The actual suggestion text
- confidence: Your confidence in this suggestion (0.0-1.0)
- reasoning: Brief explanation of why you're suggesting this
- metadata: (Optional) Additional info like basedOn ("history", "content", "patterns", "ai_analysis", "user_behavior")

Example:
[
  {
    "type": "search",
    "text": "marketing job descriptions",
    "confidence": 0.9,
    "reasoning": "User might be looking for job descriptions in marketing",
    "metadata": {
      "basedOn": "content"
    }
  },
  {
    "type": "filter",
    "text": "status:completed",
    "confidence": 0.7,
    "reasoning": "User might want to see only completed items",
    "metadata": {
      "basedOn": "patterns"
    }
  }
]`

      // Send request to AI provider
      const aiResult = await this.connectToAIProvider(prompt, provider)
      if (!aiResult.success) {
        console.warn('AI suggestion generation failed:', aiResult.error)
        return []
      }

      // Parse the response
      try {
        let suggestionsData
        if (typeof aiResult.data === 'string') {
          // Find JSON in the response
          const jsonMatch = aiResult.data.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            suggestionsData = JSON.parse(jsonMatch[0])
          } else {
            throw new Error('No JSON array found in AI response')
          }
        } else {
          suggestionsData = aiResult.data
        }

        // Validate and transform the suggestions
        if (Array.isArray(suggestionsData)) {
          const suggestions: AISuggestion[] = suggestionsData.map((item: any) => {
            // Validate suggestion type
            const validTypes = ['search', 'filter', 'content', 'action', 'completion'] as const
            const type = validTypes.includes(item.type as any)
              ? (item.type as 'search' | 'filter' | 'content' | 'action' | 'completion')
              : 'search'

            // Ensure the metadata.basedOn is a valid value
            const basedOn = [
              'content',
              'history',
              'patterns',
              'ai_analysis',
              'user_behavior',
            ].includes(item.metadata?.basedOn)
              ? (item.metadata?.basedOn as
                  | 'content'
                  | 'history'
                  | 'patterns'
                  | 'ai_analysis'
                  | 'user_behavior')
              : 'ai_analysis'

            return {
              type,
              text: item.text,
              confidence: item.confidence || 0.7,
              reasoning: item.reasoning || 'AI-generated suggestion',
              metadata: {
                ...item.metadata,
                basedOn,
              },
            }
          })

          // Save AI suggestions to database for future use
          this.saveSuggestionsToDatabase(suggestions, collection)

          return suggestions.slice(0, limit)
        }

        throw new Error('AI response is not an array')
      } catch (parseError) {
        console.error('Error parsing AI suggestions:', parseError)
        return []
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error)
      return []
    }
  }

  /**
   * Helper method to connect to AI provider
   */
  private async connectToAIProvider(prompt: string, provider: any): Promise<AIProcessingResult> {
    try {
      const startTime = Date.now()

      // Build the API URL and request body based on provider type
      let apiUrl = ''
      let requestBody: any = {}
      const headers: any = { 'Content-Type': 'application/json' }

      if (provider.provider === 'ollama' || provider.provider === 'lmstudio') {
        // Both Ollama and LM Studio use the same API format
        const baseUrl =
          provider.base_url ||
          (provider.provider === 'ollama' ? 'http://ollama:11434' : 'http://localhost:1234')
        apiUrl = `${baseUrl}/api/generate`
        requestBody = {
          model: provider.model || 'llama3.2:latest',
          prompt: prompt,
          stream: false,
          options: {
            temperature: provider.temperature || 0.7,
            top_p: provider.top_p || 0.9,
            top_k: provider.top_k || 40,
            num_predict: provider.max_output_tokens || 1000,
          },
        }
      } else if (provider.provider === 'openai') {
        const baseUrl = provider.base_url || 'https://api.openai.com/v1'
        apiUrl = `${baseUrl}/chat/completions`
        headers['Authorization'] = `Bearer ${provider.api_key}`
        requestBody = {
          model: provider.model || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: this.defaultPrompt,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: provider.temperature || 0.7,
          max_tokens: provider.max_output_tokens || 1000,
        }
      } else if (provider.provider === 'anthropic') {
        const baseUrl = provider.base_url || 'https://api.anthropic.com'
        apiUrl = `${baseUrl}/v1/messages`
        headers['x-api-key'] = provider.api_key
        headers['anthropic-version'] = '2023-06-01'
        requestBody = {
          model: provider.model || 'claude-3-5-sonnet-20241022',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: provider.max_output_tokens || 1000,
          temperature: provider.temperature || 0.7,
        }
      } else {
        console.warn(`Unsupported AI provider type: ${provider.provider}`)
        return {
          success: false,
          error: `Unsupported AI provider type: ${provider.provider}`,
          processingTime: Date.now() - startTime,
        }
      }

      // Add timeout to prevent infinite hangs
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log('🚨 AI request timeout - aborting after 10 seconds')
        controller.abort()
      }, 10000) // 10 second timeout

      try {
        const aiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (aiResponse.ok) {
          const aiData = await aiResponse.json()
          let responseText = ''

          // Extract response based on provider type
          if (provider.provider === 'ollama') {
            responseText = aiData.response
          } else if (provider.provider === 'openai') {
            responseText = aiData.choices?.[0]?.message?.content || ''
          } else if (provider.provider === 'anthropic') {
            responseText = aiData.content?.[0]?.text || ''
          }

          return {
            success: true,
            data: responseText,
            processingTime: Date.now() - startTime,
            tokensUsed: aiData.usage?.total_tokens,
            model: provider.model,
          }
        } else {
          console.error('AI response failed:', aiResponse.status)
          const errorText = await aiResponse.text()
          console.error('Error details:', errorText)
          return {
            success: false,
            error: `AI service returned error: ${aiResponse.status}`,
            processingTime: Date.now() - startTime,
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.error('AI fetch error:', fetchError)
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
        return {
          success: false,
          error: `AI service connection failed: ${errorMessage}`,
          processingTime: Date.now() - startTime,
        }
      }
    } catch (error) {
      console.error('Error connecting to AI provider:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error connecting to AI provider',
        processingTime: 0,
      }
    }
  }

  /**
   * Save AI-generated suggestions to database for future use
   */
  private async saveSuggestionsToDatabase(
    suggestions: AISuggestion[],
    collection?: string,
  ): Promise<void> {
    try {
      // Only save high-confidence suggestions
      const highConfidenceSuggestions = suggestions.filter(
        (suggestion) => suggestion.confidence >= 0.7,
      )

      for (const suggestion of highConfidenceSuggestions) {
        try {
          // Check if suggestion already exists
          const existing = await this.payload.find({
            collection: 'search-suggestions' as any,
            where: {
              text: {
                equals: suggestion.text,
              },
            },
            limit: 1,
          })

          if (existing.docs.length === 0) {
            // Create new suggestion
            await this.payload.create({
              collection: 'search-suggestions' as any,
              data: {
                type: suggestion.type,
                text: suggestion.text,
                confidence: suggestion.confidence,
                reasoning: suggestion.reasoning,
                metadata: suggestion.metadata,
                collection: collection,
                active: true,
                userFeedback: {
                  clicks: 0,
                  impressions: 1,
                  positive: 0,
                  negative: 0,
                },
              },
            } as any)
          } else if (existing.docs[0]) {
            // Update existing suggestion impressions
            const doc = existing.docs[0]
            const userFeedback = (doc as any).userFeedback || {
              clicks: 0,
              impressions: 0,
              positive: 0,
              negative: 0,
            }

            userFeedback.impressions++

            await this.payload.update({
              collection: 'search-suggestions' as any,
              id: doc.id,
              data: {
                userFeedback,
                // Optionally update confidence if AI suggestion is more confident
                confidence: Math.max((doc as any).confidence || 0, suggestion.confidence),
              } as any,
            })
          }
        } catch (dbError) {
          console.error('Error saving suggestion to database:', dbError)
          // Continue with next suggestion
        }
      }
    } catch (error) {
      console.error('Error saving suggestions to database:', error)
    }
  }

  /**
   * Find existing suggestions that match the query
   */
  private async findSuggestionsInDatabase(
    query: string,
    collection?: string,
    types: ('search' | 'filter' | 'action' | 'content' | 'completion')[] = [],
    limit: number = 10,
  ): Promise<AISuggestion[]> {
    try {
      // Build the query
      const where: any = {
        and: [
          {
            text: {
              like: `${query}%`,
            },
          },
          {
            active: {
              equals: true,
            },
          },
        ],
      }

      // Add collection filter if specified
      if (collection) {
        where.and.push({
          collection: {
            equals: collection,
          },
        })
      }

      // Add type filter if specified
      if (types.length > 0) {
        where.and.push({
          type: {
            in: types,
          },
        })
      }

      // If authenticated, add business context
      if (this.business) {
        // Optional: Add business-specific filtering here
      }

      // Execute the query
      const results = await this.payload.find({
        collection: 'search-suggestions' as any,
        where,
        sort: {
          'metadata.priority': -1,
          confidence: -1,
        } as any,
        limit,
      })

      // Map to AISuggestion format
      return results.docs.map((doc: any) => {
        // Validate suggestion type
        const validTypes = ['search', 'filter', 'content', 'action', 'completion'] as const
        const type = validTypes.includes(doc.type as any)
          ? (doc.type as 'search' | 'filter' | 'content' | 'action' | 'completion')
          : 'search'

        // Ensure metadata.basedOn is valid
        const metadata = doc.metadata || {}
        if (
          metadata.basedOn &&
          !['content', 'history', 'patterns', 'ai_analysis', 'user_behavior'].includes(
            metadata.basedOn,
          )
        ) {
          metadata.basedOn = 'ai_analysis'
        }

        return {
          type,
          text: doc.text,
          confidence: doc.confidence || 0.5,
          reasoning: doc.reasoning || '',
          metadata,
        }
      })
    } catch (error) {
      console.error('Error finding suggestions in database:', error)
      return []
    }
  }

  /**
   * Find recent searches that match the query
   */
  private async findRecentSearches(
    query: string,
    collection?: string,
    limit: number = 5,
  ): Promise<AISuggestion[]> {
    try {
      // Build the query
      const where: any = {
        and: [
          {
            query: {
              like: `${query}%`,
            },
          },
        ],
      }

      // Add collection filter if specified
      if (collection) {
        where.and.push({
          collection: {
            equals: collection,
          },
        })
      }

      // If authenticated, add user filter
      if (this.user) {
        where.and.push({
          userId: {
            equals: this.user.id,
          },
        })
      }

      // Execute the query
      const results = await this.payload.find({
        collection: 'search-queries' as any,
        where,
        sort: {
          createdAt: -1,
        } as any,
        limit,
      })

      // Map to AISuggestion format
      return results.docs.map((doc: any) => ({
        type: 'search' as const,
        text: doc.query,
        confidence: 0.7, // Recent searches are fairly confident
        reasoning: 'Based on your recent searches',
        metadata: {
          basedOn: 'history' as const,
          expectedResults: doc.resultCount,
        },
      }))
    } catch (error) {
      console.error('Error finding recent searches:', error)
      return []
    }
  }

  /**
   * Generate basic suggestions based on word completion
   */
  private async generateBasicSuggestions(
    query: string,
    collection?: string,
    limit: number = 5,
  ): Promise<AISuggestion[]> {
    // Common completion words for different contexts
    const completions: Record<string, string[]> = {
      default: [
        'document',
        'create',
        'search',
        'find',
        'recent',
        'popular',
        'template',
        'draft',
        'completed',
        'archived',
        'shared',
      ],
      'flow-instances': [
        'job',
        'description',
        'position',
        'role',
        'responsibility',
        'requirement',
        'qualification',
        'skills',
        'experience',
        'salary',
        'senior',
        'junior',
        'manager',
        'director',
        'specialist',
      ],
      'smart-contracts': [
        'contract',
        'transaction',
        'escrow',
        'agreement',
        'terms',
        'condition',
        'signature',
        'party',
        'blockchain',
        'oracle',
        'verification',
        'payment',
        'release',
        'expiration',
        'verification',
      ],
      'trading-strategies': [
        'strategy',
        'algorithm',
        'market',
        'indicator',
        'signal',
        'buy',
        'sell',
        'trade',
        'position',
        'risk',
        'return',
        'backtest',
        'performance',
        'optimization',
        'parameter',
      ],
    }

    // Get the appropriate completions based on collection with fallback to default
    const defaultWords = completions.default || []
    const collectionWords = (collection && completions[collection]) || []
    const wordList = collectionWords.length > 0 ? collectionWords : defaultWords

    // Filter completions that match the query
    const matchingCompletions = wordList.filter((word) =>
      word.toLowerCase().startsWith(query.toLowerCase()),
    )

    // Generate suggestions
    const suggestions: AISuggestion[] = matchingCompletions.map((completion) => ({
      type: 'completion' as const, // Use const assertion for proper typing
      text: completion,
      confidence: 0.5,
      reasoning: 'Basic word completion',
      metadata: {
        basedOn: 'patterns' as const,
      },
    }))

    // If we don't have enough suggestions, add some with the query as a prefix
    if (suggestions.length < limit) {
      const additionalCompletions: AISuggestion[] = wordList
        .filter((word) => !matchingCompletions.includes(word))
        .slice(0, limit - suggestions.length)
        .map((word) => ({
          type: 'completion' as const, // Use const assertion for proper typing
          text: `${query} ${word}`,
          confidence: 0.3,
          reasoning: 'Suggested completion',
          metadata: {
            basedOn: 'patterns' as const,
          },
        }))

      suggestions.push(...additionalCompletions)
    }

    return suggestions.slice(0, limit)
  }

  /**
   * Combine suggestions from multiple sources, removing duplicates
   */
  private combineSuggestions(
    suggestions1: AISuggestion[],
    suggestions2: AISuggestion[],
  ): AISuggestion[] {
    const combined = [...suggestions1]
    const existingTexts = new Set(suggestions1.map((s) => s.text.toLowerCase()))

    suggestions2.forEach((suggestion) => {
      if (!existingTexts.has(suggestion.text.toLowerCase())) {
        combined.push(suggestion)
        existingTexts.add(suggestion.text.toLowerCase())
      }
    })

    // Sort by confidence
    return combined.sort((a, b) => b.confidence - a.confidence)
  }

  /**
   * Record a suggestion that was clicked
   * This helps improve future suggestions through feedback
   */
  async recordSuggestionFeedback(
    suggestion: AISuggestion,
    action: 'click' | 'positive' | 'negative',
  ): Promise<void> {
    try {
      // Find the suggestion in the database
      const results = await this.payload.find({
        collection: 'search-suggestions' as any,
        where: {
          text: {
            equals: suggestion.text,
          },
        },
        limit: 1,
      })

      if (results.docs.length > 0) {
        const doc = results.docs[0]
        if (!doc) return

        const userFeedback = (doc as any).userFeedback || {
          clicks: 0,
          impressions: 0,
          positive: 0,
          negative: 0,
        }

        // Update the feedback
        switch (action) {
          case 'click':
            userFeedback.clicks++
            userFeedback.lastClicked = new Date()
            break
          case 'positive':
            userFeedback.positive++
            break
          case 'negative':
            userFeedback.negative++
            break
        }

        // Update the document with the correct structure
        await this.payload.update({
          collection: 'search-suggestions' as any,
          id: doc.id,
          data: {
            userFeedback,
          } as any,
        })
      }
    } catch (error) {
      console.error('Error recording suggestion feedback:', error)
    }
  }
}
