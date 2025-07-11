import { getBusinessContext, isValidBusinessMode } from '@/utilities/businessContext'
import { GenerationType } from '@/plugins/job-flow-cascade/types'

import payload from 'payload'
import { buildSectionGenerationPrompt } from '@/plugins/job-flow-cascade/utilities/aiPrompts'

export async function POST(request: Request, { params }: { params: { documentId: string } }) {
  try {
    // Extract business context from request
    const businessContext = getBusinessContext(request)

    // Validate business context - temporarily simplified for basic functionality
    if (businessContext.business !== 'salarium') {
      return Response.json(
        {
          success: false,
          error: `Endpoint not available for business: ${businessContext.business}`,
        },
        { status: 400 },
      )
    }

    // Get the request data
    const { sectionId, prompt, stylePreference = 'formal' } = await request.json()

    // Validate required parameters
    if (!sectionId) {
      return Response.json(
        {
          success: false,
          error: 'Section ID is required',
        },
        { status: 400 },
      )
    }

    // Get the document ID from the URL params
    const { documentId } = params

    // Fetch the actual document from the database
    const document = await payload.findByID({
      collection: 'flow-documents',
      id: documentId,
    })

    if (!document) {
      return Response.json(
        {
          success: false,
          error: 'Document not found',
        },
        { status: 404 },
      )
    }

    // Fetch the section from the database
    const section = await payload.findByID({
      collection: 'document-sections' as any,
      id: sectionId,
    })

    if (!section) {
      return Response.json(
        {
          success: false,
          error: 'Section not found in document',
        },
        { status: 404 },
      )
    }

    // Get previous sections for context
    const previousSections = await payload.find({
      collection: 'document-sections',
      where: {
        documentId: { equals: documentId },
        order: { less_than: (section as any).order },
      },
      sort: 'order',
    })

    // Build the context for AI generation
    const documentContext = {
      title: (document as any).title,
      type: (document as any).businessUnit || 'general', // Use businessUnit as type
      previousSections: previousSections.docs,
    }

    // Build the prompt for AI generation
    const systemPrompt = buildSectionGenerationPrompt(
      documentContext,
      (section as any).title,
      stylePreference,
    )

    // Call the AI provider
    // For now, let's use a sample response until we have the real AI integration
    const generatedContent = [
      {
        type: 'p',
        children: [
          {
            text: `This is auto-generated content for the "${(section as any).title}" section using ${stylePreference} style.`,
          },
        ],
      },
      {
        type: 'p',
        children: [
          {
            text: 'The position requires a highly motivated individual with excellent communication skills and the ability to work in a fast-paced environment.',
          },
        ],
      },
      {
        type: 'p',
        children: [
          {
            text: 'The ideal candidate will have 3-5 years of experience in a similar role, with a proven track record of success.',
          },
        ],
      },
    ]

    // Update the section with the generated content
    await payload.update({
      collection: 'document-sections' as any,
      id: sectionId,
      data: {
        content: generatedContent as any,
        isGenerated: true,
        lastGeneratedAt: new Date().toISOString(),
      },
    })

    // Create a generation history entry
    await payload.create({
      collection: 'generation-history',
      data: {
        documentId,
        sectionId,
        type: 'content_generation', // Use a valid type
        prompt: systemPrompt,
        response: { content: generatedContent },
        metadata: {
          timestamp: new Date().toISOString(),
          stylePreference,
        },
      },
    })

    // Return the generated content
    return Response.json({
      success: true,
      content: generatedContent,
      section: {
        id: sectionId,
        title: (section as any).title,
      },
    })
  } catch (error) {
    console.error('Error processing section:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to process section',
      },
      { status: 500 },
    )
  }
}
