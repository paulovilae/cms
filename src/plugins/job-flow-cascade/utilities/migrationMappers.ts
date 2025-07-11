import { DocumentStatus, SectionType, FlowDocument, DocumentSection } from '../types'

/**
 * Migration Mappers
 *
 * Utilities for mapping between Salarium-specific and generic Job Flow Cascade formats
 */

/**
 * Maps Salarium flow instance status to generic document status
 */
export function mapSalariumStatusToGeneric(salariumStatus: string): DocumentStatus {
  const statusMap: Record<string, DocumentStatus> = {
    draft: DocumentStatus.DRAFT,
    'in-progress': DocumentStatus.IN_PROGRESS,
    in_progress: DocumentStatus.IN_PROGRESS,
    completed: DocumentStatus.COMPLETED,
    complete: DocumentStatus.COMPLETED,
    archived: DocumentStatus.ARCHIVED,
    active: DocumentStatus.IN_PROGRESS,
    inactive: DocumentStatus.ARCHIVED,
  }

  return statusMap[salariumStatus.toLowerCase()] || DocumentStatus.DRAFT
}

/**
 * Maps generic document status back to Salarium format for backward compatibility
 */
export function mapGenericStatusToSalarium(genericStatus: DocumentStatus): string {
  const statusMap: Record<DocumentStatus, string> = {
    [DocumentStatus.DRAFT]: 'draft',
    [DocumentStatus.IN_PROGRESS]: 'in-progress',
    [DocumentStatus.COMPLETED]: 'completed',
    [DocumentStatus.ARCHIVED]: 'archived',
  }

  return statusMap[genericStatus] || 'draft'
}

/**
 * Maps Salarium section types to generic section types
 */
export function mapSalariumSectionTypeToGeneric(salariumType: string): SectionType | string {
  const typeMap: Record<string, SectionType | string> = {
    job_title: SectionType.INTRODUCTION,
    job_summary: SectionType.SUMMARY,
    job_description: SectionType.SUMMARY,
    responsibilities: SectionType.RESPONSIBILITIES,
    requirements: SectionType.REQUIREMENTS,
    qualifications: SectionType.QUALIFICATIONS,
    benefits: SectionType.BENEFITS,
    company_overview: SectionType.INTRODUCTION,
    salary_range: SectionType.BENEFITS,
    location: SectionType.CUSTOM,
    employment_type: SectionType.CUSTOM,
    experience_level: SectionType.REQUIREMENTS,
    education: SectionType.QUALIFICATIONS,
    skills: SectionType.QUALIFICATIONS,
    custom: SectionType.CUSTOM,
    // New input types
    text_input: 'text_input',
    rich_text: 'rich_text',
    multiple_choice: 'multiple_choice',
    checkbox: 'checkbox',
    radio_group: 'radio_group',
    date_input: 'date_input',
    file_upload: 'file_upload',
    ai_generated: 'ai_generated',
  }

  return typeMap[salariumType.toLowerCase()] || SectionType.CUSTOM
}

/**
 * Maps generic section types back to Salarium format
 */
export function mapGenericSectionTypeToSalarium(genericType: SectionType | string): string {
  const typeMap: Record<string, string> = {
    [SectionType.INTRODUCTION]: 'job_title',
    [SectionType.SUMMARY]: 'job_summary',
    [SectionType.RESPONSIBILITIES]: 'responsibilities',
    [SectionType.REQUIREMENTS]: 'requirements',
    [SectionType.QUALIFICATIONS]: 'qualifications',
    [SectionType.BENEFITS]: 'benefits',
    [SectionType.CUSTOM]: 'custom',
    // Input types remain the same
    text_input: 'text_input',
    rich_text: 'rich_text',
    multiple_choice: 'multiple_choice',
    checkbox: 'checkbox',
    radio_group: 'radio_group',
    date_input: 'date_input',
    file_upload: 'file_upload',
    ai_generated: 'ai_generated',
  }

  return typeMap[genericType] || 'custom'
}

/**
 * Converts Salarium flow instance to generic flow document
 */
export function convertSalariumInstanceToDocument(salariumInstance: any): Partial<FlowDocument> {
  return {
    title: salariumInstance.title || salariumInstance.jobTitle || 'Untitled Document',
    description: salariumInstance.description || salariumInstance.jobSummary,
    status: mapSalariumStatusToGeneric(salariumInstance.status || 'draft'),
    businessUnit: 'salarium',
    templateId: salariumInstance.templateId || salariumInstance.template,
    organizationId: salariumInstance.organizationId,
    workflow: {
      currentStep: salariumInstance.currentStep || 0,
      totalSteps: salariumInstance.totalSteps || 0,
      progress: salariumInstance.progress || 0,
      stepSequence: salariumInstance.stepSequence || [],
    },
    aiConfig: {
      preferredProviderId: salariumInstance.aiProvider,
      systemPromptOverrides: salariumInstance.systemPrompts,
      defaultPrompt: salariumInstance.defaultPrompt,
    },
    metadata: {
      ...salariumInstance.metadata,
      migratedFrom: 'salarium-flow-instance',
      originalId: salariumInstance.id,
      migrationDate: new Date().toISOString(),
    },
  }
}

/**
 * Converts Salarium step response to generic document section
 */
