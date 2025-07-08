import { CollectionConfig } from 'payload'

export const FlowTemplates: CollectionConfig = {
  slug: 'flow-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'isActive', 'updatedAt'],
    group: 'Workflow Engine',
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name for this workflow template',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique identifier for API access',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of what this workflow accomplishes',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Human Resources', value: 'hr' },
        { label: 'Marketing', value: 'marketing' },
        { label: 'Sales', value: 'sales' },
        { label: 'Operations', value: 'operations' },
        { label: 'Finance', value: 'finance' },
        { label: 'Legal', value: 'legal' },
        { label: 'General', value: 'general' },
      ],
      admin: {
        description: 'Category for organizing templates',
      },
    },
    {
      name: 'version',
      type: 'text',
      required: true,
      defaultValue: '1.0.0',
      admin: {
        description: 'Template version for tracking changes',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this template is available for use',
      },
    },
    {
      name: 'aiProvider',
      type: 'relationship',
      relationTo: 'ai-providers',
      admin: {
        description: 'AI provider to use for processing steps',
      },
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Workflow steps in order of execution',
      },
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
            description: 'Display title for this step',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          admin: {
            description: 'Detailed description of what this step accomplishes',
          },
        },
        {
          name: 'questionText',
          type: 'text',
          required: true,
          admin: {
            description: 'Question or prompt shown to the user',
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
          required: true,
          defaultValue: 'text',
          options: [
            { label: 'Text Input', value: 'text' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select Dropdown', value: 'select' },
            { label: 'File Upload', value: 'file-upload' },
            { label: 'Multiple Choice', value: 'multiple-choice' },
          ],
          admin: {
            description: 'Type of input field for this step',
          },
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Whether this step must be completed',
          },
        },
        {
          name: 'validationRules',
          type: 'group',
          admin: {
            description: 'Input validation rules',
          },
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
                description: 'Custom validation message',
              },
            },
          ],
        },
        {
          name: 'selectOptions',
          type: 'array',
          admin: {
            condition: (data, siblingData) => siblingData?.stepType === 'select',
            description: 'Options for select dropdown',
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
            description: 'Step dependencies and conditions',
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
                description: 'Required value from dependent step',
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
              admin: {
                description: 'Condition type for dependency',
              },
            },
          ],
        },
        {
          name: 'aiProviderOverride',
          type: 'relationship',
          relationTo: 'ai-providers',
          admin: {
            description: 'Override AI provider for this specific step',
          },
        },
        {
          name: 'examples',
          type: 'array',
          admin: {
            description: 'Example inputs and outputs for user guidance',
          },
          fields: [
            {
              name: 'userInput',
              type: 'text',
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
                description: 'Expected AI-generated output',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'outputTemplate',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Template for final document generation with placeholders',
      },
    },
    {
      name: 'metadata',
      type: 'group',
      admin: {
        description: 'Additional template metadata',
      },
      fields: [
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Tags for categorization and search',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'difficulty',
          type: 'select',
          defaultValue: 'beginner',
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
          admin: {
            description: 'Complexity level of this workflow',
          },
        },
        {
          name: 'estimatedTime',
          type: 'number',
          defaultValue: 25,
          admin: {
            description: 'Estimated completion time in minutes',
          },
        },
        {
          name: 'industry',
          type: 'array',
          admin: {
            description: 'Industries this template is designed for',
          },
          fields: [
            {
              name: 'industry',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'language',
          type: 'select',
          defaultValue: 'en',
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
            { label: 'Portuguese', value: 'pt' },
            { label: 'French', value: 'fr' },
          ],
          admin: {
            description: 'Primary language for this template',
          },
        },
      ],
    },
    {
      name: 'usage',
      type: 'group',
      admin: {
        description: 'Usage statistics and analytics',
        readOnly: true,
      },
      fields: [
        {
          name: 'timesUsed',
          type: 'number',
          defaultValue: 0,
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'averageCompletionTime',
          type: 'number',
          admin: {
            description: 'Average completion time in minutes',
            readOnly: true,
          },
        },
        {
          name: 'successRate',
          type: 'number',
          admin: {
            description: 'Percentage of successful completions',
            readOnly: true,
          },
        },
        {
          name: 'lastUsed',
          type: 'date',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate slug from name if not provided
        if (operation === 'create' && !data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        // Sort steps by stepNumber
        if (data.steps && Array.isArray(data.steps)) {
          data.steps.sort((a: any, b: any) => a.stepNumber - b.stepNumber)
        }

        return data
      },
    ],
  },
}
