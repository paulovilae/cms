import { CollectionConfig } from 'payload'
import { SectionType, BusinessPayloadRequest } from '../types'
import { isFeatureEnabled } from '../config/features'

/**
 * DocumentSections Collection - Basic Version
 *
 * This is the basic version that works with the current database schema.
 * Enhanced fields are disabled until proper database migration is completed.
 */
export const DocumentSections: CollectionConfig = {
  slug: 'document-sections',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'order', 'isCompleted'],
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
      name: 'documentId',
      type: 'relationship',
      relationTo: 'flow-documents',
      required: true,
      label: 'Document',
      hasMany: false,
      admin: {
        description: 'The document this section belongs to',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Introduction', value: SectionType.INTRODUCTION },
        { label: 'Summary', value: SectionType.SUMMARY },
        { label: 'Responsibilities', value: SectionType.RESPONSIBILITIES },
        { label: 'Requirements', value: SectionType.REQUIREMENTS },
        { label: 'Qualifications', value: SectionType.QUALIFICATIONS },
        { label: 'Benefits', value: SectionType.BENEFITS },
        { label: 'Custom', value: SectionType.CUSTOM },
      ],
      defaultValue: SectionType.INTRODUCTION,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'The order in which this section appears in the document',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      admin: {
        description: 'The rich text content of this section',
      },
    },
    // Basic completion tracking
    {
      name: 'isCompleted',
      type: 'checkbox',
      label: 'Completed',
      defaultValue: false,
    },
    {
      name: 'isGenerated',
      type: 'checkbox',
      label: 'AI Generated',
      defaultValue: false,
      admin: {
        description: 'Whether this section was generated using AI',
      },
    },
    {
      name: 'lastGeneratedAt',
      type: 'date',
      label: 'Last Generated',
      admin: {
        description: 'When this section was last generated',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    // Enhanced fields - conditionally included based on feature flags
    ...(isFeatureEnabled('enhancedFields')
      ? [
          {
            name: 'inputConfig',
            type: 'group' as const,
            label: 'Input Configuration',
            fields: [
              {
                name: 'placeholder',
                type: 'text' as const,
                label: 'Placeholder Text',
              },
              {
                name: 'isRequired',
                type: 'checkbox' as const,
                defaultValue: false,
                label: 'Required Field',
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
                name: 'systemPrompt',
                type: 'textarea' as const,
                label: 'System Prompt',
              },
              {
                name: 'temperature',
                type: 'number' as const,
                defaultValue: 0.7,
                label: 'AI Temperature',
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
        // If content is being updated and it's marked as generated, update the timestamp
        if (data.content && data.isGenerated) {
          data.lastGeneratedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}

export default DocumentSections
