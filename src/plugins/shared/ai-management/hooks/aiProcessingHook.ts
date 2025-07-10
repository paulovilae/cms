import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Build contextual prompt with previous steps context
 */
const buildContextualPrompt = (
  systemPrompt: string,
  userInput: string,
  previousStepsContext: any[],
  stepNumber: number,
): string => {
  // Step-specific context mapping
  const contextMap: Record<number, string> = {
    1: 'You are helping create a professional job title. Make it clear, concise, and industry-standard.',
    2: 'You are creating a compelling job mission statement. Focus on purpose, value, and organizational alignment.',
    3: 'You are defining job scope and organizational impact. Be specific about team size, responsibilities, and reach.',
    4: 'You are listing key responsibilities. Create 5-8 clear, action-oriented bullet points using strong action verbs.',
    5: 'You are organizing qualifications into clear categories: Education, Experience, Technical Skills, and Certifications.',
  }

  // Format instructions for each step
  const formatInstructions: Record<number, string> = {
    1: 'Return only the refined job title, nothing else.',
    2: 'Return a 2-3 sentence mission statement that is compelling and professional.',
    3: 'Format as bullet points covering: Team Leadership, Budget/Resources, Geographic Scope, Internal Stakeholders, Decision-making Authority.',
    4: 'Format as bullet points (•) with each responsibility starting with a strong action verb.',
    5: 'Format with clear section headers: **Required Qualifications:** and **Preferred Qualifications:** with bullet points under each.',
  }

  // Build context section from previous steps
  let contextSection = ''
  if (previousStepsContext && previousStepsContext.length > 0) {
    const relevantContext = previousStepsContext.filter((ctx: any) => ctx.relevanceWeight > 0.3)
    if (relevantContext.length > 0) {
      const contextLines = relevantContext
        .map((ctx: any) => `${ctx.stepTitle}: ${ctx.content}`)
        .join('\n')

      contextSection = `
CONTEXT FROM PREVIOUS STEPS:
${contextLines}

Please use this context to ensure your response is consistent and builds upon the information already provided.
`
    }
  }

  // Build the complete prompt
  return `${contextMap[stepNumber] || systemPrompt}

${contextSection}

${formatInstructions[stepNumber] || ''}

User Input: "${userInput}"

Instructions: ${systemPrompt}

IMPORTANT: Use the context from previous steps to create a cohesive response that aligns with the overall job description being created. Reference specific details from previous steps when relevant.

Response:`
}

/**
 * AI Processing Hook for Salarium Job Description Workflow
 * Integrates with Ollama for AI-powered content generation
 */
