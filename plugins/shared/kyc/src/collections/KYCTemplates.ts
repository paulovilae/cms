import type { CollectionConfig } from 'payload'

export const KYCTemplates: CollectionConfig = {
  slug: 'kyc-templates',
  admin: {
    useAsTitle: 'templateName',
    group: 'KYC Management',
  },
  fields: [
    {
      name: 'templateName',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'templateType',
      type: 'select',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Business', value: 'business' },
        { label: 'Enhanced Due Diligence', value: 'enhanced_due_diligence' },
      ],
      required: true,
    },
    {
      name: 'requiredFields',
      type: 'array',
      fields: [
        {
          name: 'field',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Date', value: 'date' },
            { label: 'File', value: 'file' },
            { label: 'Select', value: 'select' },
          ],
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      name: 'complianceRequirements',
      type: 'json',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
