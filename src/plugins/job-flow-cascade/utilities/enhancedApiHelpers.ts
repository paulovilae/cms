import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GenerationType, FlowDocument, DocumentSection } from '../types'

/**
 * Enhanced API helpers with improved error handling, validation, and business context
 */

// Business context validation
export function validateBusinessContext(req: NextRequest): { business: string; isValid: boolean } {
  const business = req.headers.get('x-business') || 'salarium'
  const validBusinesses = ['salarium', 'intellitrade', 'latinos', 'capacita']

  return {
    business,
    isValid: validBusinesses.includes(business),
  }
}

/**
 * Enhanced document retrieval with validation and error handling
 */
export async function getDocumentWithValidation(documentId: string, businessContext?: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const document = await payload.findByID({
      collection: 'flow-documents' as any,
      id: documentId,
    })

    if (!document) {
      throw new Error('Document not found')
    }

    // Validate business context if provided
    if (businessContext && (document as any).businessUnit !== businessContext) {
      throw new Error('Document does not belong to the specified business unit')
    }

    return document as unknown as FlowDocument
  } catch (error: any) {
    throw new Error(`Error fetching document: ${error.message}`)
  }
}

/**
 * Enhanced section retrieval with validation
 */
export async function getSectionWithValidation(sectionId: string, documentId?: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const section = await payload.findByID({
      collection: 'document-sections' as any,
      id: sectionId,
    })

    if (!section) {
      throw new Error('Section not found')
    }

    // Validate document relationship if provided
    if (documentId && (section as any).documentId !== documentId) {
      throw new Error('Section does not belong to the specified document')
    }

    return section as unknown as DocumentSection
  } catch (error: any) {
    throw new Error(`Error fetching section: ${error.message}`)
  }
}

/**
 * Get all sections for a document with proper sorting
 */
export async function getDocumentSectionsWithValidation(
  documentId: string,
  businessContext?: string,
) {
  const payload = await getPayload({ config: configPromise })

  try {
    // First validate the document exists and belongs to the business
    await getDocumentWithValidation(documentId, businessContext)

    const sections = await payload.find({
      collection: 'document-sections' as any,
      where: {
        documentId: {
          equals: documentId,
        },
      },
      sort: 'order',
      limit: 100, // Reasonable limit for sections
    })

    return sections.docs as unknown as DocumentSection[]
  } catch (error: any) {
    throw new Error(`Error fetching sections: ${error.message}`)
  }
}

/**
 * Create document with validation and default values
 */
export async function createDocumentWithDefaults(
  data: Partial<FlowDocument>,
  businessContext: string,
) {
  const payload = await getPayload({ config: configPromise })

  try {
    const documentData = {
      title: data.title || 'New Job Description',
      status: data.status || 'draft',
      businessUnit: businessContext,
      metadata: {
        ...data.metadata,
        createdAt: new Date().toISOString(),
        version: 1,
      },
    }

    const document = await payload.create({
      collection: 'flow-documents' as any,
      data: documentData as any,
    })

    return document as unknown as FlowDocument
  } catch (error: any) {
    throw new Error(`Error creating document: ${error.message}`)
  }
}

/**
 * Create section with validation
 */
export async function createSectionWithValidation(
  data: Partial<DocumentSection>,
  businessContext?: string,
) {
  const payload = await getPayload({ config: configPromise })

  try {
    // Validate document exists if documentId is provided
    if (data.documentId) {
      await getDocumentWithValidation(data.documentId, businessContext)
    }

    const sectionData = {
      ...data,
      order: data.order ?? 0,
      isCompleted: data.isCompleted ?? false,
      isGenerated: data.isGenerated ?? false,
    }

    const section = await payload.create({
      collection: 'document-sections' as any,
      data: sectionData as any,
    })

    return section as unknown as DocumentSection
  } catch (error: any) {
    throw new Error(`Error creating section: ${error.message}`)
  }
}

/**
 * Update section with validation
 */
export async function updateSectionWithValidation(
  sectionId: string,
  data: Partial<DocumentSection>,
  businessContext?: string,
) {
  const payload = await getPayload({ config: configPromise })

  try {
    // Validate section exists
    const existingSection = await getSectionWithValidation(sectionId)

    // Validate document if business context is provided
    if (businessContext) {
      await getDocumentWithValidation(existingSection.documentId, businessContext)
    }

    // Update lastGeneratedAt if content is being generated
    const updateData = {
      ...data,
      lastGeneratedAt: data.isGenerated ? new Date().toISOString() : data.lastGeneratedAt,
    }

    const section = await payload.update({
      collection: 'document-sections' as any,
      id: sectionId,
      data: updateData as any,
    })

    return section as unknown as DocumentSection
  } catch (error: any) {
    throw new Error(`Error updating section: ${error.message}`)
  }
}

