import type { FlowInstance, ContextItem } from '../types/workflow.types'

// Helper function to calculate relevance between steps
export const calculateRelevance = (sourceStep: number, targetStep: number): number => {
  const relevanceMatrix: Record<number, Record<number, number>> = {
    // Job Title is highly relevant to all steps
    1: { 2: 0.9, 3: 0.8, 4: 0.7, 5: 0.8 },
    // Mission is very relevant to scope and responsibilities
    2: { 3: 0.9, 4: 0.8, 5: 0.6 },
    // Scope influences responsibilities and qualifications
    3: { 4: 0.9, 5: 0.7 },
    // Responsibilities directly influence qualifications
    4: { 5: 0.9 },
  }

  return relevanceMatrix[sourceStep]?.[targetStep] || 0.3
}

// Helper function to build context from previous steps
export const buildPreviousStepsContext = (
  instance: FlowInstance,
  currentStep: number,
): ContextItem[] => {
  if (!instance?.stepResponses || !Array.isArray(instance.stepResponses)) {
    return []
  }

  return instance.stepResponses
    .filter(
      (response) =>
        response.isCompleted &&
        response.stepNumber !== currentStep &&
        response.aiGeneratedContent.trim(),
    )
    .map((response) => ({
      stepNumber: response.stepNumber,
      stepTitle: response.stepTitle,
      content: response.aiGeneratedContent,
      relevanceWeight: calculateRelevance(response.stepNumber, currentStep),
    }))
    .sort((a, b) => b.relevanceWeight - a.relevanceWeight) // Sort by relevance
}

// Get business context for API calls
export const getBusinessContext = () => {
  return {
    business: 'salarium',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  }
}

// Build the exact prompt that would be sent to AI
export const buildFullPrompt = (
  currentStepData: any,
  previousContext: ContextItem[],
  userInput: string,
  currentStep: number,
): string => {
  if (!currentStepData) return ''

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

  // Build context section
  let contextSection = ''
  if (previousContext.length > 0) {
    const relevantContext = previousContext.filter((ctx) => ctx.relevanceWeight > 0.3)
    if (relevantContext.length > 0) {
      const contextLines = relevantContext
        .map((ctx) => `${ctx.stepTitle}: ${ctx.content}`)
        .join('\n')

      contextSection = `
CONTEXT FROM PREVIOUS STEPS:
${contextLines}

Please use this context to ensure your response is consistent and builds upon the information already provided.
`
    }
  }

  // Use database systemPrompt as primary, contextMap as fallback
  const primaryPrompt =
    currentStepData.systemPrompt ||
    contextMap[currentStep] ||
    'Process the user input professionally.'

  return `${primaryPrompt}

${contextSection}

${formatInstructions[currentStep] || ''}

User Input: "${userInput}"

IMPORTANT: Use the context from previous steps to create a cohesive response that aligns with the overall job description being created. Reference specific details from previous steps when relevant.

Response:`
}
