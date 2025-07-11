import { CollectionConfig } from 'payload'
import { SectionType, BusinessPayloadRequest } from '../types'

/**
 * FlowTemplates Collection
 *
 * This collection stores reusable templates for creating flow documents.
 * Templates define the structure, sections, and AI configuration for documents.
 */
export const FlowTemplates: CollectionConfig = {
  slug: 'job-flow-templates',
  dbName: 'jf_templates',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'businessUnit', 'isActive', 'updatedAt'],
    group: 'Job Flow',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Template Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Detailed description of what this template is used for',
      },
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
      admin: {
        description: 'Category for organizing templates (e.g., "Job Descriptions", "Contracts")',
      },
    },
    {
      name: 'businessUnit',
      type: 'select',
      options: [
        { label: 'Salarium', value: 'salarium' },
        { label: 'IntelliTrade', value: 'intellitrade' },
        { label: 'Latinos', value: 'latinos' },
        { label: 'Capacita', value: 'capacita' },
        { label: 'All', value: 'all' },
      ],
      defaultValue: 'all',
      label: 'Business Unit',
      admin: {
        description: 'Which business unit this template is designed for',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Whether this template is available for use',
      },
    },
    // Section templates array
    {
      name: 'sections',
      type: 'array',
      label: 'Section Templates',
      dbName: 'sections',
      admin: {
        description: 'Define the sections that will be created when using this template',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Section Title',
        },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            // Content types
            { label: 'Introduction', value: SectionType.INTRODUCTION },
            { label: 'Summary', value: SectionType.SUMMARY },
            { label: 'Responsibilities', value: SectionType.RESPONSIBILITIES },
            { label: 'Requirements', value: SectionType.REQUIREMENTS },
            { label: 'Qualifications', value: SectionType.QUALIFICATIONS },
            { label: 'Benefits', value: SectionType.BENEFITS },
            { label: 'Custom', value: SectionType.CUSTOM },
            // Input types
            { label: 'Text Input', value: 'text_input' },
            { label: 'Rich Text', value: 'rich_text' },
            { label: 'Multiple Choice', value: 'multiple_choice' },
            { label: 'Checkbox', value: 'checkbox' },
            { label: 'Radio Group', value: 'radio_group' },
            { label: 'Date Input', value: 'date_input' },
            { label: 'File Upload', value: 'file_upload' },
            { label: 'AI Generated', value: 'ai_generated' },
          ],
          defaultValue: SectionType.INTRODUCTION,
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          label: 'Display Order',
          defaultValue: 0,
        },
        // Input configuration for this section template
        {
          name: 'inputConfig',
          type: 'group',
          label: 'Input Configuration',
          fields: [
            {
              name: 'placeholder',
              type: 'text',
              label: 'Placeholder Text',
            },
            {
              name: 'defaultValue',
              type: 'text',
              label: 'Default Value',
            },
            {
              name: 'minLength',
              type: 'number',
              label: 'Minimum Length',
            },
            {
              name: 'maxLength',
              type: 'number',
              label: 'Maximum Length',
            },
            {
              name: 'isRequired',
              type: 'checkbox',
              defaultValue: false,
              label: 'Required Field',
            },
            {
              name: 'validationRules',
              type: 'array',
              label: 'Validation Rules',
              fields: [
                {
                  name: 'rule',
                  type: 'text',
                  required: true,
                  label: 'Validation Rule',
                },
                {
                  name: 'errorMessage',
                  type: 'text',
                  label: 'Error Message',
                },
              ],
            },
            {
              name: 'options',
              type: 'array',
              label: 'Input Options',
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Option Label',
                },
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  label: 'Option Value',
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Option Description',
                },
              ],
            },
          ],
        },
        // AI configuration for this section template
        {
          name: 'aiConfig',
          type: 'group',
          label: 'AI Configuration',
          fields: [
            {
              name: 'systemPrompt',
              type: 'textarea',
              label: 'System Prompt',
            },
            {
              name: 'exampleResponse',
              type: 'textarea',
              label: 'Example Response',
            },
            {
              name: 'inputMapping',
              type: 'json',
              label: 'Input Mapping',
            },
            {
              name: 'temperature',
              type: 'number',
              defaultValue: 0.7,
              label: 'AI Temperature',
            },
          ],
        },
        {
          name: 'defaultContent',
          type: 'json',
          label: 'Default Content',
          admin: {
            description: 'Default rich text content for this section',
          },
        },
        {
          name: 'dependencies',
          type: 'array',
          label: 'Dependencies',
          admin: {
            description: 'Other sections this section depends on',
          },
          fields: [
            {
              name: 'sectionTitle',
              type: 'text',
              label: 'Dependent Section Title',
            },
          ],
        },
      ],
    },
    // AI Provider configuration (optional since collection may not exist)
    {
      name: 'defaultAiProvider',
      type: 'text',
      label: 'Default AI Provider ID',
      admin: {
        description: 'ID of the default AI provider for this template',
      },
    },
    {
      name: 'globalSystemPrompt',
      type: 'textarea',
      label: 'Global System Prompt',
      admin: {
        description: 'System prompt that applies to all sections in this template',
      },
    },
    // Workflow configuration
    {
      name: 'workflow',
      type: 'group',
      label: 'Workflow Configuration',
      fields: [
        {
          name: 'enableCascade',
          type: 'checkbox',
          defaultValue: true,
          label: 'Enable Cascade',
          admin: {
            description: 'Allow automatic generation of subsequent sections',
          },
        },
        {
          name: 'requireApproval',
          type: 'checkbox',
          defaultValue: false,
          label: 'Require Approval',
          admin: {
            description: 'Require user approval before generating each section',
          },
        },
        {
          name: 'maxConcurrentSections',
          type: 'number',
          defaultValue: 1,
          label: 'Max Concurrent Sections',
          admin: {
            description: 'Maximum number of sections to generate simultaneously',
          },
        },
      ],
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Metadata',
      admin: {
        description: 'Additional template-specific metadata',
      },
    },
  ],
  timestamps: true,
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        // Set business unit from context if not provided
        const businessContext = (req as any).businessContext
        if (!data.businessUnit && businessContext?.business) {
          data.businessUnit = businessContext.business
        }
        return data
      },
    ],
  },
}

export default FlowTemplates
