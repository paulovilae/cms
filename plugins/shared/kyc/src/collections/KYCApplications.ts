import type { CollectionConfig } from 'payload'

export const KYCApplications: CollectionConfig = {
  slug: 'kyc-applications',
  admin: {
    useAsTitle: 'applicationId',
    group: 'KYC Management',
  },
  fields: [
    {
      name: 'applicationId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'applicantType',
      type: 'select',
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Business', value: 'business' },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'In Review', value: 'in_review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Suspended', value: 'suspended' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'personalInfo',
      type: 'group',
      fields: [
        {
          name: 'fullName',
          type: 'text',
          required: true,
        },
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'dateOfBirth',
          type: 'date',
        },
        {
          name: 'nationality',
          type: 'text',
        },
      ],
    },
    {
      name: 'businessInfo',
      type: 'group',
      fields: [
        {
          name: 'companyName',
          type: 'text',
        },
        {
          name: 'registrationNumber',
          type: 'text',
        },
        {
          name: 'businessType',
          type: 'text',
        },
        {
          name: 'incorporationDate',
          type: 'date',
        },
      ],
    },
    {
      name: 'verificationLevel',
      type: 'select',
      options: [
        { label: 'Basic', value: 'basic' },
        { label: 'Enhanced', value: 'enhanced' },
        { label: 'Full', value: 'full' },
      ],
      defaultValue: 'basic',
    },
    {
      name: 'riskScore',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'verification-documents',
      hasMany: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'reviewedAt',
      type: 'date',
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          // Generate unique application ID
          data.applicationId = `KYC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }
        return data
      },
    ],
  },
}
