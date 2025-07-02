import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { slugField } from '@/fields/slug'

export const FlowInstances: CollectionConfig = {
  slug: 'flow-instances',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated, // Only authenticated users can see instances
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'template', 'status', 'currentStep', 'updatedAt'],
    group: 'Salarium',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Instance name (e.g., "Senior Developer Job Description")',
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
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'User who created this instance',
      },
    },
    {
      name: 'organizationId',
      type: 'text',
      admin: {
        description: 'Organization ID for multi-tenant isolation',
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
        { label: 'Paused', value: 'paused' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Current status of the workflow instance',
      },
    },
    {
      name: 'currentStep',
      type: 'number',
      defaultValue: 1,
      admin: {
        description: 'Current step number in the workflow',
        position: 'sidebar',
      },
    },
    {
      name: 'totalSteps',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Total number of steps in the template',
        position: 'sidebar',
      },
    },
    {
      name: 'progress',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Completion percentage (0-100)',
        position: 'sidebar',
      },
    },
    {
      name: 'stepResponses',
      type: 'array',
      admin: {
        description: 'User responses for each step',
      },
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
        },
        {
          name: 'stepTitle',
          type: 'text',
          required: true,
        },
        {
          name: 'userInput',
          type: 'textarea',
          admin: {
            description: 'Original user response',
          },
        },
        {
          name: 'aiGeneratedContent',
          type: 'textarea',
          admin: {
            description: 'AI-processed content',
          },
        },
        {
          name: 'isCompleted',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'completedAt',
          type: 'date',
        },
        {
          name: 'versions',
          type: 'array',
          admin: {
            description: 'All versions of content for this step',
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
              name: 'feedback',
              type: 'textarea',
              admin: {
                description: 'User feedback for regeneration',
              },
            },
            {
              name: 'regenerationPrompt',
              type: 'textarea',
              admin: {
                description: 'Additional context for AI regeneration',
              },
            },
            {
              name: 'aiProvider',
              type: 'relationship',
              relationTo: 'ai-providers',
            },
            {
              name: 'processingTime',
              type: 'number',
              admin: {
                description: 'AI response time in milliseconds',
              },
            },
            {
              name: 'createdAt',
              type: 'date',
              defaultValue: () => new Date(),
            },
            {
              name: 'isActive',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Is this the current active version?',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'finalDocument',
      type: 'textarea',
      admin: {
        description: 'Complete generated document',
      },
    },
    {
      name: 'documentFormat',
      type: 'select',
      options: [
        { label: 'Markdown', value: 'markdown' },
        { label: 'HTML', value: 'html' },
        { label: 'Plain Text', value: 'text' },
        { label: 'PDF', value: 'pdf' },
      ],
      defaultValue: 'markdown',
    },
    {
      name: 'collaborators',
      type: 'array',
      admin: {
        description: 'Users who can view and edit this instance',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Viewer', value: 'viewer' },
            { label: 'Editor', value: 'editor' },
            { label: 'Admin', value: 'admin' },
          ],
          defaultValue: 'viewer',
          required: true,
        },
        {
          name: 'addedAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
        {
          name: 'addedBy',
          type: 'relationship',
          relationTo: 'users',
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Instance metadata and tracking',
      },
      fields: [
        {
          name: 'startedAt',
          type: 'date',
          defaultValue: () => new Date(),
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
            readOnly: true,
          },
        },
        {
          name: 'aiInteractions',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Total number of AI interactions',
            readOnly: true,
          },
        },
        {
          name: 'regenerations',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of content regenerations',
            readOnly: true,
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
                { label: 'Word', value: 'docx' },
                { label: 'HTML', value: 'html' },
                { label: 'Markdown', value: 'md' },
              ],
              required: true,
            },
            {
              name: 'exportedAt',
              type: 'date',
              defaultValue: () => new Date(),
            },
            {
              name: 'exportedBy',
              type: 'relationship',
              relationTo: 'users',
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
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Custom tags for organization',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
          admin: {
            description: 'Internal notes about this instance',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      admin: {
        description: 'Instance-specific settings',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'autoSave',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Automatically save progress',
          },
        },
        {
          name: 'aiProvider',
          type: 'relationship',
          relationTo: 'ai-providers',
          admin: {
            description: 'Override template AI provider for this instance',
          },
        },
        {
          name: 'language',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'Portuguese', value: 'pt' },
            { label: 'French', value: 'fr' },
          ],
          defaultValue: 'en',
        },
        {
          name: 'isPublic',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow public viewing of this instance',
          },
        },
        {
          name: 'allowComments',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Allow collaborators to add comments',
          },
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Calculate progress percentage
        if (data?.stepResponses && data?.totalSteps) {
          const completedSteps = data.stepResponses.filter((step: any) => step.isCompleted).length
          data.progress = Math.round((completedSteps / data.totalSteps) * 100)
        }

        // Update status based on progress
        if (data?.progress === 100 && data?.status !== 'completed') {
          data.status = 'completed'
          data.metadata = data.metadata || {}
          data.metadata.completedAt = new Date()
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log instance changes for audit trail
        console.log(
          `Flow Instance ${operation}: ${doc.title} (${doc.slug}) - Status: ${doc.status}`,
        )

        // Update template usage statistics
        if (operation === 'create' && doc.template) {
          // This would be handled by a background job in production
          console.log(`Incrementing usage count for template: ${doc.template}`)
        }
      },
    ],
  },
}
