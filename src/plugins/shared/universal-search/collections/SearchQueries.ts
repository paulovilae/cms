import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'

export const SearchQueries: CollectionConfig = {
  slug: 'search-queries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'query',
    defaultColumns: ['query', 'collection', 'resultCount', 'createdAt'],
    group: 'Universal Search',
    description: 'Search analytics and saved queries',
  },
  fields: [
    {
      name: 'query',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'Search query text',
      },
    },
    {
      name: 'collection',
      type: 'text',
      admin: {
        description: 'Collection that was searched',
      },
    },
    {
      name: 'userId',
      type: 'text',
      admin: {
        description: 'User who performed the search',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      admin: {
        description: 'Session ID for anonymous tracking',
      },
    },
    {
      name: 'resultCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of results returned',
      },
    },
    {
      name: 'executionTimeMs',
      type: 'number',
      admin: {
        description: 'Search execution time in milliseconds',
      },
    },
    {
      name: 'clickedResults',
      type: 'array',
      fields: [
        {
          name: 'documentId',
          type: 'text',
          required: true,
        },
        {
          name: 'collection',
          type: 'text',
          required: true,
        },
        {
          name: 'position',
          type: 'number',
          required: true,
        },
        {
          name: 'clickedAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
      ],
      admin: {
        description: 'Results that were clicked',
      },
    },
    {
      name: 'filters',
      type: 'json',
      admin: {
        description: 'Filters applied to the search',
      },
    },
    {
      name: 'sort',
      type: 'group',
      fields: [
        {
          name: 'field',
          type: 'text',
        },
        {
          name: 'direction',
          type: 'select',
          options: [
            { label: 'Ascending', value: 'asc' },
            { label: 'Descending', value: 'desc' },
          ],
        },
      ],
      admin: {
        description: 'Sort order applied to the search',
      },
    },
    {
      name: 'semanticSearch',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether semantic search was used',
      },
    },
    {
      name: 'recognizedIntent',
      type: 'json',
      admin: {
        description: 'Intent recognized by AI',
      },
    },
    {
      name: 'suggestions',
      type: 'array',
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'clicked',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      admin: {
        description: 'Suggestions offered to the user',
      },
    },
    {
      name: 'isSaved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether this query is saved by the user',
      },
    },
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Custom name for saved searches',
        condition: (data) => data.isSaved,
      },
    },
    {
      name: 'userRating',
      type: 'select',
      options: [
        { label: 'Very Helpful', value: '5' },
        { label: 'Helpful', value: '4' },
        { label: 'Neutral', value: '3' },
        { label: 'Unhelpful', value: '2' },
        { label: 'Very Unhelpful', value: '1' },
      ],
      admin: {
        description: 'User satisfaction rating',
      },
    },
    {
      name: 'userFeedback',
      type: 'textarea',
      admin: {
        description: 'Additional user feedback',
      },
    },
    {
      name: 'searchType',
      type: 'select',
      options: [
        { label: 'Keyword', value: 'keyword' },
        { label: 'Semantic', value: 'semantic' },
        { label: 'Combined', value: 'combined' },
      ],
      defaultValue: 'keyword',
      admin: {
        description: 'Type of search performed',
      },
    },
    {
      name: 'deviceInfo',
      type: 'group',
      fields: [
        {
          name: 'device',
          type: 'select',
          options: [
            { label: 'Desktop', value: 'desktop' },
            { label: 'Mobile', value: 'mobile' },
            { label: 'Tablet', value: 'tablet' },
            { label: 'Unknown', value: 'unknown' },
          ],
          defaultValue: 'unknown',
        },
        {
          name: 'browser',
          type: 'text',
        },
        {
          name: 'os',
          type: 'text',
        },
      ],
      admin: {
        description: 'Device information',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation }) => {
        console.log(`Search Query ${operation}: ${doc.query}`)
      },
    ],
  },
  // Simple indexes
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['sessionId'],
    },
    {
      fields: ['createdAt'],
    },
  ],
}
