import { Plugin } from 'payload'
import { FlowTemplates } from './collections/FlowTemplates'
import { FlowInstances } from './collections/FlowInstances'

export const workflowEnginePlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [...(incomingConfig.collections || []), FlowTemplates, FlowInstances],
    endpoints: [
      ...(incomingConfig.endpoints || []),
      {
        path: '/workflow/flow-templates',
        method: 'get',
        handler: async (req) => {
          try {
            const { category, active } = req.query

            const where: any = {}

            if (category) {
              where.category = { equals: category }
            }

            if (active === 'true') {
              where.isActive = { equals: true }
            }

            const templates = await req.payload.find({
              collection: 'flow-templates',
              where,
              limit: 100,
            })

            return Response.json({
              success: true,
              templates: templates.docs,
            })
          } catch (error) {
            console.error('Error fetching flow templates:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to fetch flow templates',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/flow-templates/slug/:slug',
        method: 'get',
        handler: async (req) => {
          try {
            const { slug } = req.routeParams

            const templates = await req.payload.find({
              collection: 'flow-templates',
              where: {
                slug: { equals: slug },
                isActive: { equals: true },
              },
              limit: 1,
            })

            if (templates.docs.length === 0) {
              return Response.json(
                {
                  success: false,
                  error: 'Template not found',
                },
                { status: 404 },
              )
            }

            return Response.json({
              success: true,
              template: templates.docs[0],
            })
          } catch (error) {
            console.error('Error fetching flow template by slug:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to fetch flow template',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/flow-instances',
        method: 'get',
        handler: async (req) => {
          try {
            const { template, limit = '10', status } = req.query

            const where: any = {
              createdBy: { equals: req.user?.id },
            }

            if (template) {
              where.template = { equals: template }
            }

            if (status) {
              where.status = { equals: status }
            }

            const instances = await req.payload.find({
              collection: 'flow-instances',
              where,
              limit: parseInt(limit as string),
              sort: '-createdAt',
            })

            return Response.json({
              success: true,
              instances: instances.docs,
            })
          } catch (error) {
            console.error('Error fetching flow instances:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to fetch flow instances',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/flow-instances',
        method: 'post',
        handler: async (req) => {
          try {
            const body = await req.json()
            const instanceData = {
              ...body,
              createdBy: req.user?.id,
              status: 'draft',
              metadata: {
                ...body.metadata,
                startedAt: new Date().toISOString(),
                aiInteractions: 0,
                regenerations: 0,
                exports: [],
                tags: [],
                notes: '',
              },
            }

            const instance = await req.payload.create({
              collection: 'flow-instances',
              data: instanceData,
            })

            return Response.json(
              {
                success: true,
                instance,
              },
              { status: 201 },
            )
          } catch (error) {
            console.error('Error creating flow instance:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to create flow instance',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/flow-instances/:id',
        method: 'get',
        handler: async (req) => {
          try {
            const { id } = req.routeParams

            const instance = await req.payload.findByID({
              collection: 'flow-instances',
              id,
            })

            // Check if user owns this instance
            if (instance.createdBy !== req.user?.id && req.user?.role !== 'admin') {
              return Response.json(
                {
                  success: false,
                  error: 'Access denied',
                },
                { status: 403 },
              )
            }

            return Response.json({
              success: true,
              instance,
            })
          } catch (error) {
            console.error('Error fetching flow instance:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to fetch flow instance',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/flow-instances/:id',
        method: 'put',
        handler: async (req) => {
          try {
            const { id } = req.routeParams
            const body = await req.json()

            // First check if instance exists and user owns it
            const existingInstance = await req.payload.findByID({
              collection: 'flow-instances',
              id,
            })

            if (existingInstance.createdBy !== req.user?.id && req.user?.role !== 'admin') {
              return Response.json(
                {
                  success: false,
                  error: 'Access denied',
                },
                { status: 403 },
              )
            }

            const updateData = {
              ...body,
              metadata: {
                ...existingInstance.metadata,
                ...body.metadata,
                lastModified: new Date().toISOString(),
              },
            }

            const instance = await req.payload.update({
              collection: 'flow-instances',
              id,
              data: updateData,
            })

            return Response.json({
              success: true,
              instance,
            })
          } catch (error) {
            console.error('Error updating flow instance:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to update flow instance',
              },
              { status: 500 },
            )
          }
        },
      },
      {
        path: '/workflow/ai-process',
        method: 'post',
        handler: async (req) => {
          try {
            const { userInput, systemPrompt, stepNumber, stepType } = await req.json()

            // For now, return mock responses since AI integration is not set up
            const mockResponses: Record<number, string> = {
              1: userInput
                .split(' ')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' '),
              2: `To ${userInput.toLowerCase()} by leveraging cutting-edge technology and innovative solutions in order to drive business growth and deliver exceptional value to our clients and stakeholders.`,
              3: `• Team Leadership: Collaborates with 5-8 team members
• Budget/Resources: No direct budget responsibility
• Geographic Scope: Office with remote collaboration
• Internal Stakeholders: Manager, Product Team, QA Team
• Decision-making Authority: Technical implementation decisions within assigned projects`,
              4: `• Develop and maintain high-quality applications using modern technologies
• Design and implement new features based on requirements and user feedback
• Conduct thorough testing and debugging to ensure quality and system reliability
• Collaborate with cross-functional teams including Product, Design, and QA
• Participate in code reviews to maintain standards and share knowledge
• Troubleshoot and resolve technical issues in production environments`,
              5: `**Required Qualifications:**
• Education: Bachelor's degree in relevant field
• Experience: 2-4 years of professional experience
• Technical Skills: Proficiency in modern technologies and tools
• Technical Skills: Experience with version control systems

**Preferred Qualifications:**
• Experience with cloud platforms
• Knowledge of database design and management
• Previous experience in relevant industry`,
            }

            const response = mockResponses[stepNumber] || `Processed: ${userInput}`

            return Response.json({
              success: true,
              content: response,
            })
          } catch (error) {
            console.error('Error processing AI request:', error)
            return Response.json(
              {
                success: false,
                error: 'Failed to process AI request',
              },
              { status: 500 },
            )
          }
        },
      },
    ],
  }
}
