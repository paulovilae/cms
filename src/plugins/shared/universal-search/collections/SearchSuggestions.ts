import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const SearchSuggestions: CollectionConfig = {
  slug: 'search-suggestions',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access for quick suggestions
    update: authenticated,
  },
  admin: {
    useAsTitle: 'text',
    defaultColumns: ['text', 'type', 'collection', 'confidence', 'createdAt'],
    group: 'Universal Search',
    description: 'AI-generated search suggestions',
  },
  fields: [
    {
      name: 'text',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Suggestion text',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Search Term', value: 'search' },
        { label: 'Filter', value: 'filter' },
        { label: 'Action', value: 'action' },
        { label: 'Content', value: 'content' },
        { label: 'Completion', value: 'completion' },
      ],
      required: true,
      admin: {
        description: 'Type of suggestion',
      },
    },
    {
      name: 'collection',
      type: 'text',
      admin: {
        description: 'Related collection',
      },
    },
    {
      name: 'relatedTerms',
      type: 'array',
      fields: [
        {
          name: 'term',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.5,
        },
      ],
      admin: {
        description: 'Related search terms',
      },
    },
    {
      name: 'confidence',
      type: 'number',
      min: 0,
      max: 1,
      defaultValue: 0.5,
      admin: {
        description: 'AI confidence score (0-1)',
      },
    },
    {
      name: 'reasoning',
      type: 'textarea',
      admin: {
        description: 'AI reasoning for this suggestion',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      fields: [
        {
          name: 'basedOn',
          type: 'select',
          options: [
            { label: 'User History', value: 'history' },
            { label: 'Content Analysis', value: 'content' },
            { label: 'Usage Patterns', value: 'patterns' },
            { label: 'AI Analysis', value: 'ai_analysis' },
            { label: 'User Behavior', value: 'user_behavior' },
          ],
          admin: {
            description: 'What this suggestion is based on',
          },
        },
        {
          name: 'relatedItems',
          type: 'array',
          fields: [
            {
              name: 'id',
              type: 'text',
              required: true,
            },
            {
              name: 'collection',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Related items this suggestion is based on',
          },
        },
        {
          name: 'expectedResults',
          type: 'number',
          admin: {
            description: 'Expected number of results',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description: 'Suggestion category',
          },
        },
        {
          name: 'priority',
          type: 'number',
          min: 1,
          max: 10,
          defaultValue: 5,
          admin: {
            description: 'Display priority (1-10)',
          },
        },
      ],
    },
    {
      name: 'userFeedback',
      type: 'group',
      fields: [
        {
          name: 'clicks',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of times this suggestion was clicked',
          },
        },
        {
          name: 'impressions',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Number of times this suggestion was shown',
          },
        },
        {
          name: 'lastClicked',
          type: 'date',
          admin: {
            description: 'When this suggestion was last clicked',
          },
        },
        {
          name: 'positive',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Positive feedback count',
          },
        },
        {
          name: 'negative',
          type: 'number',
          defaultValue: 0,
          admin: {
            description: 'Negative feedback count',
          },
        },
      ],
    },
    {
      name: 'aiProvider',
      type: 'text',
      admin: {
        description: 'AI provider used to generate this suggestion',
      },
    },
    {
      name: 'aiModel',
      type: 'text',
      admin: {
        description: 'AI model used to generate this suggestion',
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'User who created this suggestion (if manual)',
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'When this suggestion expires (for temporary suggestions)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this suggestion is active',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        console.log(`Search Suggestion ${operation}: ${doc.text}`)
      },
    ],
  },
  // Simple indexes
  indexes: [
    {
      fields: ['text'],
    },
    {
      fields: ['collection'],
    },
    {
      fields: ['type'],
    },
  ],
}
