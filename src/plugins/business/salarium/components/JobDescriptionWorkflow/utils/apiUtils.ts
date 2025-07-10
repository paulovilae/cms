import { createBusinessHeaders } from '@/utilities/businessContext'
import type { FlowInstance, FlowTemplate, StepResponse } from '../types/workflow.types'

export interface AIProcessingRequest {
  triggerAI: boolean
  aiPrompt: string
  systemPrompt: string
  stepNumber: number
  stepType: string
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('payload-token')

  const headers = {
    'Content-Type': 'application/json',
    ...createBusinessHeaders('salarium'),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

export const createFlowInstance = async (
  title: string,
  templateId: number,
  userId: number,
): Promise<APIResponse<FlowInstance>> => {
  try {
    const response = await fetchWithAuth('/api/flow-instances', {
      method: 'POST',
      body: JSON.stringify({
        title,
        template: templateId,
        user: userId,
        status: 'draft',
        currentStep: 1,
        stepResponses: [],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.doc || data }
  } catch (error) {
    console.error('Create flow instance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create flow instance',
    }
  }
}

export const updateFlowInstance = async (
  instanceId: string,
  updates: Partial<FlowInstance>,
): Promise<APIResponse<FlowInstance>> => {
  try {
    const response = await fetchWithAuth(`/api/flow-instances/${instanceId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.doc || data }
  } catch (error) {
    console.error('Update flow instance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update flow instance',
    }
  }
}

export const processAIStep = async (
  instanceId: string,
  aiRequest: AIProcessingRequest,
  currentStepResponses: StepResponse[] = [],
): Promise<APIResponse<FlowInstance>> => {
  try {
    const response = await fetchWithAuth('/api/flow-instances', {
      method: 'POST',
      body: JSON.stringify({
        id: instanceId,
        stepResponses: currentStepResponses,
        ...aiRequest,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.doc || data }
  } catch (error) {
    console.error('AI processing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'AI processing failed',
    }
  }
}

export const fetchFlowTemplates = async (): Promise<APIResponse<FlowTemplate[]>> => {
  try {
    const response = await fetchWithAuth('/api/flow-templates')

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.docs || data }
  } catch (error) {
    console.error('Fetch templates error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch templates',
    }
  }
}

export const fetchFlowInstance = async (instanceId: string): Promise<APIResponse<FlowInstance>> => {
  try {
    const response = await fetchWithAuth(`/api/flow-instances/${instanceId}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.doc || data }
  } catch (error) {
    console.error('Fetch flow instance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch flow instance',
    }
  }
}

export const deleteFlowInstance = async (instanceId: string): Promise<APIResponse<void>> => {
  try {
    const response = await fetchWithAuth(`/api/flow-instances/${instanceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Delete flow instance error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete flow instance',
    }
  }
}

export const saveStepResponse = async (
  instanceId: string,
  stepNumber: number,
  userInput: string,
  aiGeneratedContent: string = '',
  isCompleted: boolean = false,
): Promise<APIResponse<FlowInstance>> => {
  try {
    // First fetch current instance to get existing step responses
    const currentResponse = await fetchFlowInstance(instanceId)
    if (!currentResponse.success || !currentResponse.data) {
      throw new Error('Failed to fetch current instance')
    }

    const currentInstance = currentResponse.data
    const stepResponses = Array.isArray(currentInstance.stepResponses)
      ? [...currentInstance.stepResponses]
      : []

    // Update or add the step response
    const existingIndex = stepResponses.findIndex((r) => r.stepNumber === stepNumber)
    const stepResponse: StepResponse = {
      stepNumber,
      stepTitle: `Step ${stepNumber}`,
      userInput,
      aiGeneratedContent,
      isCompleted,
    }

    if (existingIndex >= 0) {
      stepResponses[existingIndex] = stepResponse
    } else {
      stepResponses.push(stepResponse)
    }

    // Update the instance
    return await updateFlowInstance(instanceId, {
      stepResponses,
      currentStep: stepNumber,
    })
  } catch (error) {
    console.error('Save step response error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save step response',
    }
  }
}

export const generateFinalDocument = async (
  instanceId: string,
): Promise<APIResponse<FlowInstance>> => {
  try {
    const response = await fetchWithAuth(`/api/flow-instances/${instanceId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: 'completed',
        generateFinalDocument: true,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    return { success: true, data: data.doc || data }
  } catch (error) {
    console.error('Generate final document error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate final document',
    }
  }
}

export const retryWithExponentialBackoff = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt === maxRetries) {
        break
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError!
}

export const validateStepInput = (
  stepType: string,
  input: string,
): { isValid: boolean; error?: string } => {
  if (!input.trim()) {
    return { isValid: false, error: 'Input cannot be empty' }
  }

  switch (stepType) {
    case 'text':
      if (input.length < 2) {
        return { isValid: false, error: 'Input must be at least 2 characters long' }
      }
      if (input.length > 200) {
        return { isValid: false, error: 'Input must be less than 200 characters' }
      }
      break

    case 'textarea':
      if (input.length < 10) {
        return { isValid: false, error: 'Input must be at least 10 characters long' }
      }
      if (input.length > 2000) {
        return { isValid: false, error: 'Input must be less than 2000 characters' }
      }
      break

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input)) {
        return { isValid: false, error: 'Please enter a valid email address' }
      }
      break

    case 'number':
      const num = parseFloat(input)
      if (isNaN(num)) {
        return { isValid: false, error: 'Please enter a valid number' }
      }
      break

    default:
      // For unknown step types, just check basic length
      if (input.length > 5000) {
        return { isValid: false, error: 'Input is too long' }
      }
  }

  return { isValid: true }
}

export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return 'An unexpected error occurred'
}

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('connection') ||
      error.message.includes('timeout')
    )
  }
  return false
}

export const shouldRetry = (error: unknown): boolean => {
  if (isNetworkError(error)) {
    return true
  }

  if (error instanceof Error) {
    // Retry on server errors (5xx) but not client errors (4xx)
    return (
      error.message.includes('HTTP 5') ||
      error.message.includes('timeout') ||
      error.message.includes('connection')
    )
  }

  return false
}
