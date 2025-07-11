import { getBusinessContext, isValidBusinessMode } from '@/utilities/businessContext'
import payload from 'payload'
import { FlowInstance } from '@/payload-types'

export async function POST(request: Request, { params }: { params: { documentId: string } }) {
  try {
    // Extract business context from request
    const businessContext = getBusinessContext(request)

    // Validate business context
    if (!isValidBusinessMode(businessContext.business)) {
      return Response.json(
        {
          success: false,
          error: `Endpoint not available for business: ${businessContext.business}`,
        },
        { status: 400 },
      )
    }

    // Get the request data
    const { sectionId, content } = await request.json()

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

    if (!content) {
      return Response.json(
        {
          success: false,
          error: 'Content is required',
        },
        { status: 400 },
      )
    }

    // Get the document ID from the URL params
    const { documentId } = params

    // Fetch the flow instance to verify it exists
    const flowInstance = (await payload.findByID({
      collection: 'flow-instances',
      id: documentId,
    })) as FlowInstance

    if (!flowInstance) {
      return Response.json(
        {
          success: false,
          error: 'Flow instance not found',
        },
        { status: 404 },
      )
    }

    // Find the step response to update
    const stepResponses = flowInstance.stepResponses || []
    const stepIndex = stepResponses.findIndex((step) => step.stepNumber === parseInt(sectionId))

    if (stepIndex === -1) {
      return Response.json(
        {
          success: false,
          error: 'Step not found in flow instance',
        },
        { status: 404 },
      )
    }

    // Update the step response
    const updatedStepResponses = [...stepResponses]
    const currentStep = updatedStepResponses[stepIndex]

    if (!currentStep) {
      return Response.json(
        {
          success: false,
          error: 'Step data not found',
        },
        { status: 404 },
      )
    }

    updatedStepResponses[stepIndex] = {
      ...currentStep,
      stepNumber: currentStep.stepNumber,
      stepTitle: currentStep.stepTitle,
      aiGeneratedContent: content,
      isCompleted: true,
    }

    // Update the flow instance
    const updatedFlowInstance = await payload.update({
      collection: 'flow-instances',
      id: documentId,
      data: {
        stepResponses: updatedStepResponses,
      },
    })

    return Response.json({
      success: true,
      message: 'Step content updated successfully',
      flowInstance: updatedFlowInstance,
    })
  } catch (error) {
    console.error('Error updating section:', error)
    return Response.json(
      {
        success: false,
        error: 'Failed to update section',
      },
      { status: 500 },
    )
  }
}
