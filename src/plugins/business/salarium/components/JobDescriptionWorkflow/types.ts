// Define interfaces for our workflow
export interface FlowTemplate {
  id: string
  name: string
  description: string
  steps: FlowStep[]
  outputTemplate: string
  metadata?: {
    difficulty?: string
    estimatedTime?: number
    tags?: Array<{ tag: string }>
    industry?: Array<{ industry: string }>
    language?: string
  }
}

// For backward compatibility - some files use Step instead of FlowStep
export type Step = FlowStep

export interface FlowStep {
  stepNumber: number
  title?: string // Make optional since some components don't set it
  stepTitle: string // Make required since it's used as a required field
  description: string
  questionText?: string // Make optional for compatibility
  systemPrompt: string
  stepType?: 'text' | 'textarea' | 'select' // Make optional for compatibility
  isRequired?: boolean // Make optional for compatibility
  validationRules?: {
    minLength?: number
    maxLength?: number
    customMessage?: string
  }
  examples?: Array<{
    userInput: string
    expectedOutput: string
  }>
}

export interface FlowInstance {
  id: string
  title: string
  template: string
  status: 'draft' | 'in-progress' | 'completed'
  currentStep: number
  totalSteps: number
  progress: number
  stepResponses: StepResponse[]
  finalDocument: string
}

export interface StepResponse {
  stepNumber: number
  stepTitle: string
  userInput: string
  aiGeneratedContent: string
  isCompleted: boolean
  lastUpdated?: string
  completedAt?: string
}

// Context item for buildPreviousStepsContext
export interface ContextItem {
  stepNumber: number
  stepTitle: string
  content: string
  relevanceWeight: number
}

// Document section for Auto-Cascade feature
export interface DocumentSection {
  id: string
  title: string
  content: string
  status?: 'pending' | 'processing' | 'completed' | 'failed' // Make optional for compatibility
  order?: number // Make optional for compatibility
  stepNumber?: number // For compatibility with components that use stepNumber
  isCompleted?: boolean // For AutoCascadeIntegration component
}
