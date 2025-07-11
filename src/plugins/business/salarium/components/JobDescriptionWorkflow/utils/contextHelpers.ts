import { FlowInstance, ContextItem } from '../types'

/**
 * Helper function to calculate relevance between steps
 */
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

/**
 * Helper function to build context from previous steps
 */
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

/**
 * Builds a complete AI prompt for a given step
 */
export const buildAIPrompt = (
  currentStep: number,
  stepTitle: string,
  systemPrompt: string,
  userInput: string,
  previousContext: ContextItem[],
): string => {
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
        .join('\n\n')

      contextSection = `
CONTEXT FROM PREVIOUS STEPS:
${contextLines}

Please use this context to ensure your response is consistent and builds upon the information already provided.
`
    }
  }

  return `${systemPrompt}

${contextSection}

${formatInstructions[currentStep] || ''}

User Input: "${userInput}"

IMPORTANT: Use the context from previous steps to create a cohesive response that aligns with the overall job description being created. Reference specific details from previous steps when relevant.

Response:`
}

/**
 * Returns a placeholder for step title in the output template
 */
export const getPlaceholderForStep = (stepTitle: string): string => {
  const placeholders: Record<string, string> = {
    'Job Title': '{{jobTitle}}',
    'Job Mission': '{{jobMission}}',
    'Job Scope & Reach': '{{jobScope}}',
    'Key Responsibilities': '{{keyResponsibilities}}',
    'Required Qualifications': '{{qualifications}}',
  }
  return placeholders[stepTitle] || `{{${stepTitle.toLowerCase().replace(/\s+/g, '')}}}`
}
