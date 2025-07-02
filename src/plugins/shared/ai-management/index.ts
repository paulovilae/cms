import { Plugin } from 'payload'

/**
 * AI Management Plugin
 *
 * Shared plugin for managing AI providers and configurations
 * across all business platforms.
 */
export const aiManagementPlugin = (): Plugin => (incomingConfig) => {
  return {
    ...incomingConfig,
    collections: [
      ...(incomingConfig.collections || []),
      {
        slug: 'ai-providers',
        labels: {
          singular: 'AI Provider',
          plural: 'AI Providers',
        },
        admin: {
          group: 'AI Management',
          useAsTitle: 'name',
        },
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Provider Name',
          },
          {
            name: 'provider',
            type: 'select',
            required: true,
            options: [
              { label: 'OpenAI', value: 'openai' },
              { label: 'Anthropic', value: 'anthropic' },
              { label: 'Google', value: 'google' },
              { label: 'Azure OpenAI', value: 'azure' },
              { label: 'Ollama', value: 'ollama' },
              { label: 'LM Studio', value: 'lmstudio' },
            ],
          },
          {
            name: 'baseUrl',
            type: 'text',
            admin: {
              description:
                'API endpoint URL (e.g., https://api.openai.com/v1 or http://localhost:11434)',
            },
          },
          {
            name: 'apiKey',
            type: 'text',
            admin: {
              description: 'API key for the AI provider (leave empty for local providers)',
            },
          },
          {
            name: 'model',
            type: 'text',
            label: 'Default Model',
            admin: {
              description: 'Default model name (e.g., gpt-4, claude-3-sonnet, llama2)',
            },
          },
          {
            name: 'maxTokens',
            type: 'number',
            label: 'Max Tokens',
            admin: {
              description: 'Maximum tokens for this provider',
            },
          },
          {
            name: 'temperature',
            type: 'number',
            label: 'Temperature',
            admin: {
              description: 'Temperature setting (0.0 - 1.0)',
            },
            min: 0,
            max: 1,
          },
          {
            name: 'status',
            type: 'select',
            options: [
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
              { label: 'Testing', value: 'testing' },
            ],
            defaultValue: 'active',
            admin: {
              position: 'sidebar',
            },
          },
          {
            name: 'description',
            type: 'textarea',
            admin: {
              description: 'Brief description of the provider and its capabilities',
            },
          },
        ],
        access: {
          read: ({ req }) => !!req.user,
          create: ({ req }) => !!req.user,
          update: ({ req }) => !!req.user,
          delete: ({ req }) => !!req.user,
        },
      },
    ],
  }
}

export default aiManagementPlugin
