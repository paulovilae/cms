import { BusinessSearchConfig } from '../types/business-config.types'

// Import business-specific configurations
import { salariumSearchConfig } from './salarium'
import { intellitradeSearchConfig } from './intellitrade'
import { latinosSearchConfig } from './latinos'

/**
 * Default configuration as fallback
 */
const defaultSearchConfig: BusinessSearchConfig = {
  searchFields: [
    { name: 'title', weight: 2.0 },
    { name: 'description', weight: 1.5 },
    { name: 'content', weight: 1.0 },
  ],
  filters: [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      fieldPath: '_status',
    },
  ],
  actions: [
    {
      id: 'view',
      label: 'View',
      icon: 'Eye',
      requiresSelection: true,
      handler: 'viewHandler',
      permission: ({ user }) => !!user,
    },
  ],
  previewConfig: {
    layout: 'card',
    fields: [
      {
        key: 'title',
        label: 'Title',
        formatter: 'highlightMatch',
        typographyVariant: 'h3',
      },
      {
        key: 'description',
        label: 'Description',
        formatter: 'text',
        maxLength: 150,
        typographyVariant: 'body2',
      },
    ],
  },
  aiPromptCustomizations: {
    systemPrompt:
      'You are a helpful search assistant providing relevant information based on user queries.',
    queryEnhancement:
      'Given the user\'s search query "{query}", expand this into a more comprehensive search.',
    contextData: {
      entityType: 'generic',
      terminology: {},
    },
    suggestionPrompt:
      "Based on the user's search, suggest 3-5 related searches that might be helpful.",
  },
}

/**
 * Business configuration map
 */
const businessConfigs: Record<string, BusinessSearchConfig> = {
  // Business-specific configurations
  salarium: salariumSearchConfig,
  intellitrade: intellitradeSearchConfig,
  latinos: latinosSearchConfig,

  // Default fallback configuration
  default: defaultSearchConfig,
}

/**
 * Get the search configuration for a specific business
 *
 * @param business The business identifier
 * @returns The business-specific search configuration or default if not found
 */
export const getBusinessSearchConfig = (business: string): BusinessSearchConfig => {
  return businessConfigs[business] || businessConfigs['default'] || defaultSearchConfig
}

/**
 * Register a business search configuration
 *
 * @param business The business identifier
 * @param config The search configuration for this business
 */
export const registerBusinessSearchConfig = (
  business: string,
  config: BusinessSearchConfig,
): void => {
  businessConfigs[business] = config
}

/**
 * Get all registered business configurations
 *
 * @returns Record of all business configurations
 */
export const getAllBusinessConfigs = (): Record<string, BusinessSearchConfig> => {
  return { ...businessConfigs }
}