export const aiProcessingHook: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  console.log('🔥 AI Processing Hook Called!', {
    operation,
    hasData: !!data,
    triggerAI: (data as any)?.triggerAI,
    businessHeader: req.headers.get?.('x-business') || (req.headers as any)['x-business'],
  })

  if (!data) return data

  // Only process for Salarium business context
  const businessHeader = req.headers.get?.('x-business') || (req.headers as any)['x-business']
  console.log('🔍 Business header check:', { businessHeader, expected: 'salarium' })
  if (businessHeader !== 'salarium') {
    console.log('❌ Skipping AI processing - wrong business context')
    return data
  }

  // Only process when AI trigger is set
  const triggerAI = (data as any).triggerAI
  const stepNumber = (data as any).stepNumber

  console.log('🔍 Trigger AI check:', {
    triggerAI,
    stepNumber,
    allowRegeneration: true,
  })

  if (!triggerAI) {
    console.log('❌ Skipping AI processing - triggerAI not set')
    return data
  }

  // Allow regeneration - don't skip if already processed
  console.log('✅ AI processing allowed - triggerAI is set')

  console.log('✅ AI Processing conditions met - proceeding...')

  try {
    // Extract AI processing parameters first
    const aiPrompt = (data as any).aiPrompt || ''
    const systemPrompt = (data as any).systemPrompt || ''
    const stepNumber = (data as any).stepNumber || 1
    const stepType = (data as any).stepType || 'text'
    const previousStepsContext = (data as any).previousStepsContext || []

    console.log('AI processing parameters:', {
      aiPrompt,
      systemPrompt,
      stepNumber,
      stepType,
      previousStepsContext: previousStepsContext.length,
    })

    // Get the template ID from the data
    const templateId = (data as any).template
    if (!templateId) {
      console.warn('No template ID found in data, skipping AI processing')
      return data
    }

    console.log('🔍 Loading template with ID:', templateId)

    // Get the template with its AI provider
    const template = await req.payload.findByID({
      collection: 'flow-templates',
      id: templateId,
      depth: 2, // Include the AI provider relationship
    })

    if (!template || !template.aiProvider) {
      console.warn('No AI provider configured for this template, skipping AI processing')
      return data
    }

    const provider = template.aiProvider as any
    console.log('🔧 COMPLETE AI PROVIDER CONFIGURATION:', {
      providerName: provider.name,
      providerType: provider.provider,
      model: provider.model,
      baseUrl: provider.base_url || provider.baseUrl,
      temperature: provider.temperature || 0.7,
      topP: provider.top_p || 0.9,
      topK: provider.top_k || 40,
      maxTokens: provider.max_output_tokens || 1000,
      apiKey: provider.api_key ? '***HIDDEN***' : 'Not set',
      connectionUrl:
        provider.provider === 'ollama'
          ? provider.base_url || 'http://ollama:11434'
          : provider.base_url || 'Default provider URL',
      allProviderFields: Object.keys(provider),
    })

    // Check if we should use mock AI (for testing)
    const useMockAI = process.env.USE_MOCK_AI === 'true'

    let aiGeneratedContent = ''

    if (useMockAI) {
      // Mock AI responses for immediate testing
      console.log('Using mock AI response')
      switch (stepNumber) {
        case 1:
          aiGeneratedContent = `Senior ${aiPrompt} - Full Stack Development`
          break
        case 2:
          aiGeneratedContent = `Drive innovation and technical excellence as a ${aiPrompt}, leading the development of cutting-edge solutions that transform how our customers interact with technology.`
          break
        case 3:
          aiGeneratedContent = `• Lead a team of 5-8 developers\n• Manage technical architecture decisions\n• Oversee project delivery and quality assurance\n• Collaborate with product and design teams\n• Drive technical innovation initiatives`
          break
        case 4:
          aiGeneratedContent = `• Design and develop scalable web applications\n• Lead code reviews and maintain coding standards\n• Mentor junior developers and provide technical guidance\n• Collaborate with cross-functional teams on product requirements\n• Implement best practices for testing and deployment\n• Stay current with emerging technologies and industry trends`
          break
        case 5:
          aiGeneratedContent = `**Required Qualifications:**\n• Bachelor's degree in Computer Science or related field\n• 5+ years of software development experience\n• Proficiency in modern programming languages\n• Experience with cloud platforms and DevOps practices\n\n**Preferred Qualifications:**\n• Master's degree in Computer Science\n• Experience leading development teams\n• Certifications in relevant technologies`
          break
        default:
          aiGeneratedContent = `Professional ${aiPrompt} content generated by AI`
      }
    } else {
      // Real AI processing with the configured provider
      console.log('Using real AI processing with provider:', provider.provider)

      // Build the API URL and request body based on provider type
      let apiUrl = ''
      let requestBody: any = {}
      let headers: any = { 'Content-Type': 'application/json' }

      if (provider.provider === 'ollama' || provider.provider === 'lmstudio') {
        // Both Ollama and LM Studio use the same API format
        const baseUrl =
          provider.base_url ||
          (provider.provider === 'ollama' ? 'http://ollama:11434' : 'http://localhost:1234')
        apiUrl = `${baseUrl}/api/generate`
        requestBody = {
          model: provider.model || 'llama3.2:latest',
          prompt: buildContextualPrompt(systemPrompt, aiPrompt, previousStepsContext, stepNumber),
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
              content: systemPrompt,
            },
            {
              role: 'user',
              content: buildContextualPrompt(
                systemPrompt,
                aiPrompt,
                previousStepsContext,
                stepNumber,
              ),
            },
          ],
          temperature: provider.temperature || 0.7,
          max_tokens: provider.max_output_tokens || 1000,
        }
      } else {
        console.warn(`Unsupported AI provider type: ${provider.provider}`)
        return data
      }

      // Add timeout to prevent infinite hangs
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        console.log('🚨 AI request timeout - aborting after 30 seconds')
        controller.abort()
      }, 30000) // 30 second timeout

      console.log('🔄 Making AI request to:', apiUrl)
      console.log('🔄 Request body:', JSON.stringify(requestBody, null, 2))

      let aiResponse
      try {
        aiResponse = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        console.log('✅ AI response received, status:', aiResponse.status)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        console.error('❌ AI fetch error:', fetchError)
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
        throw new Error(`AI service connection failed: ${errorMessage}`)
      }

      if (aiResponse.ok) {
        const aiData = await aiResponse.json()

        if (provider.provider === 'ollama') {
          aiGeneratedContent = aiData.response
        } else if (provider.provider === 'openai') {
          aiGeneratedContent = aiData.choices?.[0]?.message?.content || ''
        }
      } else {
        console.error('AI response failed:', aiResponse.status)
        throw new Error('AI processing failed')
      }
    }

    // Update the current step response with AI generated content
    const stepResponses = (data as any).stepResponses || []
    const stepIndex = stepResponses.findIndex((r: any) => r.stepNumber === stepNumber)

    if (stepIndex >= 0) {
      stepResponses[stepIndex] = {
        ...stepResponses[stepIndex],
        userInput: aiPrompt, // Store the user input
        aiGeneratedContent: aiGeneratedContent,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      }
      console.log('Updated existing step response:', stepResponses[stepIndex])
    } else {
      // Create new step response if it doesn't exist
      const newStepResponse = {
        stepNumber: stepNumber,
        stepTitle: `Step ${stepNumber}`, // Default title, should be updated by frontend
        userInput: aiPrompt,
        aiGeneratedContent: aiGeneratedContent,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        versions: [],
      }
      stepResponses.push(newStepResponse)
      console.log('Created new step response:', newStepResponse)
    }

    const result = {
      ...data,
      stepResponses,
      triggerAI: false, // Reset trigger
    }

    console.log('Returning result:', result)
    return result
  } catch (error) {
    console.error('AI processing error:', error)
  }

  return {
    ...data,
    triggerAI: false, // Reset trigger even on error
  }
}
