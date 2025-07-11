import { FlowDocument, DocumentSection, DocumentStatus, SectionType } from '../types'
import {
  mapGenericStatusToSalarium,
  mapSalariumStatusToGeneric,
  mapGenericSectionTypeToSalarium,
  mapSalariumSectionTypeToGeneric,
  convertRichTextContent,
} from '../utilities/migrationMappers'

/**
 * Salarium Adapter
 *
 * Provides backward compatibility between the generic Job Flow Cascade model
 * and the original Salarium-specific format. This adapter ensures that existing
 * Salarium components continue to work while using the enhanced schema.
 */

export interface SalariumFlowInstance {
  id: string
  title: string
  jobTitle?: string
  jobSummary?: string
  status: string
  templateId?: string
  currentStep?: number
  totalSteps?: number
  progress?: number
  stepResponses?: SalariumStepResponse[]
  metadata?: Record<string, any>
  createdAt?: string
  updatedAt?: string
}

export interface SalariumStepResponse {
  id?: string
  stepTitle?: string
  title?: string
  type?: string
  stepType?: string
  content?: any
  response?: any
  generatedContent?: any
  isCompleted?: boolean
  isGenerated?: boolean
  order?: number
  placeholder?: string
  defaultValue?: string
  systemPrompt?: string
  lastGeneratedAt?: string
}

export interface SalariumTemplate {
  id: string
  title: string
  name?: string
  description?: string
  category?: string
  steps?: SalariumTemplateStep[]
  sections?: SalariumTemplateStep[]
  isActive?: boolean
  defaultAiProvider?: string
  globalSystemPrompt?: string
  metadata?: Record<string, any>
}

export interface SalariumTemplateStep {
  id?: string
  title?: string
  stepTitle?: string
  type?: string
  stepType?: string
  order?: number
  placeholder?: string
  defaultValue?: string
  systemPrompt?: string
  exampleResponse?: string
  dependencies?: any[]
  defaultContent?: any
}

/**
 * Converts a generic FlowDocument to Salarium FlowInstance format
 */
export function convertDocumentToSalariumInstance(
  document: any,
  sections: any[] = [],
): SalariumFlowInstance {
  return {
    id: document.id,
    title: document.title,
    jobTitle: document.title,
    jobSummary: document.description,
    status: mapGenericStatusToSalarium(document.status),
    templateId:
      document.templateId ||
      (typeof document.template === 'string' ? document.template : undefined),
    currentStep: document.workflow?.currentStep || 0,
    totalSteps: document.workflow?.totalSteps || sections.length,
    progress: document.workflow?.progress || 0,
    stepResponses: sections.map(convertSectionToSalariumStep),
    metadata: {
      ...document.metadata,
      adaptedFrom: 'generic-flow-document',
      adaptedAt: new Date().toISOString(),
    },
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  }
}

/**
 * Converts a generic DocumentSection to Salarium StepResponse format
 */
export function convertSectionToSalariumStep(section: any): SalariumStepResponse {
  return {
    id: section.id,
    title: section.title,
    stepTitle: section.title,
    type: mapGenericSectionTypeToSalarium(section.type || SectionType.CUSTOM),
    stepType: mapGenericSectionTypeToSalarium(section.type || SectionType.CUSTOM),
    content: section.content,
    response: section.content,
    generatedContent: section.content,
    isCompleted: section.isCompleted || false,
    isGenerated: section.isGenerated || false,
    order: section.order || 0,
    placeholder: section.inputConfig?.placeholder,
    defaultValue: section.inputConfig?.defaultValue,
    systemPrompt: section.aiConfig?.systemPrompt,
    lastGeneratedAt: section.lastGeneratedAt,
  }
}

/**
 * Converts a Salarium FlowInstance to generic FlowDocument format
 */
export function convertSalariumInstanceToDocument(instance: SalariumFlowInstance): any {
  return {
    title: instance.title || instance.jobTitle || 'Untitled Document',
    description: instance.jobSummary,
    status: mapSalariumStatusToGeneric(instance.status),
    businessUnit: 'salarium',
    templateId: instance.templateId,
    workflow: {
      currentStep: instance.currentStep || 0,
      totalSteps: instance.totalSteps || 0,
      progress: instance.progress || 0,
      stepSequence: (instance.stepResponses || []).map((step, index) => ({
        stepNumber: index + 1,
        sectionId: step.id || `step_${index}`,
        dependencies: [],
        isCompleted: step.isCompleted || false,
      })),
    },
    aiConfig: {
      preferredProviderId: null,
      systemPromptOverrides: {},
      defaultPrompt: null,
    },
    metadata: {
      ...instance.metadata,
      adaptedFrom: 'salarium-flow-instance',
      adaptedAt: new Date().toISOString(),
    },
  }
}