/**
 * Delete section with validation
 */
export async function deleteSectionWithValidation(sectionId: string, businessContext?: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    // Validate section exists
    const existingSection = await getSectionWithValidation(sectionId)

    // Validate document if business context is provided
    if (businessContext) {
      await getDocumentWithValidation(existingSection.documentId, businessContext)
    }

    await payload.delete({
      collection: 'document-sections' as any,
      id: sectionId,
    })

    return true
  } catch (error: any) {
    throw new Error(`Error deleting section: ${error.message}`)
  }
}

/**
 * Log generation to history with enhanced metadata
 */
export async function logGenerationWithMetadata({
  documentId,
  sectionId,
  type,
  prompt,
  response,
  metadata = {},
  businessContext,
}: {
  documentId: string
  sectionId: string
  type: GenerationType
  prompt: string
  response: any
  metadata?: Record<string, any>
  businessContext?: string
}) {
  const payload = await getPayload({ config: configPromise })

  try {
    // Validate document and section exist
    await getDocumentWithValidation(documentId, businessContext)
    await getSectionWithValidation(sectionId, documentId)

    return await payload.create({
      collection: 'generation-history' as any,
      data: {
        documentId,
        sectionId,
        type: type as any,
        prompt,
        response,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          businessUnit: businessContext,
          userAgent: metadata.userAgent || 'unknown',
          ipAddress: metadata.ipAddress || 'unknown',
        },
      } as any,
    })
  } catch (error: any) {
    console.error('Error logging generation:', error)
    // Non-critical error, don't throw
    return null
  }
}

/**
 * Enhanced error response helper with detailed error information
 */
export function createErrorResponse(message: string, status: number = 400, details?: any) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: details || null,
      timestamp: new Date().toISOString(),
    },
    {
      status,
    },
  )
}

/**
 * Enhanced success response helper
 */
export function createSuccessResponse(data: any, status: number = 200, message?: string) {
  return NextResponse.json(
    {
      success: true,
      message: message || 'Operation completed successfully',
      data,
      timestamp: new Date().toISOString(),
    },
    {
      status,
    },
  )
}

/**
 * Validate request body for required fields
 */
export function validateRequiredFields(body: any, requiredFields: string[]): string[] {
  const missingFields: string[] = []

  for (const field of requiredFields) {
    if (!body[field] && body[field] !== 0 && body[field] !== false) {
      missingFields.push(field)
    }
  }

  return missingFields
}

/**
 * Sanitize and validate document data
 */
export function sanitizeDocumentData(data: any): Partial<FlowDocument> {
  return {
    title: typeof data.title === 'string' ? data.title.trim() : undefined,
    status: ['draft', 'in-progress', 'completed', 'archived'].includes(data.status)
      ? data.status
      : undefined,
    businessUnit: ['salarium', 'intellitrade', 'latinos', 'capacita'].includes(data.businessUnit)
      ? data.businessUnit
      : undefined,
    metadata: typeof data.metadata === 'object' ? data.metadata : undefined,
  }
}

/**
 * Sanitize and validate section data
 */
export function sanitizeSectionData(data: any): Partial<DocumentSection> {
  return {
    title: typeof data.title === 'string' ? data.title.trim() : undefined,
    documentId: typeof data.documentId === 'string' ? data.documentId : undefined,
    type: [
      'introduction',
      'summary',
      'responsibilities',
      'requirements',
      'qualifications',
      'benefits',
      'custom',
    ].includes(data.type)
      ? data.type
      : undefined,
    content: data.content || undefined,
    order: typeof data.order === 'number' ? Math.max(0, data.order) : undefined,
    isCompleted: typeof data.isCompleted === 'boolean' ? data.isCompleted : undefined,
    isGenerated: typeof data.isGenerated === 'boolean' ? data.isGenerated : undefined,
    lastGeneratedAt: typeof data.lastGeneratedAt === 'string' ? data.lastGeneratedAt : undefined,
  }
}

/**
 * Rate limiting helper (basic implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000,
): boolean {
  const now = Date.now()
  const windowStart = now - windowMs

  const current = rateLimitMap.get(identifier)

  if (!current || current.resetTime < windowStart) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (current.count >= maxRequests) {
    return false
  }

  current.count++
  return true
}
