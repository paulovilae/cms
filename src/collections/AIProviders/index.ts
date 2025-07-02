import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const AIProviders: CollectionConfig = {
  slug: 'ai-providers',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access for demo purposes
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'providerType', 'status', 'updatedAt'],
    group: 'AI Management',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name of the AI provider (e.g., "OpenAI", "Anthropic", "Ollama")',
      },
    },
    {
      name: 'baseUrl',
      type: 'text',
      required: true,
      admin: {
        description:
          'API endpoint URL or local server URL (e.g., "https://api.openai.com/v1" or "http://localhost:11434")',
      },
    },
    {
      name: 'providerType',
      type: 'select',
      options: [
        { label: 'Cloud Provider', value: 'cloud' },
        { label: 'Local Provider', value: 'local' },
        { label: 'Proxy/Gateway', value: 'proxy' },
      ],
      required: true,
      admin: {
        description: 'Type of AI provider - cloud services, local installations, or proxy services',
      },
    },
    {
      name: 'authType',
      type: 'select',
      options: [
        { label: 'API Key', value: 'api-key' },
        { label: 'Bearer Token', value: 'bearer' },
        { label: 'OAuth', value: 'oauth' },
        { label: 'No Authentication', value: 'none' },
      ],
      defaultValue: 'api-key',
      required: true,
      admin: {
        description: 'Authentication method required by this provider',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Testing', value: 'testing' },
      ],
      defaultValue: 'active',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Current operational status of the provider',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the provider and its capabilities',
      },
    },
    {
      name: 'documentation',
      type: 'text',
      admin: {
        description: "Link to the provider's API documentation or setup guide",
      },
    },
    // Local Configuration Group
    {
      name: 'localConfig',
      type: 'group',
      admin: {
        condition: (data) => data?.providerType === 'local',
        description: 'Configuration specific to local AI providers',
      },
      fields: [
        {
          name: 'defaultPort',
          type: 'number',
          admin: {
            description:
              'Default port number for local server (e.g., 11434 for Ollama, 1234 for LM Studio)',
          },
        },
        {
          name: 'installationPath',
          type: 'text',
          admin: {
            description: 'Default installation path or executable location',
          },
        },
        {
          name: 'requiresGPU',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether this provider requires GPU acceleration for optimal performance',
          },
        },
        {
          name: 'supportedFormats',
          type: 'array',
          fields: [
            {
              name: 'format',
              type: 'select',
              options: [
                { label: 'GGUF', value: 'gguf' },
                { label: 'GGML', value: 'ggml' },
                { label: 'Safetensors', value: 'safetensors' },
                { label: 'PyTorch', value: 'pytorch' },
                { label: 'ONNX', value: 'onnx' },
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
          ],
          admin: {
            description: 'Model formats supported by this local provider',
          },
        },
        {
          name: 'minSystemRequirements',
          type: 'group',
          fields: [
            {
              name: 'ramGB',
              type: 'number',
              admin: {
                description: 'Minimum RAM required in GB',
              },
            },
            {
              name: 'diskSpaceGB',
              type: 'number',
              admin: {
                description: 'Minimum disk space required in GB',
              },
            },
            {
              name: 'cpuCores',
              type: 'number',
              admin: {
                description: 'Recommended minimum CPU cores',
              },
            },
          ],
        },
      ],
    },
    // Cloud Configuration Group
    {
      name: 'cloudConfig',
      type: 'group',
      admin: {
        condition: (data) => data?.providerType === 'cloud' || data?.providerType === 'proxy',
        description: 'Configuration specific to cloud AI providers',
      },
      fields: [
        {
          name: 'rateLimits',
          type: 'group',
          fields: [
            {
              name: 'requestsPerMinute',
              type: 'number',
              admin: {
                description: 'Default rate limit for requests per minute',
              },
            },
            {
              name: 'tokensPerMinute',
              type: 'number',
              admin: {
                description: 'Default rate limit for tokens per minute',
              },
            },
            {
              name: 'requestsPerDay',
              type: 'number',
              admin: {
                description: 'Default rate limit for requests per day',
              },
            },
          ],
        },
        {
          name: 'regions',
          type: 'array',
          fields: [
            {
              name: 'region',
              type: 'text',
              required: true,
            },
            {
              name: 'endpoint',
              type: 'text',
            },
          ],
          admin: {
            description: 'Available regions and their specific endpoints',
          },
        },
      ],
    },
    // Connection Testing
    {
      name: 'connectionTest',
      type: 'group',
      admin: {
        description: 'Connection testing configuration and results',
      },
      fields: [
        {
          name: 'testEndpoint',
          type: 'text',
          admin: {
            description: 'Specific endpoint to use for connection testing',
          },
        },
        {
          name: 'lastTestDate',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'Last time connection was successfully tested',
          },
        },
        {
          name: 'lastTestStatus',
          type: 'select',
          options: [
            { label: 'Success', value: 'success' },
            { label: 'Failed', value: 'failed' },
            { label: 'Not Tested', value: 'not-tested' },
          ],
          defaultValue: 'not-tested',
          admin: {
            readOnly: true,
            description: 'Result of the last connection test',
          },
        },
        {
          name: 'lastTestError',
          type: 'textarea',
          admin: {
            readOnly: true,
            description: 'Error message from last failed test (if any)',
          },
        },
      ],
    },
    // Metadata
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional provider metadata',
      },
      fields: [
        {
          name: 'website',
          type: 'text',
          admin: {
            description: "Provider's official website",
          },
        },
        {
          name: 'supportContact',
          type: 'text',
          admin: {
            description: 'Support contact information or URL',
          },
        },
        {
          name: 'version',
          type: 'text',
          admin: {
            description: 'Provider version or API version',
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
          ],
          admin: {
            description: 'Tags for categorizing and filtering providers',
          },
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data?.name && !data?.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log provider changes for audit trail
        console.log(`AI Provider ${operation}: ${doc.name} (${doc.slug})`)
      },
    ],
  },
}
