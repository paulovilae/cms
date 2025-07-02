import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const JobFamilies: CollectionConfig = {
  slug: 'job-families',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access for demo purposes
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parentFamily', 'industryAlignment', 'updatedAt'],
    group: 'Salarium',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Job family name (e.g., "Engineering", "Sales", "Marketing")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Description of this job family and its scope',
      },
    },
    {
      name: 'parentFamily',
      type: 'relationship',
      relationTo: 'job-families',
      admin: {
        description: 'Parent job family for hierarchical structure',
      },
    },
    {
      name: 'industryAlignment',
      type: 'array',
      fields: [
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
          required: true,
        },
        {
          name: 'relevance',
          type: 'select',
          options: [
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
          ],
          defaultValue: 'medium',
          required: true,
        },
      ],
      admin: {
        description: 'Industries where this job family is relevant',
      },
    },
    {
      name: 'commonSkills',
      type: 'array',
      fields: [
        {
          name: 'skill',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'select',
          options: [
            { label: 'Technical', value: 'technical' },
            { label: 'Soft Skills', value: 'soft' },
            { label: 'Leadership', value: 'leadership' },
            { label: 'Communication', value: 'communication' },
            { label: 'Analytical', value: 'analytical' },
            { label: 'Creative', value: 'creative' },
            { label: 'Other', value: 'other' },
          ],
          defaultValue: 'technical',
          required: true,
        },
        {
          name: 'importance',
          type: 'select',
          options: [
            { label: 'Essential', value: 'essential' },
            { label: 'Important', value: 'important' },
            { label: 'Preferred', value: 'preferred' },
          ],
          defaultValue: 'important',
          required: true,
        },
      ],
      admin: {
        description: 'Common skills required for this job family',
      },
    },
    {
      name: 'careerProgression',
      type: 'array',
      fields: [
        {
          name: 'level',
          type: 'text',
          required: true,
          admin: {
            description: 'Career level (e.g., "Junior", "Senior", "Lead")',
          },
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          admin: {
            description: 'Order in progression (1 = entry level)',
          },
        },
        {
          name: 'typicalTitles',
          type: 'array',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Common job titles at this level',
          },
        },
        {
          name: 'experienceRange',
          type: 'group',
          fields: [
            {
              name: 'minYears',
              type: 'number',
              admin: {
                description: 'Minimum years of experience',
              },
            },
            {
              name: 'maxYears',
              type: 'number',
              admin: {
                description: 'Maximum years of experience',
              },
            },
          ],
        },
        {
          name: 'keyResponsibilities',
          type: 'array',
          fields: [
            {
              name: 'responsibility',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Key responsibilities at this level',
          },
        },
        {
          name: 'requiredSkills',
          type: 'array',
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
            },
          ],
          admin: {
            description: 'Skills required at this level',
          },
        },
      ],
      admin: {
        description: 'Career progression levels within this family',
      },
    },
    {
      name: 'relatedFamilies',
      type: 'array',
      fields: [
        {
          name: 'family',
          type: 'relationship',
          relationTo: 'job-families',
          required: true,
        },
        {
          name: 'relationship',
          type: 'select',
          options: [
            { label: 'Similar', value: 'similar' },
            { label: 'Complementary', value: 'complementary' },
            { label: 'Career Path', value: 'career-path' },
            { label: 'Cross-Functional', value: 'cross-functional' },
          ],
          required: true,
        },
      ],
      admin: {
        description: 'Related job families and their relationship',
      },
    },
    {
      name: 'marketData',
      type: 'group',
      admin: {
        description: 'Market and salary information',
      },
      fields: [
        {
          name: 'demandLevel',
          type: 'select',
          options: [
            { label: 'Very High', value: 'very-high' },
            { label: 'High', value: 'high' },
            { label: 'Medium', value: 'medium' },
            { label: 'Low', value: 'low' },
            { label: 'Very Low', value: 'very-low' },
          ],
          admin: {
            description: 'Current market demand for this job family',
          },
        },
        {
          name: 'growthProjection',
          type: 'select',
          options: [
            { label: 'Rapidly Growing', value: 'rapid-growth' },
            { label: 'Growing', value: 'growing' },
            { label: 'Stable', value: 'stable' },
            { label: 'Declining', value: 'declining' },
            { label: 'Rapidly Declining', value: 'rapid-decline' },
          ],
          admin: {
            description: 'Expected growth in the next 5 years',
          },
        },
        {
          name: 'competitiveness',
          type: 'select',
          options: [
            { label: 'Very Competitive', value: 'very-competitive' },
            { label: 'Competitive', value: 'competitive' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Low Competition', value: 'low-competition' },
          ],
          admin: {
            description: 'Competition level for talent in this family',
          },
        },
        {
          name: 'lastUpdated',
          type: 'date',
          admin: {
            description: 'When market data was last updated',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional metadata',
      },
      fields: [
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
            description: 'Tags for categorizing and filtering',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this job family currently active?',
          },
        },
        {
          name: 'createdBy',
          type: 'relationship',
          relationTo: 'users',
          admin: {
            description: 'User who created this job family',
          },
        },
        {
          name: 'lastReviewed',
          type: 'date',
          admin: {
            description: 'When this job family was last reviewed',
          },
        },
        {
          name: 'reviewNotes',
          type: 'textarea',
          admin: {
            description: 'Notes from last review',
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

        // Sort career progression by order
        if (data?.careerProgression && Array.isArray(data.careerProgression)) {
          data.careerProgression.sort((a, b) => (a.order || 0) - (b.order || 0))
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log job family changes for audit trail
        console.log(`Job Family ${operation}: ${doc.name} (${doc.slug})`)
      },
    ],
  },
}
