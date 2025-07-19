import type { CollectionConfig } from 'payload'

export const MilestoneEvidence: CollectionConfig = {
  slug: 'milestone-evidence',
  admin: {
    useAsTitle: 'title',
    group: 'Escrow',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'milestone',
      type: 'relationship',
      relationTo: 'milestones',
      required: true,
    },
    {
      name: 'evidenceType',
      type: 'select',
      options: [
        { label: 'Photo', value: 'photo' },
        { label: 'Document', value: 'document' },
        { label: 'Video', value: 'video' },
        { label: 'Other', value: 'other' },
      ],
      required: true,
    },
    {
      name: 'files',
      type: 'array',
      fields: [
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'submissionDate',
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
