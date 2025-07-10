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

export interface FlowStep {
  stepNumber: number
  title: string
  description: string
  questionText: string
  systemPrompt: string
  stepType: 'text' | 'textarea' | 'select'
  isRequired: boolean
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
  completedAt?: string
}

export interface ContextItem {
  stepNumber: number
  stepTitle: string
  content: string
  relevanceWeight: number
}

export interface ContextIndicatorProps {
  previousContext: ContextItem[]
}

export interface ContextPreviewModalProps {
  currentStep: number
  instance: FlowInstance | null
  template: FlowTemplate | null
  userInput: string
  onClose: () => void
}