/**
 * Converts a Salarium StepResponse to generic DocumentSection format
 */
export function convertSalariumStepToSection(step: SalariumStepResponse, documentId: string): any {
  return {
    documentId,
    title: step.title || step.stepTitle || 'Untitled Section',
    type: mapSalariumSectionTypeToGeneric(step.type || step.stepType || 'custom'),
    order: step.order || 0,
    content: convertRichTextContent(step.content || step.response || step.generatedContent),
    inputConfig: {
      placeholder: step.placeholder,
      defaultValue: step.defaultValue,
      isRequired: false,
    },
    aiConfig: {
      systemPrompt: step.systemPrompt,
      temperature: 0.7,
    },
    interactionHistory: [],
    isCompleted: step.isCompleted || false,
    isGenerated: step.isGenerated || false,
    lastGeneratedAt: step.lastGeneratedAt,
  }
}

/**
 * Adapter class for Salarium API compatibility
 */
export class SalariumApiAdapter {
  /**
   * Adapts a generic document API response to Salarium format
   */
  static adaptDocumentResponse(
    document: FlowDocument,
    sections: DocumentSection[] = [],
  ): SalariumFlowInstance {
    return convertDocumentToSalariumInstance(document, sections)
  }

  /**
   * Adapts a Salarium API request to generic format
   */
  static adaptDocumentRequest(instance: Partial<SalariumFlowInstance>): Partial<FlowDocument> {
    return convertSalariumInstanceToDocument(instance as SalariumFlowInstance)
  }

  /**
   * Adapts section responses to Salarium step format
   */
  static adaptSectionsResponse(sections: DocumentSection[]): SalariumStepResponse[] {
    return sections.map(convertSectionToSalariumStep)
  }

  /**
   * Adapts Salarium step requests to generic section format
   */
  static adaptStepRequest(
    step: Partial<SalariumStepResponse>,
    documentId: string,
  ): Partial<DocumentSection> {
    return convertSalariumStepToSection(step as SalariumStepResponse, documentId)
  }

  /**
   * Creates a backward-compatible API response structure
   */
  static createCompatibleResponse(data: any, originalFormat: 'salarium' | 'generic' = 'salarium') {
    if (originalFormat === 'salarium') {
      return {
        success: true,
        data,
        meta: {
          format: 'salarium-compatible',
          adaptedAt: new Date().toISOString(),
        },
      }
    }

    return {
      success: true,
      data,
      meta: {
        format: 'generic',
        version: '2.0',
      },
    }
  }

  /**
   * Handles API errors in a backward-compatible way
   */
  static createCompatibleError(error: string, code: number = 400) {
    return {
      success: false,
      error,
      code,
      meta: {
        format: 'salarium-compatible',
        timestamp: new Date().toISOString(),
      },
    }
  }
}

/**
 * Utility functions for backward compatibility
 */
export const SalariumCompatUtils = {
  /**
   * Checks if a request is from a legacy Salarium client
   */
  isLegacySalariumRequest(headers: any): boolean {
    const userAgent = headers['user-agent'] || ''
    const clientVersion = headers['x-client-version'] || ''

    // Check for legacy client indicators
    return (
      userAgent.includes('SalariumClient') ||
      clientVersion.startsWith('1.') ||
      headers['x-legacy-api'] === 'true'
    )
  },

  /**
   * Determines the appropriate response format based on request
   */
  getResponseFormat(headers: any): 'salarium' | 'generic' {
    if (this.isLegacySalariumRequest(headers)) {
      return 'salarium'
    }

    const acceptFormat = headers['x-response-format'] || 'generic'
    return acceptFormat === 'salarium' ? 'salarium' : 'generic'
  },

  /**
   * Validates that required Salarium fields are present
   */
  validateSalariumData(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.title && !data.jobTitle) {
      errors.push('Missing required field: title or jobTitle')
    }

    if (data.status && !['draft', 'in-progress', 'completed', 'archived'].includes(data.status)) {
      errors.push('Invalid status value')
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  },

  /**
   * Migrates legacy field names to new schema
   */
  migrateLegacyFields(data: any): any {
    const migrated = { ...data }

    // Map legacy field names
    if (data.jobTitle && !data.title) {
      migrated.title = data.jobTitle
    }

    if (data.jobSummary && !data.description) {
      migrated.description = data.jobSummary
    }

    if (data.stepResponses && !data.sections) {
      migrated.sections = data.stepResponses
    }

    return migrated
  },
}

export default SalariumApiAdapter
