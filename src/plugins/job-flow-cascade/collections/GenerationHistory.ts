import { CollectionConfig } from 'payload'
import { GenerationType, BusinessPayloadRequest } from '../types'

/**
 * GenerationHistory Collection
 *
 * This collection tracks all AI generation attempts for document sections,
 * including prompts and responses. This is useful for auditing, improving
 * prompts, and providing generation alternatives.
 */
export const GenerationHistory: CollectionConfig = {
  slug: 'generation-history',
  admin: {
    useAsTitle: 'sectionId',
    defaultColumns: ['documentId', 'sectionId', 'type', 'createdAt'],
    group: 'Job Flow',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
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
    },
    {
      name: 'sectionId',
      type: 'relationship',
      relationTo: 'document-sections',
      required: true,
      label: 'Section',
      hasMany: false,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Initial Generation', value: GenerationType.INITIAL },
        { label: 'Refinement', value: GenerationType.REFINEMENT },
        { label: 'Alternative', value: GenerationType.ALTERNATIVE },
        { label: 'Manual Edit', value: GenerationType.MANUAL },
      ],
      defaultValue: GenerationType.INITIAL,
    },
    {
      name: 'prompt',
      type: 'textarea',
      required: true,
      label: 'Prompt',
      admin: {
        description: 'The prompt sent to the AI provider',
      },
    },
    {
      name: 'response',
      type: 'json',
      required: true,
      label: 'Response',
      admin: {
        description: 'The raw response from the AI provider',
      },
    },
    {
      name: 'aiProvider',
      type: 'text',
      label: 'AI Provider',
      admin: {
        description: 'The AI provider used for this generation',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Additional metadata about the generation process',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Add the AI provider if available from req
        // Safely access possible AI provider configuration
        if (req.payload && !data.aiProvider) {
          // Using any to bypass type checking for custom config properties
          const config = req.payload.config as any
          if (config?.ai?.provider) {
            data.aiProvider = config.ai.provider
          }
        }
        return data
      },
    ],
  },
}

export default GenerationHistory
