/**
 * Payload request interface (Payload 3.x compatible)
 */
export interface PayloadRequest {
  user?: any
  payload?: any
  headers: Headers
  json: () => Promise<any>
  [key: string]: any
}

/**
 * Types of AI content generation
 */
export enum GenerationType {
  INITIAL = 'initial',
  REFINEMENT = 'refinement',
  ALTERNATIVE = 'alternative',
  MANUAL = 'manual',
  SECTION = 'section',
  ALTERNATIVES = 'alternatives',
  CASCADE = 'cascade',
}

/**
 * Document status
 */
export enum DocumentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

/**
 * Section type
 */
export enum SectionType {
  INTRODUCTION = 'introduction',
  SUMMARY = 'summary',
  RESPONSIBILITIES = 'responsibilities',
  REQUIREMENTS = 'requirements',
  QUALIFICATIONS = 'qualifications',
  BENEFITS = 'benefits',
  CUSTOM = 'custom',
  // New input types
  TEXT_INPUT = 'text_input',
  RICH_TEXT = 'rich_text',
  MULTIPLE_CHOICE = 'multiple_choice',
  CHECKBOX = 'checkbox',
  RADIO_GROUP = 'radio_group',
  DATE_INPUT = 'date_input',
  FILE_UPLOAD = 'file_upload',
  AI_GENERATED = 'ai_generated',
}

/**
 * Input configuration for sections
 */
export interface InputConfig {
  placeholder?: string
  defaultValue?: string
  minLength?: number
  maxLength?: number
  isRequired?: boolean
  validationRules?: Array<{
    rule: string
    errorMessage?: string
  }>
  options?: Array<{
    label: string
    value: string
    description?: string
  }>
}

/**
 * AI configuration for sections
 */
export interface AIConfig {
  systemPrompt?: string
  exampleResponse?: string
  inputMapping?: Record<string, any>
  temperature?: number
}

/**
 * Interaction history entry
 */
export interface InteractionHistory {
  timestamp: string
  userInput?: Record<string, any>
  aiOutput?: Record<string, any>
  feedback?: string
}

/**
 * Workflow step configuration
 */
export interface WorkflowStep {
  stepNumber: number
  sectionId: string
  dependencies?: Array<{ stepNumber: number }>
  isCompleted?: boolean
}

/**
 * Workflow configuration
 */
export interface WorkflowConfig {
  currentStep?: number
  totalSteps?: number
  progress?: number
  stepSequence?: WorkflowStep[]
}

/**
 * Document AI configuration
 */
export interface DocumentAIConfig {
  preferredProviderId?: string
  systemPromptOverrides?: Record<string, any>
  defaultPrompt?: string
}

/**
 * Enhanced document section interface
 */
export interface DocumentSection {
  id: string
  title: string
  documentId: string
  type?: SectionType | string
  content?: any
  order?: number
  inputConfig?: InputConfig
  aiConfig?: AIConfig
  interactionHistory?: InteractionHistory[]
  isCompleted?: boolean
  isGenerated?: boolean
  lastGeneratedAt?: string
}

/**
 * Enhanced flow document interface
 */
export interface FlowDocument {
  id: string
  title: string
  description?: string
  type?: string
  status: DocumentStatus
  businessUnit?: string
  template?: string | any // Can be ID or populated object
  organizationId?: string
  workflow?: WorkflowConfig
  aiConfig?: DocumentAIConfig
  templateId?: string // Legacy support
  sections?: DocumentSection[]
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

/**
 * Generation history entry
 */
export interface GenerationHistory {
  id?: string
  documentId: string
  sectionId: string
  type: GenerationType
  prompt: string
  response: any
  metadata?: Record<string, any>
  createdAt?: string
}

/**
 * Extended PayloadRequest with business context
 */
export interface BusinessPayloadRequest extends PayloadRequest {
  businessContext?: {
    business: string
    [key: string]: any
  }
}

/**
 * AI Provider configuration
 */
export interface AIProvider {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google' | 'local'
  model: string
  apiKey?: string
  endpoint?: string
  options?: Record<string, any>
}

/**
 * Style preferences for content generation
 */
export interface StylePreferences {
  tone: 'formal' | 'casual' | 'professional' | 'friendly'
  length: 'concise' | 'standard' | 'detailed'
  format: 'paragraphs' | 'bullets' | 'mixed'
  audience: 'general' | 'technical' | 'executive'
}

/**
 * Document template interface
 */
export interface DocumentTemplate {
  id: string
  name: string
  description?: string
  sections: string[]
  defaultStyles?: StylePreferences
  metadata?: Record<string, any>
}

/**
 * Auto-cascade configuration
 */
export interface CascadeConfig {
  enabled: boolean
  generationDelay?: number
  maxConcurrent?: number
  requireApproval?: boolean
  stopOnError?: boolean
  notifyOnCompletion?: boolean
}

/**
 * Document context type for React context
 */
export interface DocumentContextType {
  document: FlowDocument | null
  sections: DocumentSection[]
  loading: boolean
  error: string | null
  fetchDocument: (id: string) => Promise<FlowDocument | null>
  fetchSections: (docId: string) => Promise<DocumentSection[]>
  updateDocument: (data: Partial<FlowDocument>) => Promise<FlowDocument | null>
  createSection: (data: Partial<DocumentSection>) => Promise<DocumentSection | null>
  updateSection: (id: string, data: Partial<DocumentSection>) => Promise<DocumentSection | null>
  deleteSection: (id: string) => Promise<boolean>
  reorderSections: (orderedIds: string[]) => Promise<DocumentSection[]>
}

/**
 * Cascade context type for React context
 */
export interface CascadeContextType {
  generating: boolean
  currentSectionId: string | null
  progress: number
  options: GenerationOptions
  history: GenerationHistory[]
  setOptions: (options: GenerationOptions) => void
  generateSection: (sectionId: string) => Promise<boolean>
  generateCascade: (startSectionId: string) => Promise<boolean>
  generateAlternative: (sectionId: string) => Promise<boolean>
  cancelGeneration: () => void
  fetchHistory: (sectionId: string) => Promise<GenerationHistory[]>
}

/**
 * Editor context type for rich text editor
 */
export interface EditorContextType {
  value: any[]
  onChange: (value: any[]) => void
  readOnly: boolean
  toolbarConfig: any
  plugins: any[]
}

/**
 * Generation options
 */
export interface GenerationOptions {
  style?: string
  tone?: string
  length?: string
  temperature?: number
  includeContext?: boolean
  customPrompt?: string
  audience?: string
  keywords?: string[]
  constraints?: string[]
}

/**
 * Auto-cascade workspace props
 */
export interface AutoCascadeWorkspaceProps {
  documentId?: string
  initialData?: Partial<FlowDocument>
  readOnly?: boolean
  embedded?: boolean
  onSave?: (document: FlowDocument) => void
  onCancel?: () => void
}
