import { getBusinessContext, isValidBusinessMode } from '@/utilities/businessContext'

export async function GET(request: Request, { params }: { params: { documentId: string } }) {
  try {
    // Extract business context from request
    const businessContext = getBusinessContext(request)

    // Validate business context
    if (!isValidBusinessMode(businessContext.business, ['salarium'])) {
      return Response.json(
        {
          success: false,
          error: `Endpoint not available for business: ${businessContext.business}`,
        },
        { status: 400 },
      )
    }

    // Get the document ID from the URL params
    const { documentId } = params

    // In a real implementation, this would fetch the document from the database
    // For now, we'll return mock data

    // Mock document data with sections
    const mockDocument = {
      id: documentId,
      title: 'Senior Software Engineer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sections: [
        {
          id: 'section1',
          title: 'Job Overview',
          stepNumber: 1,
          isCompleted: true,
          content: [
            {
              type: 'p',
              children: [
                {
                  text: 'We are seeking a Senior Software Engineer to join our dynamic team.',
                },
              ],
            },
          ],
        },
        {
          id: 'section2',
          title: 'Responsibilities',
          stepNumber: 2,
          isCompleted: false,
          content: [],
        },
        {
          id: 'section3',
          title: 'Requirements',
          stepNumber: 3,
          isCompleted: false,
          content: [],
        },
        {
          id: 'section4',
          title: 'Benefits',
          stepNumber: 4,
          isCompleted: false,
          content: [],
        },
      ],
    }

    return Response.json({
      success: true,
      data: mockDocument,
    })
  } catch (error) {
    console.error('Error fetching document:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to fetch document',
      },
      { status: 500 },
    )
  }
}
