import { Plugin } from 'payload'
import { testConnection } from './endpoints/test-connection'

/**
 * Enhanced AI Management Plugin
 *
 * Comprehensive AI provider management system with advanced features:
 * - Capabilities tracking (images, computer use, function calling, etc.)
 * - Pricing information (input/output costs, cache pricing)
 * - Advanced parameters (topP, topK, frequency/presence penalties)
 * - Connection testing and status monitoring
 * - Metadata and documentation links
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
          description: 'Manage AI providers with comprehensive configuration and monitoring',
        },
        fields: [
          // Basic Information Tab
          {
            type: 'tabs',
            tabs: [
              // Merged Basic Information and Model Configuration
              {
                label: 'Connection Details',
                fields: [
                  {
                    name: 'name',
                    type: 'text',
                    required: true,
                    label: 'Provider Name',
                    admin: {
                      description: 'Descriptive name for this AI provider configuration',
                    },
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
                    admin: {
                      description: 'AI provider type',
                    },
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
                    name: 'description',
                    type: 'textarea',
                    admin: {
                      description: 'Brief description of the provider and its capabilities',
                    },
                  },

                  // Cloudflare Access fields (for protected Ollama instances)
                  {
                    name: 'cfAccessClientId',
                    type: 'text',
                    label: 'Cloudflare Access Client ID',
                    admin: {
                      description:
                        'Client ID for Cloudflare Access service token (for protected Ollama instances)',
                      condition: (data) => data.provider === 'ollama',
                    },
                  },
                  {
                    name: 'cfAccessClientSecret',
                    type: 'text',
                    label: 'Cloudflare Access Client Secret',
                    admin: {
                      description:
                        'Client Secret for Cloudflare Access service token (for protected Ollama instances)',
                      condition: (data) => data.provider === 'ollama',
                    },
                  },

                  // Model Selection - Dropdown with discovered models
                  {
                    name: 'model',
                    type: 'select',
                    label: 'Model',
                    required: true,
                    options: [
                      // Ollama models (from the database)
                      { label: 'deepseek-r1:1.5b', value: 'deepseek-r1:1.5b' },
                      {
                        label: 'lucasmg/deepseek-r1-8b-0528-qwen3-q4_K_M-tool-true:latest',
                        value: 'lucasmg/deepseek-r1-8b-0528-qwen3-q4_K_M-tool-true:latest',
                      },
                      { label: 'nomic-embed-text:latest', value: 'nomic-embed-text:latest' },
                      { label: 'qwen2.5:7b-instruct-q4_K_M', value: 'qwen2.5:7b-instruct-q4_K_M' },
                      {
                        label: 'mychen76/qwen3_cline_roocode:8b',
                        value: 'mychen76/qwen3_cline_roocode:8b',
                      },
                      { label: 'llama3.2:latest', value: 'llama3.2:latest' },
                      { label: 'llama2', value: 'llama2' },
                      // Common OpenAI models
                      { label: 'gpt-4o', value: 'gpt-4o' },
                      { label: 'gpt-4o-mini', value: 'gpt-4o-mini' },
                      { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
                      // Common Anthropic models
                      { label: 'claude-3-5-sonnet-20241022', value: 'claude-3-5-sonnet-20241022' },
                      { label: 'claude-3-5-haiku-20241022', value: 'claude-3-5-haiku-20241022' },
                      // Common Google models
                      { label: 'gemini-1.5-pro', value: 'gemini-1.5-pro' },
                      { label: 'gemini-1.5-flash', value: 'gemini-1.5-flash' },
                    ],
                    admin: {
                      description:
                        'Select from available models. Test connection to discover more models automatically.',
                      isClearable: true,
                    },
                  },

                  // Auto-populated model parameters
                  {
                    name: 'maxOutputTokens',
                    type: 'number',
                    label: 'Max Output Tokens',
                    defaultValue: 4096,
                    admin: {
                      description:
                        'Maximum tokens that can be generated (auto-updated when model changes)',
                    },
                  },
                  {
                    name: 'contextWindow',
                    type: 'number',
                    label: 'Context Window',
                    defaultValue: 4096,
                    admin: {
                      description:
                        'Total context window size in tokens (auto-updated when model changes)',
                    },
                  },
                ],
              },

              // Capabilities Tab
              {
                label: 'Capabilities',
                fields: [
                  {
                    name: 'supportsImages',
                    type: 'checkbox',
                    label: 'Supports Images',
                    defaultValue: false,
                    admin: {
                      description:
                        'Can process and analyze images (auto-updated when model changes)',
                    },
                  },
                  {
                    name: 'supportsComputerUse',
                    type: 'checkbox',
                    label: 'Supports Computer Use',
                    defaultValue: false,
                    admin: {
                      description: 'Can interact with computer interfaces (Claude Computer Use)',
                    },
                  },
                  {
                    name: 'supportsPromptCaching',
                    type: 'checkbox',
                    label: 'Supports Prompt Caching',
                    defaultValue: false,
                    admin: {
                      description: 'Supports caching of prompts for cost optimization',
                    },
                  },
                  {
                    name: 'supportsFunctionCalling',
                    type: 'checkbox',
                    label: 'Supports Function Calling',
                    defaultValue: false,
                    admin: {
                      description:
                        'Can call external functions and tools (auto-updated when model changes)',
                    },
                  },
                  {
                    name: 'supportsStreaming',
                    type: 'checkbox',
                    label: 'Supports Streaming',
                    defaultValue: true,
                    admin: {
                      description: 'Can stream responses in real-time',
                    },
                  },
                  {
                    name: 'supportsVision',
                    type: 'checkbox',
                    label: 'Supports Vision',
                    defaultValue: false,
                    admin: {
                      description:
                        'Can analyze and understand visual content (auto-updated when model changes)',
                    },
                  },
                ],
              },

              // Pricing Tab
              {
                label: 'Pricing',
                fields: [
                  {
                    name: 'inputPriceCents',
                    type: 'number',
                    label: 'Input Price (cents per 1M tokens)',
                    admin: {
                      description:
                        'Cost in cents per 1 million input tokens (auto-updated when model changes)',
                    },
                  },
                  {
                    name: 'outputPriceCents',
                    type: 'number',
                    label: 'Output Price (cents per 1M tokens)',
                    admin: {
                      description:
                        'Cost in cents per 1 million output tokens (auto-updated when model changes)',
                    },
                  },
                  {
                    name: 'cacheReadsPriceCents',
                    type: 'number',
                    label: 'Cache Reads Price (cents per 1M tokens)',
                    admin: {
                      description:
                        'Cost in cents per 1 million cached tokens read (e.g., 30 for $0.30)',
                      condition: (data) => data.supportsPromptCaching,
                    },
                  },
                  {
                    name: 'cacheWritesPriceCents',
                    type: 'number',
                    label: 'Cache Writes Price (cents per 1M tokens)',
                    admin: {
                      description:
                        'Cost in cents per 1 million tokens written to cache (e.g., 375 for $3.75)',
                      condition: (data) => data.supportsPromptCaching,
                    },
                  },
                ],
              },

              // Advanced Parameters Tab
              {
                label: 'Advanced Parameters',
                fields: [
                  {
                    name: 'temperature',
                    type: 'number',
                    label: 'Temperature',
                    defaultValue: 0.7,
                    min: 0,
                    max: 2,
                    admin: {
                      description: 'Controls randomness in responses (0.0 - 2.0)',
                      step: 0.1,
                    },
                  },
                  {
                    name: 'topP',
                    type: 'number',
                    label: 'Top P',
                    defaultValue: 1.0,
                    min: 0,
                    max: 1,
                    admin: {
                      description: 'Nucleus sampling parameter (0.0 - 1.0)',
                      step: 0.01,
                    },
                  },
                  {
                    name: 'topK',
                    type: 'number',
                    label: 'Top K',
                    admin: {
                      description: 'Top-K sampling parameter (optional, provider-specific)',
                    },
                  },
                  {
                    name: 'frequencyPenalty',
                    type: 'number',
                    label: 'Frequency Penalty',
                    defaultValue: 0.0,
                    min: -2,
                    max: 2,
                    admin: {
                      description: 'Penalizes frequent tokens (-2.0 to 2.0)',
                      step: 0.1,
                    },
                  },
                  {
                    name: 'presencePenalty',
                    type: 'number',
                    label: 'Presence Penalty',
                    defaultValue: 0.0,
                    min: -2,
                    max: 2,
                    admin: {
                      description: 'Penalizes tokens that have appeared (-2.0 to 2.0)',
                      step: 0.1,
                    },
                  },
                ],
              },

              // Metadata Tab
              {
                label: 'Metadata',
                fields: [
                  {
                    name: 'website',
                    type: 'text',
                    label: 'Website',
                    admin: {
                      description: 'Official website URL',
                    },
                  },
                  {
                    name: 'documentation',
                    type: 'text',
                    label: 'Documentation',
                    admin: {
                      description: 'API documentation URL',
                    },
                  },
                  {
                    name: 'supportContact',
                    type: 'text',
                    label: 'Support Contact',
                    admin: {
                      description: 'Support email or contact information',
                    },
                  },
                  {
                    name: 'version',
                    type: 'text',
                    label: 'Version',
                    admin: {
                      description: 'API or model version',
                    },
                  },
                  {
                    name: 'tags',
                    type: 'textarea',
                    label: 'Tags (JSON)',
                    admin: {
                      description:
                        'JSON array of tags for categorization (e.g., ["fast", "cheap", "local"])',
                    },
                  },
                ],
              },
            ],
          },

          // Visual Connection Status Indicator (Custom UI Component)
          {
            name: 'connectionStatusDisplay',
            type: 'ui',
            admin: {
              position: 'sidebar',
              components: {
                Field: '@/components/ConnectionStatusIndicator',
              },
            },
          },

          // Hidden field to store actual status data
          {
            name: 'connectionStatus',
            type: 'select',
            options: [
              { label: 'Connected', value: 'connected' },
              { label: 'Disconnected', value: 'disconnected' },
              { label: 'Testing', value: 'testing' },
              { label: 'Error', value: 'error' },
            ],
            defaultValue: 'disconnected',
            admin: {
              hidden: true, // Hidden - only for data storage
            },
          },
          // Hidden fields - data displayed in visual component above
          {
            name: 'lastTestDate',
            type: 'date',
            admin: {
              hidden: true, // Hidden - displayed in visual component
            },
          },
          {
            name: 'responseTimeMs',
            type: 'number',
            admin: {
              hidden: true, // Hidden - displayed in visual speed dial
            },
          },
          {
            name: 'lastTestError',
            type: 'textarea',
            admin: {
              hidden: true, // Hidden - displayed in visual component
            },
          },
          {
            name: 'testEndpoint',
            type: 'text',
            label: 'Test Endpoint',
            admin: {
              position: 'sidebar',
              description: 'Specific endpoint to test (defaults to base URL)',
            },
          },
          {
            name: 'autoTestOnSave',
            type: 'checkbox',
            label: 'Auto Test on Save',
            defaultValue: true,
            admin: {
              position: 'sidebar',
              description: 'Automatically test connection when saving this provider',
            },
          },

          // Available models stored as JSON (populated by model discovery)
          {
            name: 'availableModels',
            type: 'json',
            admin: {
              hidden: true,
              description: 'Auto-populated by model discovery',
            },
          },
        ],
        hooks: {
          beforeChange: [
            async ({ data, req, operation }) => {
              // Auto-test connection on save if enabled
              if (data.autoTestOnSave && (operation === 'create' || operation === 'update')) {
                try {
                  const testResult = await testConnection(req, {
                    provider: data.provider,
                    baseUrl: data.baseUrl,
                    apiKey: data.apiKey,
                    model: data.model,
                    testEndpoint: data.testEndpoint,
                    cfAccessClientId: data.cfAccessClientId,
                    cfAccessClientSecret: data.cfAccessClientSecret,
                  })

                  // Update connection status fields
                  data.connectionStatus = testResult.status
                  data.lastTestDate = new Date().toISOString()
                  data.lastTestError = testResult.error || null
                  data.responseTimeMs = testResult.responseTimeMs || null

                  // Update available models if discovered
                  if (testResult.availableModels && testResult.availableModels.length > 0) {
                    data.availableModels = JSON.stringify(testResult.availableModels)
                  }
                } catch (error) {
                  console.error('Auto connection test failed:', error)
                  data.connectionStatus = 'error'
                  data.lastTestDate = new Date().toISOString()
                  data.lastTestError =
                    error instanceof Error ? error.message : 'Connection test failed'
                }
              }

              return data
            },
          ],
        },
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
