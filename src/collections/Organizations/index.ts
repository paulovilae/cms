import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Organizations: CollectionConfig = {
  slug: 'organizations',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticated, // Only authenticated users can see organizations
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'domain', 'industry', 'subscription', 'updatedAt'],
    group: 'Salarium',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Organization name',
      },
    },
    {
      name: 'domain',
      type: 'text',
      admin: {
        description: 'Email domain for auto-assignment (e.g., company.com)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Organization description for job postings',
      },
    },
    {
      name: 'industry',
      type: 'select',
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Healthcare', value: 'healthcare' },
        { label: 'Finance', value: 'finance' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Retail', value: 'retail' },
        { label: 'Education', value: 'education' },
        { label: 'Government', value: 'government' },
        { label: 'Non-Profit', value: 'non-profit' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Media', value: 'media' },
        { label: 'Real Estate', value: 'real-estate' },
        { label: 'Transportation', value: 'transportation' },
        { label: 'Energy', value: 'energy' },
        { label: 'Agriculture', value: 'agriculture' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        description: 'Primary industry classification',
      },
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'country',
          type: 'text',
          admin: {
            description: 'Country where organization is based',
          },
        },
        {
          name: 'state',
          type: 'text',
          admin: {
            description: 'State or province',
          },
        },
        {
          name: 'city',
          type: 'text',
          admin: {
            description: 'Primary city location',
          },
        },
        {
          name: 'timezone',
          type: 'select',
          options: [
            { label: 'UTC-12:00', value: 'UTC-12' },
            { label: 'UTC-11:00', value: 'UTC-11' },
            { label: 'UTC-10:00', value: 'UTC-10' },
            { label: 'UTC-09:00', value: 'UTC-9' },
            { label: 'UTC-08:00', value: 'UTC-8' },
            { label: 'UTC-07:00', value: 'UTC-7' },
            { label: 'UTC-06:00', value: 'UTC-6' },
            { label: 'UTC-05:00', value: 'UTC-5' },
            { label: 'UTC-04:00', value: 'UTC-4' },
            { label: 'UTC-03:00', value: 'UTC-3' },
            { label: 'UTC-02:00', value: 'UTC-2' },
            { label: 'UTC-01:00', value: 'UTC-1' },
            { label: 'UTC+00:00', value: 'UTC+0' },
            { label: 'UTC+01:00', value: 'UTC+1' },
            { label: 'UTC+02:00', value: 'UTC+2' },
            { label: 'UTC+03:00', value: 'UTC+3' },
            { label: 'UTC+04:00', value: 'UTC+4' },
            { label: 'UTC+05:00', value: 'UTC+5' },
            { label: 'UTC+06:00', value: 'UTC+6' },
            { label: 'UTC+07:00', value: 'UTC+7' },
            { label: 'UTC+08:00', value: 'UTC+8' },
            { label: 'UTC+09:00', value: 'UTC+9' },
            { label: 'UTC+10:00', value: 'UTC+10' },
            { label: 'UTC+11:00', value: 'UTC+11' },
            { label: 'UTC+12:00', value: 'UTC+12' },
          ],
          defaultValue: 'UTC+0',
        },
      ],
    },
    {
      name: 'subscription',
      type: 'group',
      admin: {
        description: 'Subscription and billing information',
      },
      fields: [
        {
          name: 'plan',
          type: 'select',
          options: [
            { label: 'Free', value: 'free' },
            { label: 'Starter', value: 'starter' },
            { label: 'Professional', value: 'professional' },
            { label: 'Enterprise', value: 'enterprise' },
          ],
          defaultValue: 'free',
          required: true,
        },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Suspended', value: 'suspended' },
            { label: 'Trial', value: 'trial' },
          ],
          defaultValue: 'trial',
          required: true,
        },
        {
          name: 'limits',
          type: 'group',
          fields: [
            {
              name: 'maxUsers',
              type: 'number',
              defaultValue: 5,
              admin: {
                description: 'Maximum number of users allowed',
              },
            },
            {
              name: 'maxTemplates',
              type: 'number',
              defaultValue: 10,
              admin: {
                description: 'Maximum number of templates allowed',
              },
            },
            {
              name: 'maxInstances',
              type: 'number',
              defaultValue: 50,
              admin: {
                description: 'Maximum number of flow instances per month',
              },
            },
            {
              name: 'maxAIRequests',
              type: 'number',
              defaultValue: 100,
              admin: {
                description: 'Maximum AI requests per month',
              },
            },
          ],
        },
        {
          name: 'billingEmail',
          type: 'email',
          admin: {
            description: 'Email for billing notifications',
          },
        },
        {
          name: 'subscriptionStart',
          type: 'date',
          admin: {
            description: 'When subscription started',
          },
        },
        {
          name: 'subscriptionEnd',
          type: 'date',
          admin: {
            description: 'When subscription expires',
          },
        },
      ],
    },
    {
      name: 'branding',
      type: 'group',
      admin: {
        description: 'Organization branding and customization',
      },
      fields: [
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Organization logo',
          },
        },
        {
          name: 'primaryColor',
          type: 'text',
          admin: {
            description: 'Primary brand color (hex code)',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          admin: {
            description: 'Secondary brand color (hex code)',
          },
        },
        {
          name: 'customDomain',
          type: 'text',
          admin: {
            description: 'Custom domain for branded experience',
          },
        },
        {
          name: 'customCSS',
          type: 'textarea',
          admin: {
            description: 'Custom CSS for branding',
          },
        },
      ],
    },
    {
      name: 'settings',
      type: 'group',
      admin: {
        description: 'Organization-specific settings',
      },
      fields: [
        {
          name: 'defaultLanguage',
          type: 'select',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'Portuguese', value: 'pt' },
            { label: 'French', value: 'fr' },
          ],
          defaultValue: 'en',
          required: true,
        },
        {
          name: 'defaultAIProvider',
          type: 'relationship',
          relationTo: 'ai-providers',
          admin: {
            description: 'Default AI provider for this organization',
          },
        },
        {
          name: 'allowPublicTemplates',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Allow users to create public templates',
          },
        },
        {
          name: 'requireApproval',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Require admin approval for new templates',
          },
        },
        {
          name: 'enableCollaboration',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable collaboration features',
          },
        },
        {
          name: 'enableAnalytics',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Enable usage analytics',
          },
        },
      ],
    },
    {
      name: 'users',
      type: 'array',
      admin: {
        description: 'Organization members',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Owner', value: 'owner' },
            { label: 'Admin', value: 'admin' },
            { label: 'Manager', value: 'manager' },
            { label: 'User', value: 'user' },
            { label: 'Viewer', value: 'viewer' },
          ],
          defaultValue: 'user',
          required: true,
        },
        {
          name: 'joinedAt',
          type: 'date',
          defaultValue: () => new Date(),
        },
        {
          name: 'invitedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'usage',
      type: 'group',
      admin: {
        description: 'Usage statistics',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'totalUsers',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total number of users',
          },
        },
        {
          name: 'totalTemplates',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total number of templates created',
          },
        },
        {
          name: 'totalInstances',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Total number of flow instances',
          },
        },
        {
          name: 'monthlyAIRequests',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'AI requests this month',
          },
        },
        {
          name: 'lastActivity',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'Last activity timestamp',
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

        // Update user count
        if (data?.users && Array.isArray(data.users)) {
          data.usage = data.usage || {}
          data.usage.totalUsers = data.users.filter((u) => u.isActive).length
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log organization changes for audit trail
        console.log(`Organization ${operation}: ${doc.name} (${doc.slug})`)
      },
    ],
  },
}
