/**
 * Job Flow Cascade Plugin Types
 *
 * Type definitions for the Job Flow Cascade plugin collections and components.
 */

import { PayloadRequest } from 'payload'

// Document Status Enum
export enum DocumentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

// Section Type Enum
export enum SectionType {
  INTRODUCTION = 'introduction',
  SUMMARY = 'summary',
  RESPONSIBILITIES = 'responsibilities',
  REQUIREMENTS = 'requirements',
  QUALIFICATIONS = 'qualifications',
  BENEFITS = 'benefits',
  CUSTOM = 'custom',
}

// Generation Type Enum
export enum GenerationType {
  INITIAL = 'initial',
  REFINEMENT = 'refinement',
  ALTERNATIVE = 'alternative',
  MANUAL = 'manual',
}

// Business Context Interface
export interface BusinessContext {
  business: string
  subdomain?: string
  headers?: Record<string, string>
}

// Extended Payload Request with Business Context
export interface BusinessPayloadRequest extends PayloadRequest {
  businessContext?: BusinessContext
}

// Document Interface
export interface FlowDocument {
  id: string
  title: string
  description?: string
  status: DocumentStatus
  businessUnit?: string
  templateId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// Document Section Interface
export interface DocumentSection {
  id: string
  documentId: string
  title: string
  type: SectionType
  order: number
  content?: any[] // Rich text content
  isCompleted: boolean
  isGenerated: boolean
  lastGeneratedAt?: string
  createdAt: string
  updatedAt: string
}

// Generation History Interface
export interface GenerationHistoryEntry {
  id: string
  documentId: string
  sectionId: string
  type: GenerationType
  prompt: string
  response: Record<string, any>
  aiProvider?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
}

// AI Configuration Interface
export interface AIConfiguration {
  preferredProviderId?: string
  systemPromptOverrides?: Record<string, string>
  defaultPrompt?: string
  temperature?: number
}

// Workflow Configuration Interface
export interface WorkflowConfiguration {
  currentStep: number
  totalSteps: number
  progress: number
  stepSequence?: WorkflowStep[]
}

// Workflow Step Interface
export interface WorkflowStep {
  stepNumber: number
  sectionId: string
  dependencies?: number[]
  isCompleted: boolean
}

// Input Configuration Interface
export interface InputConfiguration {
  placeholder?: string
  defaultValue?: string
  minLength?: number
  maxLength?: number
  isRequired: boolean
  validationRules?: ValidationRule[]
  options?: InputOption[]
}

// Validation Rule Interface
export interface ValidationRule {
  rule: string
  errorMessage?: string
}

// Input Option Interface
export interface InputOption {
  label: string
  value: string
  description?: string
}

// Interaction History Interface
export interface InteractionHistoryEntry {
  timestamp: string
  userInput: Record<string, any>
  aiOutput: Record<string, any>
  feedback?: string
}

// Additional types for components and hooks
export enum StylePreference {
  FORMAL = 'formal',
  CASUAL = 'casual',
  TECHNICAL = 'technical',
  CREATIVE = 'creative',
  DETAILED = 'detailed',
  CONCISE = 'concise',
}

// Section Context for AI generation
export interface SectionContext {
  documentTitle: string
  documentType: string
  previousSections: DocumentSection[]
  currentSection: DocumentSection
}

// Cascade Options for AI generation
export interface CascadeOptions {
  stylePreference: StylePreference
  includeContext: boolean
  regenerateAll: boolean
  customPrompt?: string
  startFromSection?: string
  regenerateCompleted?: boolean
  preserveSections?: string[]
  generateAll?: boolean
}

// Cascade State for tracking generation progress
export interface CascadeState {
  isGenerating: boolean
  currentSection?: string
  progress: number
  error?: string | null
  queuedSections?: string[]
  completedSections?: string[]
  generationProgress?: number
  currentSectionIndex?: number
}

// Rich Text Editor Types
export type SlateValue = any[] // Slate.js value type

export interface RichTextEditorOptions {
  placeholder?: string
  readOnly?: boolean
  autoFocus?: boolean
  spellCheck?: boolean
  showToolbar?: boolean
  showFormatPanel?: boolean
  autoSave?: boolean
}
