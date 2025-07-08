import { PayloadRequest, Endpoint } from 'payload'

/**
 * Flow Instances API Endpoints for Salarium
 * Provides CRUD operations for flow instances (workflow progress)
 */

/**
 * Get Flow Instances Endpoint
 * GET /api/salarium/flow-instances
 * Query params: user, template, status, limit, page
 */
export const flowInstancesEndpoint: Endpoint = {
  path: '/salarium/flow-instances',
  method: 'get',
  handler: async (req: any) => {
    try {
      const { payload, user } = req

      if (!user) {
        return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
      }

      // Get query parameters
      const url = new URL(req.url)
      const templateId = url.searchParams.get('template')
      const status = url.searchParams.get('status')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const page = parseInt(url.searchParams.get('page') || '1')

      // Build query conditions
      const where: any = {
        user: { equals: user.id },
      }

      if (templateId) {
        where.template = { equals: templateId }
      }

      if (status) {
        where.status = { equals: status }
      }

      const instances = await payload.find({
        collection: 'flow-instances',
        where,
        depth: 2, // Include template and user data
        limit,
        page,
        sort: '-updatedAt',
      })

      return Response.json({
        success: true,
        instances: instances.docs,
        totalDocs: instances.totalDocs,
        page: instances.page,
        totalPages: instances.totalPages,
      })
    } catch (error) {
      console.error('Flow instances endpoint error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch instances',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Create Flow Instance Endpoint
 * POST /api/salarium/flow-instances
 */
export const createFlowInstanceEndpoint: Endpoint = {
  path: '/salarium/flow-instances',
  method: 'post',
  handler: async (req: any) => {
    try {
      const { payload, user } = req

      if (!user) {
        return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
      }

      const body = await req.json()
      const { title, templateId, stepResponses, currentStep, organizationId, finalDocument } = body

      if (!title || !templateId) {
        return Response.json(
          { success: false, error: 'Title and template ID are required' },
          { status: 400 },
        )
      }

      // Get template to extract total steps
      const template = await payload.findByID({
        collection: 'flow-templates',
        id: templateId,
      })

      if (!template) {
        return Response.json({ success: false, error: 'Template not found' }, { status: 404 })
      }

      // Process step responses to ensure they have required fields
      const processedStepResponses = (stepResponses || []).map((step: any, index: number) => {
        const templateStep = template.steps?.[index]
        return {
          stepNumber: step.stepNumber || index + 1,
          stepTitle: templateStep?.title || `Step ${step.stepNumber || index + 1}`,
          userInput: step.userInput || '',
          aiGeneratedContent: step.aiGeneratedContent || '',
          isCompleted: step.isCompleted || false,
          completedAt: step.isCompleted ? new Date() : undefined,
          versions: [], // Initialize empty versions array
        }
      })

      // Calculate progress
      const completedSteps = processedStepResponses.filter((step: any) => step.isCompleted).length
      const totalSteps = template.steps?.length || 0
      const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

      const instanceData = {
        title,
        template: templateId,
        user: user.id,
        organizationId: organizationId || user.organizationId,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'draft',
        currentStep: currentStep || 1,
        totalSteps,
        progress,
        stepResponses: processedStepResponses,
        finalDocument: finalDocument || '',
        documentFormat: 'markdown',
        collaborators: [], // Initialize empty collaborators array
        metadata: {
          startedAt: new Date(),
          aiInteractions: 0,
          regenerations: 0,
          exports: [], // Initialize empty exports array
          tags: [], // Initialize empty tags array
          notes: '',
        },
        settings: {
          autoSave: true,
          language: 'en',
          isPublic: false,
          allowComments: false,
        },
      }

      const instance = await payload.create({
        collection: 'flow-instances',
        data: instanceData,
      })

      return Response.json({
        success: true,
        instance,
      })
    } catch (error) {
      console.error('Create flow instance error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to create instance',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Update Flow Instance Endpoint
 * PUT /api/salarium/flow-instances/[id]
 */
export const updateFlowInstanceEndpoint: Endpoint = {
  path: '/salarium/flow-instances/:id',
  method: 'put',
  handler: async (req: any) => {
    try {
      const { payload, user } = req

      if (!user) {
        return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
      }

      // Extract instance ID from URL path
      const url = new URL(req.url)
      const pathParts = url.pathname.split('/').filter(Boolean)
      const instanceId = pathParts[pathParts.length - 1]

      console.log('Update endpoint - URL:', req.url)
      console.log('Update endpoint - Path parts:', pathParts)
      console.log('Update endpoint - Instance ID:', instanceId)

      if (!instanceId || instanceId === 'flow-instances') {
        console.log('Update - Invalid instance ID:', instanceId)
        return Response.json({ success: false, error: 'Instance ID is required' }, { status: 400 })
      }

      const body = await req.json()
      const { stepResponses, currentStep, finalDocument, status } = body

      console.log('Update endpoint - Request body:', {
        stepResponses: stepResponses?.length,
        currentStep,
        finalDocument: !!finalDocument,
        status,
      })

      // Get existing instance to verify ownership
      let existingInstance
      try {
        existingInstance = await payload.findByID({
          collection: 'flow-instances',
          id: instanceId,
        })
      } catch (error) {
        console.error('Error finding instance:', error)
        return Response.json({ success: false, error: 'Instance not found' }, { status: 404 })
      }

      if (!existingInstance) {
        console.log('Instance not found in database:', instanceId)
        return Response.json({ success: false, error: 'Instance not found' }, { status: 404 })
      }

      console.log(
        'Found existing instance:',
        existingInstance.id,
        'owned by:',
        existingInstance.user,
      )

      if (existingInstance.user !== user.id) {
        console.log('Access denied - user:', user.id, 'instance owner:', existingInstance.user)
        return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
      }

      // Calculate progress if stepResponses provided
      let updateData: any = {}

      if (stepResponses) {
        // Process step responses to ensure they have required fields (similar to create endpoint)
        const processedStepResponses = stepResponses.map((step: any, index: number) => {
          return {
            stepNumber: step.stepNumber || index + 1,
            stepTitle: step.stepTitle || `Step ${step.stepNumber || index + 1}`,
            userInput: step.userInput || '',
            aiGeneratedContent: step.aiGeneratedContent || '',
            isCompleted: step.isCompleted || false,
            completedAt: step.isCompleted ? new Date() : step.completedAt,
            versions: step.versions || [], // Preserve existing versions
          }
        })

        const completedSteps = processedStepResponses.filter((step: any) => step.isCompleted).length
        const totalSteps = existingInstance.totalSteps || 0
        const progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

        updateData = {
          stepResponses: processedStepResponses,
          progress,
          status:
            status || (progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'draft'),
        }

        // Update metadata
        updateData.metadata = {
          ...existingInstance.metadata,
          aiInteractions: (existingInstance.metadata?.aiInteractions || 0) + 1,
        }

        if (progress === 100 && !existingInstance.metadata?.completedAt) {
          updateData.metadata.completedAt = new Date()
        }
      }

      if (currentStep !== undefined) {
        updateData.currentStep = currentStep
      }

      if (finalDocument !== undefined) {
        updateData.finalDocument = finalDocument
      }

      // Update instance title if the first step (job title) has changed
      if (stepResponses && stepResponses.length > 0) {
        const firstStepResponse = stepResponses[0]
        if (
          firstStepResponse &&
          (firstStepResponse.aiGeneratedContent || firstStepResponse.userInput)
        ) {
          const getJobTitle = () => {
            const jobTitle = firstStepResponse.aiGeneratedContent || firstStepResponse.userInput
            if (jobTitle && jobTitle.trim()) {
              // Clean up the job title - remove extra whitespace, newlines, and limit length
              return jobTitle.trim().replace(/\s+/g, ' ').substring(0, 50)
            }
            return 'Untitled Position'
          }

          const formatDateTime = (date?: Date) => {
            const targetDate = date || new Date()
            const dateStr = targetDate.toLocaleDateString('en-US', {
              month: 'numeric',
              day: 'numeric',
              year: 'numeric',
            })
            const timeStr = targetDate.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            })
            return `${dateStr} - ${timeStr}`
          }

          const jobTitle = getJobTitle()

          // Use the original creation date for consistency, not current date
          const creationDate = existingInstance.createdAt
            ? new Date(existingInstance.createdAt)
            : new Date()
          const dateTime = formatDateTime(creationDate)
          const newTitle = `Job Description - ${jobTitle} - ${dateTime}`

          // Update title if the job title has actually changed
          const currentTitleParts = existingInstance.title.split(' - ')
          const currentJobTitle =
            currentTitleParts.length >= 2 ? currentTitleParts[1] : 'Untitled Position'

          if (jobTitle !== currentJobTitle) {
            updateData.title = newTitle
            console.log('Updating instance title from:', existingInstance.title)
            console.log('Updating instance title to:', newTitle)
          }
        }
      }

      console.log('Update data:', updateData)

      const updatedInstance = await payload.update({
        collection: 'flow-instances',
        id: instanceId,
        data: updateData,
      })

      return Response.json({
        success: true,
        instance: updatedInstance,
      })
    } catch (error) {
      console.error('Update flow instance error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to update instance',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Get Flow Instance by ID Endpoint
 * GET /api/salarium/flow-instances/[id]
 */
export const getFlowInstanceEndpoint: Endpoint = {
  path: '/salarium/flow-instances/:id',
  method: 'get',
  handler: async (req: any) => {
    try {
      const { payload, user } = req

      if (!user) {
        return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
      }

      // Extract instance ID from URL path
      const url = new URL(req.url)
      const pathParts = url.pathname.split('/').filter(Boolean)
      const instanceId = pathParts[pathParts.length - 1]

      console.log('Get endpoint - URL:', req.url)
      console.log('Get endpoint - Path parts:', pathParts)
      console.log('Get endpoint - Instance ID:', instanceId)

      if (!instanceId || instanceId === 'flow-instances') {
        console.log('Get - Invalid instance ID:', instanceId)
        return Response.json({ success: false, error: 'Instance ID is required' }, { status: 400 })
      }

      const instance = await payload.findByID({
        collection: 'flow-instances',
        id: instanceId,
        depth: 2, // Include template and user data
      })

      if (!instance) {
        return Response.json({ success: false, error: 'Instance not found' }, { status: 404 })
      }

      // Check access permissions
      if (instance.user !== user.id) {
        // Check if user is a collaborator
        const hasAccess = instance.collaborators?.some((collab: any) => collab.user === user.id)

        if (!hasAccess) {
          return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
        }
      }

      return Response.json({
        success: true,
        instance,
      })
    } catch (error) {
      console.error('Get flow instance error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to fetch instance',
        },
        { status: 500 },
      )
    }
  },
}

/**
 * Delete Flow Instance Endpoint
 * DELETE /api/salarium/flow-instances/[id]
 */
export const deleteFlowInstanceEndpoint: Endpoint = {
  path: '/salarium/flow-instances/:id',
  method: 'delete',
  handler: async (req: any) => {
    try {
      const { payload, user } = req

      if (!user) {
        return Response.json({ success: false, error: 'Authentication required' }, { status: 401 })
      }

      // Extract instance ID from URL path
      const url = new URL(req.url)
      const pathParts = url.pathname.split('/').filter(Boolean)
      const instanceId = pathParts[pathParts.length - 1]

      console.log('Delete endpoint - URL:', req.url)
      console.log('Delete endpoint - Path parts:', pathParts)
      console.log('Delete endpoint - Instance ID:', instanceId)

      if (!instanceId || instanceId === 'flow-instances') {
        console.log('Invalid instance ID:', instanceId)
        return Response.json({ success: false, error: 'Instance ID is required' }, { status: 400 })
      }

      // Get existing instance to verify ownership
      const existingInstance = await payload.findByID({
        collection: 'flow-instances',
        id: instanceId,
      })

      if (!existingInstance) {
        console.log('Delete - Instance not found in database:', instanceId)
        return Response.json({ success: false, error: 'Instance not found' }, { status: 404 })
      }

      console.log(
        'Delete - Found existing instance:',
        existingInstance.id,
        'owned by:',
        existingInstance.user,
      )
      console.log('Delete - Current user:', user.id)
      console.log('Delete - User types:', typeof existingInstance.user, typeof user.id)
      console.log('Delete - User comparison:', existingInstance.user === user.id)

      // Handle both string and object user references
      const instanceUserId =
        typeof existingInstance.user === 'object' ? existingInstance.user.id : existingInstance.user

      if (instanceUserId !== user.id) {
        console.log(
          'Delete - Access denied - instance user:',
          instanceUserId,
          'current user:',
          user.id,
        )
        return Response.json({ success: false, error: 'Access denied' }, { status: 403 })
      }

      console.log('Delete - Access granted, proceeding with deletion')

      await payload.delete({
        collection: 'flow-instances',
        id: instanceId,
      })

      return Response.json({
        success: true,
        message: 'Instance deleted successfully',
      })
    } catch (error) {
      console.error('Delete flow instance error:', error)

      return Response.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to delete instance',
        },
        { status: 500 },
      )
    }
  },
}

export default flowInstancesEndpoint
