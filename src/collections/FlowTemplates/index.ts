import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const FlowTemplates: CollectionConfig = {
  slug: 'flow-templates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Public read access for demo purposes
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'version', 'isActive', 'updatedAt'],
    group: 'Salarium',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Template name (e.g., "Job Description Creation")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Template purpose and usage instructions',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Human Resources', value: 'hr' },
        { label: 'Legal', value: 'legal' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Operations', value: 'operations' },
        { label: 'Finance', value: 'finance' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
      admin: {
        description: 'Template category for organization',
      },
    },
    {
      name: 'version',
      type: 'text',
      defaultValue: '1.0.0',
      required: true,
      admin: {
        description: 'Template version (semantic versioning)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Enable/disable template for use',
      },
    },
    {
      name: 'aiProvider',
      type: 'relationship',
      relationTo: 'ai-providers',
      required: true,
      admin: {
        description: 'Default AI provider for this template',
      },
    },
    {
      name: 'steps',
      type: 'array',
      fields: [
        {
          name: 'stepNumber',
          type: 'number',
          required: true,
          admin: {
            description: 'Order of this step in the workflow',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Step title (e.g., "Job Title")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Instructions for this step',
          },
        },
        {
          name: 'questionText',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Question presented to the user',
          },
        },
        {
          name: 'systemPrompt',
          type: 'textarea',
          required: true,
          admin: {
            description: 'AI system prompt for processing user input',
          },
        },
        {
          name: 'stepType',
          type: 'select',
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Long Text', value: 'textarea' },
            { label: 'Select Option', value: 'select' },
            { label: 'File Upload', value: 'file-upload' },
            { label: 'Multiple Choice', value: 'multiple-choice' },
          ],
          defaultValue: 'textarea',
          required: true,
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Is this step mandatory?',
          },
        },
        {
          name: 'validationRules',
          type: 'group',
          fields: [
            {
              name: 'minLength',
              type: 'number',
              admin: {
                description: 'Minimum character length',
              },
            },
            {
              name: 'maxLength',
              type: 'number',
              admin: {
                description: 'Maximum character length',
              },
            },
            {
              name: 'pattern',
              type: 'text',
              admin: {
                description: 'Regex pattern for validation',
              },
            },
            {
              name: 'customMessage',
              type: 'text',
              admin: {
                description: 'Custom validation error message',
              },
            },
          ],
        },
        {
          name: 'selectOptions',
          type: 'array',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.stepType === 'select' || siblingData?.stepType === 'multiple-choice',
            description: 'Options for select/multiple choice steps',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'dependencies',
          type: 'group',
          admin: {
            description: 'Conditional logic for showing this step',
          },
          fields: [
            {
              name: 'dependsOnStep',
              type: 'number',
              admin: {
                description: 'Step number this depends on',
              },
            },
            {
              name: 'requiredValue',
              type: 'text',
              admin: {
                description: 'Required value to show this step',
              },
            },
            {
              name: 'condition',
              type: 'select',
              options: [
                { label: 'Equals', value: 'equals' },
                { label: 'Contains', value: 'contains' },
                { label: 'Not Empty', value: 'not-empty' },
                { label: 'Greater Than', value: 'greater-than' },
                { label: 'Less Than', value: 'less-than' },
              ],
              defaultValue: 'equals',
            },
          ],
        },
        {
          name: 'aiProviderOverride',
          type: 'relationship',
          relationTo: 'ai-providers',
          admin: {
            description: 'Override template AI provider for this step',
          },
        },
        {
          name: 'examples',
          type: 'array',
          admin: {
            description: 'Example inputs and outputs for guidance',
          },
          fields: [
            {
              name: 'userInput',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Example user input',
              },
            },
            {
              name: 'expectedOutput',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Expected AI output',
              },
            },
          ],
        },
      ],
      admin: {
        description: 'Workflow steps in order',
      },
    },
    {
      name: 'outputTemplate',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Final document template with placeholders (e.g., {{jobTitle}}, {{mission}})',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional template information',
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
            description: 'Tags for categorizing and filtering templates',
          },
        },
        {
          name: 'difficulty',
          type: 'select',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          defaultValue: 'beginner',
        },
        {
          name: 'estimatedTime',
          type: 'number',
          admin: {
            description: 'Estimated completion time in minutes',
          },
        },
        {
          name: 'industry',
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
                { label: 'Other', value: 'other' },
              ],
              required: true,
            },
          ],
          admin: {
            description: 'Industries this template is suitable for',
          },
        },
        {
          name: 'language',
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
      ],
    },
    {
      name: 'usage',
      type: 'group',
      admin: {
        description: 'Usage statistics and tracking',
        position: 'sidebar',
      },
      fields: [
        {
          name: 'timesUsed',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
            description: 'Number of times this template has been used',
          },
        },
        {
          name: 'averageCompletionTime',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Average completion time in minutes',
          },
        },
        {
          name: 'successRate',
          type: 'number',
          admin: {
            readOnly: true,
            description: 'Percentage of successful completions',
          },
        },
        {
          name: 'lastUsed',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'Last time this template was used',
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

        // Sort steps by stepNumber
        if (data?.steps && Array.isArray(data.steps)) {
          data.steps.sort((a, b) => (a.stepNumber || 0) - (b.stepNumber || 0))
        }

        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log template changes for audit trail
        console.log(`Flow Template ${operation}: ${doc.name} (${doc.slug})`)
      },
    ],
  },
}
