import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const SearchIndex: CollectionConfig = {
  slug: 'search-index',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'collection', 'status', 'updatedAt'],
    group: 'Universal Search',
    description: 'Search index for universal search functionality',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Searchable title of the indexed item',
      },
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Source collection of the indexed item',
      },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'ID of the original document',
      },
    },
    {
      name: 'content',
      type: 'textarea',
      admin: {
        description: 'Searchable content extracted from the document',
      },
    },
    {
      name: 'searchableText',
      type: 'textarea',
      admin: {
        description: 'Processed text optimized for search',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 1,
        },
      ],
      admin: {
        description: 'Extracted keywords with weights',
      },
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
        {
          name: 'source',
          type: 'select',
          options: [
            { label: 'Manual', value: 'manual' },
            { label: 'AI Generated', value: 'ai' },
            { label: 'Auto Extracted', value: 'auto' },
          ],
          defaultValue: 'manual',
        },
        {
          name: 'confidence',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 1,
        },
      ],
      admin: {
        description: 'Tags for categorization and filtering',
      },
    },
    {
      name: 'metadata',
      type: 'json',
      admin: {
        description: 'Additional metadata from the source document',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
        { label: 'Error', value: 'error' },
      ],
      defaultValue: 'active',
      index: true,
      admin: {
        description: 'Index status',
      },
    },
    {
      name: 'searchScore',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Base search relevance score',
        readOnly: true,
      },
    },
    {
      name: 'semanticVector',
      type: 'json',
      admin: {
        description: 'AI-generated semantic vector for similarity search',
        condition: () => false, // Hidden from admin
      },
    },
    {
      name: 'lastIndexed',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        description: 'When this item was last indexed',
        readOnly: true,
      },
    },
    {
      name: 'indexVersion',
      type: 'text',
      defaultValue: '1.0.0',
      admin: {
        description: 'Version of the indexing algorithm used',
        readOnly: true,
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'URL to access the original document',
      },
    },
    {
      name: 'previewData',
      type: 'group',
      fields: [
        {
          name: 'summary',
          type: 'textarea',
          admin: {
            description: 'Brief summary for preview',
          },
        },
        {
          name: 'thumbnail',
          type: 'text',
          admin: {
            description: 'Thumbnail URL if applicable',
          },
        },
        {
          name: 'author',
          type: 'text',
          admin: {
            description: 'Author or creator',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            description: 'Content category',
          },
        },
      ],
      admin: {
        description: 'Data for search result previews',
      },
    },
    {
      name: 'aiAnalysis',
      type: 'group',
      fields: [
        {
          name: 'concepts',
          type: 'array',
          fields: [
            {
              name: 'concept',
              type: 'text',
              required: true,
            },
            {
              name: 'relevance',
              type: 'number',
              min: 0,
              max: 1,
            },
            {
              name: 'context',
              type: 'text',
            },
          ],
          admin: {
            description: 'AI-extracted concepts',
          },
        },
        {
          name: 'sentiment',
          type: 'select',
          options: [
            { label: 'Positive', value: 'positive' },
            { label: 'Neutral', value: 'neutral' },
            { label: 'Negative', value: 'negative' },
          ],
          admin: {
            description: 'AI-detected sentiment',
          },
        },
        {
          name: 'complexity',
          type: 'select',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          admin: {
            description: 'AI-assessed complexity level',
          },
        },
        {
          name: 'entities',
          type: 'array',
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'type',
              type: 'select',
              options: [
                { label: 'Person', value: 'person' },
                { label: 'Organization', value: 'organization' },
                { label: 'Location', value: 'location' },
                { label: 'Skill', value: 'skill' },
                { label: 'Technology', value: 'technology' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
            {
              name: 'confidence',
              type: 'number',
              min: 0,
              max: 1,
            },
          ],
          admin: {
            description: 'AI-extracted named entities',
          },
        },
      ],
      admin: {
        description: 'AI analysis results',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Update lastIndexed timestamp
        data.lastIndexed = new Date()

        // Generate searchable text from content and title
        if (data.title || data.content) {
          const searchableText = [data.title, data.content].filter(Boolean).join(' ').toLowerCase()

          data.searchableText = searchableText
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`Search Index ${operation}: ${doc.title} (${doc.collection})`)
      },
    ],
  },
  // Simple indexes for better performance
  indexes: [
    {
      fields: ['collection', 'status'],
    },
    {
      fields: ['documentId'],
    },
  ],
}
