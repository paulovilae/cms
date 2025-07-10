import { salariumSearchConfig } from '@/plugins/shared/universal-search/business-config/salarium'
import { BusinessSearchConfig } from '@/plugins/shared/universal-search/types/business-config.types'

/**
 * Job description specific search configuration that extends the base Salarium config
 * This configuration is shared between the standalone search tool and the embedded quick search
 */
export const jobDescriptionSearchConfig: BusinessSearchConfig = {
  // Base on existing Salarium search config
  ...salariumSearchConfig,

  // Override with job description specific settings
  searchFields: [
    // Job title with high weight
    { name: 'title', weight: 3.0, boost: 'exact' },

    // Step responses (actual job description content)
    { name: 'stepResponses.aiGeneratedContent', weight: 2.5, type: 'richText' },
    { name: 'stepResponses.userInput', weight: 1.8, type: 'text' },
    { name: 'stepResponses.stepTitle', weight: 1.5, type: 'text' },

    // Include original fields from salarium config that are relevant
    ...salariumSearchConfig.searchFields.filter(
      (field) => !['title', 'jobDescription'].includes(field.name),
    ),
  ],

  // Add job description specific filters
  filters: [
    // Status filter (specific to flow instances)
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
      fieldPath: 'status',
    },

    // Creation date filter
    {
      key: 'createdAt',
      label: 'Created',
      type: 'dateRange',
      fieldPath: 'createdAt',
    },

    // Include original Salarium filters
    ...salariumSearchConfig.filters,
  ],

  // Reference actions
  actions: [
    {
      id: 'useAsReference',
      label: 'Use as Reference',
      icon: 'FileText',
      requiresSelection: true,
      handler: 'useJobDescriptionAsReference',
    },
    {
      id: 'viewSideBySide',
      label: 'Compare Side by Side',
      icon: 'Columns',
      requiresSelection: true,
      handler: 'viewSideBySide',
    },
    // Include original actions
    ...salariumSearchConfig.actions,
  ],

  // Preview configuration
  previewConfig: {
    ...salariumSearchConfig.previewConfig,
    fields: [
      {
        key: 'title',
        label: 'Job Title',
        formatter: 'highlightMatch',
        typographyVariant: 'h3',
        highlightMatches: true,
      },
      {
        key: 'status',
        label: 'Status',
        formatter: 'badge',
        statusColors: {
          draft: 'yellow',
          'in-progress': 'blue',
          completed: 'green',
        },
      },
      {
        key: 'stepResponses',
        label: 'Content',
        formatter: 'contentPreview',
        maxLength: 200,
        highlightMatches: true,
      },
      {
        key: 'createdAt',
        label: 'Created',
        formatter: 'date',
      },
      {
        key: 'updatedAt',
        label: 'Last Updated',
        formatter: 'date',
      },
    ],
  },

  // AI customizations
  aiPromptCustomizations: {
    ...salariumSearchConfig.aiPromptCustomizations,
    systemPrompt:
      'You are an HR assistant helping to find job descriptions in a database. ' +
      'You understand HR terminology, job requirements, and organizational hierarchies. ' +
      'Help the user find the most relevant job descriptions based on their search query.',

    queryEnhancement:
      'Given the user\'s search query "{query}" about job descriptions, expand this into a more comprehensive search. ' +
      'Consider the specific position, level, skills, and departments that might be relevant. ' +
      'If abbreviations are used (like "Sr" for Senior), expand them. ' +
      'Ensure the search covers both job title matches and detailed content within the descriptions.',

    suggestionPrompt:
      "Based on the user's job description search for '{query}', suggest 3-5 related searches that might help them find better matches. " +
      'Consider alternative job titles, related skills, different departments, or experience levels.',
  },
}
