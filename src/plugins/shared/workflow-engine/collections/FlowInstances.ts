import { CollectionConfig } from 'payload'

export const FlowInstances: CollectionConfig = {
  slug: 'flow-instances',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'progress', 'createdAt'],
    group: 'Workflow Engine',
  },
  access: {
    read: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return {
        createdBy: { equals: req.user?.id },
      }
    },
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return {
        createdBy: { equals: req.user?.id },
      }
    },
    delete: ({ req }) => {
      if (req.user?.role === 'admin') return true
      return {
        createdBy: { equals: req.user?.id },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Descriptive title for this workflow instance',
      },
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'flow-templates',
      required: true,
      admin: {
        description: 'The template this instance is based on',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who created this instance',
        readOnly: true,
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Paused', value: 'paused' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Current status of this workflow instance',
      },
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'Completion percentage (0-100)',
      },
    },
    {
      name: 'currentStep',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Current step number in the workflow',
      },
    },
    {
      name: 'stepResponses',
      type: 'array',
      admin: {
        description: 'User responses and AI-generated content for each step',
      },
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
          admin: {
            description: 'Step number this response belongs to',
          },
        },
        {
          name: 'stepTitle',
          type: 'text',
          admin: {
            description: 'Title of the step (for reference)',
          },
        },
        {
          name: 'userInput',
          type: 'textarea',
          admin: {
            description: 'Original user input for this step',
          },
        },
        {
          name: 'aiGeneratedContent',
          type: 'textarea',
          admin: {
            description: 'AI-processed content for this step',
          },
        },
        {
          name: 'isCompleted',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this step has been completed',
          },
        },
        {
          name: 'completedAt',
          type: 'date',
          admin: {
            description: 'When this step was completed',
          },
        },
        {
          name: 'versions',
          type: 'array',
          admin: {
            description: 'Version history for this step',
          },
          fields: [
            {
              name: 'version',
              type: 'number',
              required: true,
            },
            {
              name: 'userInput',
              type: 'textarea',
            },
            {
              name: 'aiGeneratedContent',
              type: 'textarea',
            },
            {
              name: 'createdAt',
              type: 'date',
              defaultValue: () => new Date(),
            },
          ],
        },
      ],
    },
    {
      name: 'finalDocument',
      type: 'textarea',
      admin: {
        description: 'Generated final document content',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Instance metadata and analytics',
      },
      fields: [
        {
          name: 'startedAt',
          type: 'date',
          admin: {
            description: 'When the workflow was started',
          },
        },
        {
          name: 'completedAt',
          type: 'date',
          admin: {
            description: 'When the workflow was completed',
          },
        },
        {
          name: 'totalTime',
          type: 'number',
          admin: {
            description: 'Total time spent in minutes',
          },
        },
        {
          name: 'aiInteractions',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of AI processing requests',
          },
        },
        {
          name: 'regenerations',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of content regenerations',
          },
        },
        {
          name: 'exports',
          type: 'array',
          admin: {
            description: 'Export history',
          },
          fields: [
            {
              name: 'format',
              type: 'select',
              options: [
                { label: 'PDF', value: 'pdf' },
                { label: 'Word Document', value: 'docx' },
                { label: 'Markdown', value: 'md' },
                { label: 'Plain Text', value: 'txt' },
              ],
              required: true,
            },
            {
              name: 'exportedAt',
              type: 'date',
              defaultValue: () => new Date(),
            },
            {
              name: 'fileSize',
              type: 'number',
              admin: {
                description: 'File size in bytes',
              },
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'User-defined tags for organization',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'User notes about this instance',
          },
        },
      ],
    },
    {
      name: 'businessContext',
      type: 'group',
      admin: {
        description: 'Business-specific context and branding',
      },
      fields: [
        {
          name: 'businessMode',
          type: 'select',
          options: [
            { label: 'IntelliTrade', value: 'intellitrade' },
            { label: 'Salarium', value: 'salarium' },
            { label: 'Latinos', value: 'latinos' },
            { label: 'General', value: 'general' },
          ],
          admin: {
            description: 'Which business context this instance belongs to',
          },
        },
        {
          name: 'organizationName',
          type: 'text',
          admin: {
            description: 'Organization name for document generation',
          },
        },
        {
          name: 'organizationDescription',
          type: 'textarea',
          admin: {
            description: 'Organization description for document generation',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Set createdBy on creation
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }

        // Update progress based on completed steps
        if (data.stepResponses && Array.isArray(data.stepResponses)) {
          const completedSteps = data.stepResponses.filter((step: any) => step.isCompleted).length
          const totalSteps = data.stepResponses.length
          data.progress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

          // Update status based on progress
          if (data.progress === 100 && data.status !== 'completed') {
            data.status = 'completed'
            if (!data.metadata) data.metadata = {}
            data.metadata.completedAt = new Date()
          } else if (data.progress > 0 && data.status === 'draft') {
            data.status = 'in-progress'
          }
        }

        // Increment AI interactions counter
        if (operation === 'update' && data.metadata) {
          data.metadata.aiInteractions = (data.metadata.aiInteractions || 0) + 1
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        // Update template usage statistics
        if (operation === 'create' && doc.template) {
          try {
            const template = await req.payload.findByID({
              collection: 'flow-templates',
              id: doc.template,
            })

            if (template.usage) {
              await req.payload.update({
                collection: 'flow-templates',
                id: doc.template,
                data: {
                  usage: {
                    ...template.usage,
                    timesUsed: (template.usage.timesUsed || 0) + 1,
                    lastUsed: new Date().toISOString(),
                  },
                },
              })
            }
          } catch (error) {
            console.error('Error updating template usage:', error)
          }
        }
      },
    ],
  },
}