export function convertSalariumStepToSection(
  stepResponse: any,
  documentId: string,
  order: number,
): any {
  return {
    documentId,
    title: stepResponse.title || stepResponse.stepTitle || `Section ${order + 1}`,
    type: mapSalariumSectionTypeToGeneric(
      stepResponse.type || stepResponse.stepType,
    ) as SectionType,
    order,
    content: stepResponse.content || stepResponse.response || stepResponse.generatedContent,
    inputConfig: {
      placeholder: stepResponse.placeholder,
      defaultValue: stepResponse.defaultValue,
      minLength: stepResponse.minLength,
      maxLength: stepResponse.maxLength,
      isRequired: stepResponse.isRequired || false,
      validationRules: stepResponse.validationRules || [],
      options: stepResponse.options || [],
    },
    aiConfig: {
      systemPrompt: stepResponse.systemPrompt,
      exampleResponse: stepResponse.exampleResponse,
      inputMapping: stepResponse.inputMapping,
      temperature: stepResponse.temperature || 0.7,
    },
    interactionHistory: stepResponse.interactionHistory || [],
    isCompleted: stepResponse.isCompleted || false,
    isGenerated: stepResponse.isGenerated || false,
    lastGeneratedAt: stepResponse.lastGeneratedAt,
  }
}

/**
 * Converts Salarium template to generic job flow template
 */
export function convertSalariumTemplateToGeneric(salariumTemplate: any): any {
  return {
    title: salariumTemplate.title || salariumTemplate.name,
    description: salariumTemplate.description,
    category: salariumTemplate.category || 'Job Descriptions',
    businessUnit: 'salarium',
    isActive: salariumTemplate.isActive !== false,
    sections: (salariumTemplate.steps || salariumTemplate.sections || []).map(
      (step: any, index: number) => ({
        title: step.title || step.stepTitle || `Step ${index + 1}`,
        type: mapSalariumSectionTypeToGeneric(step.type || step.stepType),
        order: step.order || index,
        inputConfig: {
          placeholder: step.placeholder,
          defaultValue: step.defaultValue,
          minLength: step.minLength,
          maxLength: step.maxLength,
          isRequired: step.isRequired || false,
          validationRules: step.validationRules || [],
          options: step.options || [],
        },
        aiConfig: {
          systemPrompt: step.systemPrompt,
          exampleResponse: step.exampleResponse,
          inputMapping: step.inputMapping,
          temperature: step.temperature || 0.7,
        },
        defaultContent: step.defaultContent,
        dependencies: step.dependencies || [],
      }),
    ),
    defaultAiProvider: salariumTemplate.defaultAiProvider,
    globalSystemPrompt: salariumTemplate.globalSystemPrompt,
    workflow: {
      enableCascade: salariumTemplate.enableCascade !== false,
      requireApproval: salariumTemplate.requireApproval || false,
      maxConcurrentSections: salariumTemplate.maxConcurrentSections || 1,
    },
    metadata: {
      ...salariumTemplate.metadata,
      migratedFrom: 'salarium-flow-template',
      originalId: salariumTemplate.id,
      migrationDate: new Date().toISOString(),
    },
  }
}

/**
 * Converts rich text content between formats
 */
export function convertRichTextContent(content: any): any {
  if (!content) return null

  // If it's already in Slate.js format, return as-is
  if (Array.isArray(content) && content.length > 0 && content[0].type) {
    return content
  }

  // If it's a string, convert to basic Slate.js format
  if (typeof content === 'string') {
    return [
      {
        type: 'paragraph',
        children: [{ text: content }],
      },
    ]
  }

  // If it's HTML, convert to Slate.js format (basic conversion)
  if (typeof content === 'string' && content.includes('<')) {
    // This is a simplified conversion - in production, you'd want a proper HTML parser
    const textContent = content.replace(/<[^>]*>/g, '')
    return [
      {
        type: 'paragraph',
        children: [{ text: textContent }],
      },
    ]
  }

  return content
}

/**
 * Validates migration data integrity
 */
export function validateMigrationData(originalData: any, convertedData: any): boolean {
  const errors: string[] = []

  // Check required fields
  if (!convertedData.title) {
    errors.push('Missing title in converted data')
  }

  if (!convertedData.status) {
    errors.push('Missing status in converted data')
  }

  // Check data consistency
  if (originalData.id && !convertedData.metadata?.originalId) {
    errors.push('Original ID not preserved in metadata')
  }

  if (errors.length > 0) {
    console.error('Migration validation errors:', errors)
    return false
  }

  return true
}

/**
 * Creates a mapping between template steps and document sections
 */
export function createStepToSectionMapping(
  templateSteps: any[],
  documentSections: DocumentSection[],
): Record<string, string> {
  const mapping: Record<string, string> = {}

  templateSteps.forEach((step, index) => {
    const matchingSection = documentSections.find(
      (section) => section.order === index || section.title === step.title,
    )

    if (matchingSection) {
      mapping[step.id || `step_${index}`] = matchingSection.id
    }
  })

  return mapping
}

/**
 * Generates workflow step sequence from template sections
 */
export function generateWorkflowStepSequence(templateSections: any[]): any[] {
  return templateSections.map((section, index) => ({
    stepNumber: index + 1,
    sectionId: section.id || `section_${index}`,
    dependencies:
      section.dependencies?.map((dep: any) => ({
        stepNumber: dep.stepNumber || dep.order || 0,
      })) || [],
    isCompleted: false,
  }))
}
