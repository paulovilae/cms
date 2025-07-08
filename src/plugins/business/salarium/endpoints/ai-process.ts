import { PayloadRequest, PayloadHandler, Endpoint } from 'payload'

interface AIProcessRequest {
  userInput: string
  systemPrompt: string
  stepNumber: number
  stepType: string
}

interface AIProcessResponse {
  success: boolean
  content: string
  error?: string
  responseTimeMs?: number
}

/**
 * AI Processing Endpoint for Salarium Job Description Flow
 * Connects to local Ollama instance for AI-powered content generation
 */
export const aiProcessEndpoint: Endpoint = {
  path: '/salarium/ai-process',
  method: 'post',
  handler: async (req: any) => {
    const startTime = Date.now()

    try {
      // For demo purposes, we'll bypass authentication and use a direct Ollama connection
      // In production, you would want to keep the authentication check

      // Parse the request body properly - Payload uses different request structure
      let body: AIProcessRequest
      try {
        // In Payload endpoints, the body might be in req.json or need to be read from the request
        if (req.json) {
          body = await req.json()
        } else if (req.body) {
          body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
        } else {
          // Try to read from the raw request
          const rawBody = await req.text()
          body = JSON.parse(rawBody)
        }
      } catch (error) {
        console.log('Body parsing error:', error)
        return Response.json(
          {
            success: false,
            error: 'Invalid JSON in request body',
          },
          { status: 400 },
        )
      }

      const { userInput, systemPrompt, stepNumber, stepType } = body

      console.log('AI Process Request:', { userInput, systemPrompt, stepNumber, stepType })

      if (!userInput || !systemPrompt) {
        console.log('Missing required fields:', {
          userInput: !!userInput,
          systemPrompt: !!systemPrompt,
        })
        return Response.json(
          {
            success: false,
            error: 'Missing required fields: userInput and systemPrompt',
          },
          { status: 400 },
        )
      }

      // For demo purposes, connect directly to local Ollama
      // In production, you would get these from the database configuration
      const baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
      const model = process.env.OLLAMA_MODEL || 'llama3.2:latest'

      console.log(`Connecting to Ollama at ${baseUrl} with model ${model}`)

      // Prepare the prompt based on step type and context
      const enhancedPrompt = buildEnhancedPrompt(systemPrompt, userInput, stepNumber, stepType)

      // Make request to Ollama
      const ollamaResponse = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: enhancedPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_predict: 1000,
          },
        }),
      })

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API error: ${ollamaResponse.status} ${ollamaResponse.statusText}`)
      }

      const ollamaData = await ollamaResponse.json()
      const responseTimeMs = Date.now() - startTime

      // Post-process the response based on step type
      const processedContent = postProcessResponse(ollamaData.response, stepNumber, stepType)

      return Response.json({
        success: true,
        content: processedContent,
        responseTimeMs,
      })
    } catch (error) {
      console.error('AI processing error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'AI processing failed',
          responseTimeMs: Date.now() - startTime,
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Build enhanced prompt with context and formatting instructions
 */
function buildEnhancedPrompt(
  systemPrompt: string,
  userInput: string,
  stepNumber: number,
  stepType: string,
): string {
  const contextMap: Record<number, string> = {
    1: 'You are helping create a professional job title. Make it clear, concise, and industry-standard.',
    2: 'You are creating a compelling job mission statement. Focus on purpose, value, and organizational alignment.',
    3: 'You are defining job scope and organizational impact. Be specific about team size, responsibilities, and reach.',
    4: 'You are listing key responsibilities. Create 5-8 clear, action-oriented bullet points using strong action verbs.',
    5: 'You are organizing qualifications into clear categories: Education, Experience, Technical Skills, and Certifications.',
  }

  const formatInstructions: Record<number, string> = {
    1: 'Return only the refined job title, nothing else.',
    2: 'Return a 2-3 sentence mission statement that is compelling and professional.',
    3: 'Format as bullet points covering: Team Leadership, Budget/Resources, Geographic Scope, Internal Stakeholders, Decision-making Authority.',
    4: 'Format as bullet points (•) with each responsibility starting with a strong action verb.',
    5: 'Format with clear section headers: **Required Qualifications:** and **Preferred Qualifications:** with bullet points under each.',
  }

  return `${contextMap[stepNumber] || systemPrompt}

${formatInstructions[stepNumber] || ''}

User Input: "${userInput}"

Instructions: ${systemPrompt}

Response:`
}

/**
 * Post-process AI response based on step requirements
 */
function postProcessResponse(response: string, stepNumber: number, stepType: string): string {
  let processed = response.trim()

  // Remove common AI response prefixes
  processed = processed.replace(/^(Here's|Here is|Based on|The|A|An)\s*/i, '')
  processed = processed.replace(
    /^(job title|mission statement|scope|responsibilities|qualifications):\s*/i,
    '',
  )

  // Step-specific post-processing
  switch (stepNumber) {
    case 1: // Job Title
      // Ensure proper title case
      processed = processed
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
      break

    case 2: // Mission
      // Ensure it ends with a period
      if (!processed.endsWith('.')) {
        processed += '.'
      }
      break

    case 3: // Scope
    case 4: // Responsibilities
      // Ensure bullet points are properly formatted
      if (!processed.includes('•') && !processed.includes('-')) {
        const lines = processed.split('\n').filter((line) => line.trim())
        processed = lines.map((line) => `• ${line.trim()}`).join('\n')
      }
      break

    case 5: // Qualifications
      // Ensure proper section headers
      if (!processed.includes('**Required') && !processed.includes('**Preferred')) {
        const lines = processed.split('\n').filter((line) => line.trim())
        const midPoint = Math.ceil(lines.length / 2)
        const required = lines
          .slice(0, midPoint)
          .map((line) => `• ${line.trim()}`)
          .join('\n')
        const preferred = lines
          .slice(midPoint)
          .map((line) => `• ${line.trim()}`)
          .join('\n')

        processed = `**Required Qualifications:**\n${required}\n\n**Preferred Qualifications:**\n${preferred}`
      }
      break
  }

  return processed
}

export default aiProcessEndpoint
