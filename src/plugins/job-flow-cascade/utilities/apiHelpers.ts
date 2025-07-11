import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { GenerationType } from '../types'

/**
 * Get document and validate it exists
 */
export async function getDocument(documentId: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const document = await payload.findByID({
      collection: 'flow-documents' as any,
      id: documentId,
    })

    if (!document) {
      throw new Error('Document not found')
    }

    return document
  } catch (error: any) {
    throw new Error(`Error fetching document: ${error.message}`)
  }
}

/**
 * Get section and validate it belongs to document
 */
export async function getSection(sectionId: string, documentId: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const section = await payload.findByID({
      collection: 'document-sections' as any,
      id: sectionId,
    })

    if (!section) {
      throw new Error('Section not found')
    }

    if ((section as any).documentId !== documentId) {
      throw new Error('Section does not belong to document')
    }

    return section
  } catch (error: any) {
    throw new Error(`Error fetching section: ${error.message}`)
  }
}

/**
 * Get all sections for a document
 */
export async function getDocumentSections(documentId: string) {
  const payload = await getPayload({ config: configPromise })

  try {
    const sections = await payload.find({
      collection: 'document-sections' as any,
      where: {
        documentId: {
          equals: documentId,
        },
      },
      sort: 'order',
    })

    return sections.docs
  } catch (error: any) {
    throw new Error(`Error fetching sections: ${error.message}`)
  }
}

/**
 * Log generation to history
 */
export async function logGeneration({
  documentId,
  sectionId,
  type,
  prompt,
  response,
  metadata = {},
}: {
  documentId: string
  sectionId: string
  type: GenerationType
  prompt: string
  response: any
  metadata?: Record<string, any>
}) {
  const payload = await getPayload({ config: configPromise })

  try {
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
        },
      },
    })
  } catch (error: any) {
    console.error('Error logging generation:', error)
    // Non-critical error, don't throw
  }
}

/**
 * Update section content
 */
export async function updateSectionContent(
  sectionId: string,
  content: any,
  isGenerated: boolean = true,
) {
  const payload = await getPayload({ config: configPromise })

  try {
    return await payload.update({
      collection: 'document-sections' as any,
      id: sectionId,
      data: {
        content,
        isGenerated,
        isCompleted: true,
        lastGeneratedAt: isGenerated ? new Date().toISOString() : undefined,
      } as any,
    })
  } catch (error: any) {
    throw new Error(`Error updating section: ${error.message}`)
  }
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
    },
  )
}

/**
 * Success response helper
 */
export function successResponse(data: any, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    },
    {
      status,
    },
  )
}
