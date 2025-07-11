import { CollectionConfig } from 'payload'
import { DocumentStatus, BusinessPayloadRequest } from '../types'
import { isFeatureEnabled } from '../config/features'

/**
 * FlowDocuments Collection - Basic Version
 *
 * This is the basic version that works with the current database schema.
 * Enhanced fields are disabled until proper database migration is completed.
 */
export const FlowDocuments: CollectionConfig = {
  slug: 'flow-documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'businessUnit', 'updatedAt'],
    group: 'Job Flow',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: DocumentStatus.DRAFT,
      options: [
        { label: 'Draft', value: DocumentStatus.DRAFT },
        { label: 'In Progress', value: DocumentStatus.IN_PROGRESS },
        { label: 'Completed', value: DocumentStatus.COMPLETED },
        { label: 'Archived', value: DocumentStatus.ARCHIVED },
      ],
    },
    {
      name: 'businessUnit',
      type: 'select',
      options: [
        { label: 'Salarium', value: 'salarium' },
        { label: 'IntelliTrade', value: 'intellitrade' },
        { label: 'Latinos', value: 'latinos' },
        { label: 'Capacita', value: 'capacita' },
        { label: 'All', value: 'all' },
      ],
      label: 'Business Unit',
    },
    // Legacy support - keeping existing fields that work
    {
      name: 'templateId',
      type: 'text',
      label: 'Template ID',
      admin: {
        description: 'Template ID for backward compatibility',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Additional data specific to the document type',
      },
    },
    // Enhanced fields - conditionally included based on feature flags
    ...(isFeatureEnabled('organizationSupport')
      ? [
          {
            name: 'organizationId',
            type: 'text' as const,
            label: 'Organization ID',
            admin: {
              description: 'Organization ID this document belongs to',
            },
          },
        ]
      : []),
    ...(isFeatureEnabled('workflowManagement')
      ? [
          {
            name: 'workflow',
            type: 'group' as const,
            label: 'Workflow',
            fields: [
              {
                name: 'currentStep',
                type: 'number' as const,
                defaultValue: 0,
                label: 'Current Step',
              },
              {
                name: 'totalSteps',
                type: 'number' as const,
                defaultValue: 0,
                label: 'Total Steps',
              },
              {
                name: 'progress',
                type: 'number' as const,
                defaultValue: 0,
                label: 'Progress (%)',
              },
            ],
          },
        ]
      : []),
    ...(isFeatureEnabled('aiConfiguration')
      ? [
          {
            name: 'aiConfig',
            type: 'group' as const,
            label: 'AI Configuration',
            fields: [
              {
                name: 'preferredProviderId',
                type: 'text' as const,
                label: 'Preferred AI Provider ID',
              },
              {
                name: 'defaultPrompt',
                type: 'textarea' as const,
                label: 'Default Prompt',
              },
            ],
          },
        ]
      : []),
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Set business unit from context if not provided
        const businessContext = (req as any).businessContext
        if (!data.businessUnit && businessContext?.business) {
          data.businessUnit = businessContext.business
        }
        return data
      },
    ],
  },
}

export default FlowDocuments
